import { useEffect, useState } from 'react'
import api from '../api'

interface Device {
  device_id: string
  name: string
  ssh_host: string
  ssh_port: number
  last_seen: string
}

export default function ManageDevices() {
  const [devices, setDevices] = useState<Device[]>([])
  const [error, setError] = useState<string | null>(null)

  const token = localStorage.getItem('token')

  async function fetchDevices() {
    try {
      setError(null)
      const res = await api.get('/devices/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setDevices(res.data)
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to load devices')
    }
  }

  async function deleteDevice(deviceId: string) {
    if (!confirm('Are you sure you want to delete this device?')) return

    try {
      await api.delete(`/devices/${deviceId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      fetchDevices() // refresh device list
    } catch (e: any) {
      setError(e.response?.data?.error || 'Delete failed')
    }
  }

  useEffect(() => {
    fetchDevices()
  }, [])

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">🖥️ Manage Devices</h1>

      {error && <div className="text-red-600 mb-2">{error}</div>}

      <ul className="border rounded p-2 max-h-[500px] overflow-auto bg-gray-50">
        {devices.length === 0 && <li>No devices registered</li>}

        {devices.map((device) => (
          <li key={device.device_id} className="flex justify-between items-center p-2 hover:bg-gray-100">
            <div>
              <p className="font-bold">{device.name}</p>
              <p className="text-sm text-gray-600">Device ID: {device.device_id}</p>
              <p className="text-sm text-gray-600">SSH: {device.ssh_host}:{device.ssh_port}</p>
              <p className="text-sm text-gray-600">Last Seen: {new Date(device.last_seen).toLocaleString()}</p>
            </div>
            <button
              onClick={() => deleteDevice(device.device_id)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
