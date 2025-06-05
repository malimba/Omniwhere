import { useEffect, useRef } from 'react'
import { Terminal } from 'xterm'
import 'xterm/css/xterm.css'

export default function TerminalComponent({ deviceId }: { deviceId: string }) {
  const termRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const term = new Terminal()
    term.open(termRef.current!)
    const socket = new WebSocket(`ws://localhost:8000/ws/term/${deviceId}/`)

    socket.onmessage = e => term.write(e.data)
    term.onData(data => socket.send(data))
  }, [deviceId])

  return <div ref={termRef} className="h-[500px] w-full bg-black" />
}
