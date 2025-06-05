// src/pages/TerminalPage.tsx
import { useParams } from "react-router-dom";
import Terminal from "../components/Terminal";

export default function TerminalPage() {
  const { deviceId } = useParams<{ deviceId: string }>();

  if (!deviceId) {
    return <p className="text-white p-4">No device ID provided.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-white text-2xl mb-4">Terminal for device: {deviceId}</h1>
      <Terminal deviceId={deviceId} />
    </div>
  );
}
