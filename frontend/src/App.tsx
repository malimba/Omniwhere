import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import TerminalPage from './pages/TerminalPage';
import FilesExplorer from './pages/FileExplorer';
import DeviceManager from './pages/ManageDevices';
import Dashboard from "./pages/Dashboard";
import { logout } from "./utils/logout";

function App() {

  function isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  function PrivateRoute({ children }: { children: React.ReactNode }) {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
  }

  function Logout() {
    logout(); // Executes logout and redirects
    return null;
  }

  const deviceId = localStorage.getItem("device_id") || ""; // ensure it’s a string

  return (
    <Router>
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/terminal/:deviceId"
            element={
              <PrivateRoute>
                <TerminalPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/files/:deviceId"
            element={
              <PrivateRoute>
                <FilesExplorer deviceId={deviceId} />
              </PrivateRoute>
            }
          />
          <Route
            path="/devices"
            element={
              <PrivateRoute>
                <DeviceManager />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
