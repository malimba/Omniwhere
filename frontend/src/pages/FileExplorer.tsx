import { useEffect, useState } from "react"
import api from '../api'; // axios instance

interface FileItem {
  name: string
  is_dir: boolean
  size: number | null
  path: string
}

export default function FileExplorer({ deviceId }: { deviceId: string }) {

  const [currentPath, setCurrentPath] = useState<string>("")
  const [files, setFiles] = useState<FileItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const token = localStorage.getItem("token") // JWT token

  async function fetchFiles(path = "") {
    try {
      setError(null)
      const res = await api.get(
        `/devices/${localStorage.getItem('device_id')}/files/`,
        {
          params: { path },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setCurrentPath(res.data.current_path)
      setFiles(res.data.contents)
    } catch (e: any) {
      setError(e.response?.data?.error || "Failed to load files")
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [deviceId])

  function navigateToFolder(path: string) {
    fetchFiles(path)
  }

  function goUp() {
    if (!currentPath) return
    const parts = currentPath.split("/")
    parts.pop()
    fetchFiles(parts.join("/"))
  }

  async function handleFileUpload() {
    console.log("Upload clicked with:", uploadFile);

  if (!uploadFile) {
    console.warn("No file selected");
    return;
  }
    setUploading(true)
    setError(null)
    const formData = new FormData()
    formData.append("file", uploadFile)

    try {
      await api.post(
        `/devices/${localStorage.getItem('device_id')}/files/`,
        formData,
        {
          params: { path: currentPath },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      setUploadFile(null)
      fetchFiles(currentPath)
    } catch (e: any) {
      setError(e.response?.data?.error || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  async function deleteFileOrFolder(path: string) {
    if (!confirm(`Delete ${path}? This cannot be undone.`)) return

    try {
      await api.delete(
        `/devices/${localStorage.getItem('device_id')}/files/`,
        {
          params: { path },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      fetchFiles(currentPath)
    } catch (e: any) {
      setError(e.response?.data?.error || "Delete failed")
    }
  }

  async function downloadFile(path: string, name: string) {
    try {
      const res = await api.get(`/devices/${localStorage.getItem('device_id')}/files/download/`,
        {
          params: { path },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      )
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", name)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (e: any) {
      setError("Download failed")
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-2">📁 File Explorer</h1>
      <div className="mb-2 flex gap-2 items-center">
        <button
          disabled={!currentPath}
          onClick={goUp}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Up
        </button>

        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setUploadFile(file);
            e.target.value = ""; // Reset input so same file can be picked again
          }}
        />
        <button
          disabled={!uploadFile || uploading}
          onClick={handleFileUpload}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {error && <div className="text-red-600 mb-2">{error}</div>}

      <p className="mb-2 font-mono text-sm">Current Path: /{currentPath}</p>

      <ul className="border rounded p-2 max-h-[500px] overflow-auto bg-gray-50">
        {files.length === 0 && <li>No files found</li>}

        {files.map((file) => (
          <li
            key={file.path}
            className="flex justify-between cursor-pointer hover:bg-gray-100 p-1 items-center"
          >
            <span
              onClick={() => file.is_dir && navigateToFolder(file.path)}
              className={`flex gap-1 items-center ${
                file.is_dir ? "font-bold" : ""
              }`}
            >
              {file.is_dir ? "📂" : "📄"} {file.name}
            </span>
            <div className="flex gap-2">
              {!file.is_dir && (
                <button
                  onClick={() => downloadFile(file.path, file.name)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Download
                </button>
              )}
              <button
                onClick={() => deleteFileOrFolder(file.path)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
