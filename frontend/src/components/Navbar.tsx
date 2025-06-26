// src/components/Navbar.tsx
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center bg-gray-800 text-white p-4 shadow mb-4">
      <div className="text-2xl font-bold">Omniwhere</div>
      <div className="flex gap-4">
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/files/:deviceId" className="hover:underline">File Explorer</Link>
        <Link to="/devices" className="hover:underline">Manage Devices</Link>
        <Link to="/terminal/:deviceId" className="hover:underline">Terminal</Link>
        
      </div>
    </nav>
  )
}
