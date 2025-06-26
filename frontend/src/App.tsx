import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Terminal from './components/Terminal';
import TerminalPage from './pages/TerminalPage';
import FilesExplorer from './pages/FileExplorer';
import DeviceManager from './pages/ManageDevices';
import Dashboard from "./pages/Dashboard";
import {Navigate } from 'react-router-dom';
import { logout } from "./utils/logout";
import Navbar from './components/Navbar';

function App(){

    function isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    function PrivateRoute({ children }: { children: JSX.Element }) {
        return isAuthenticated() ? children : <Navigate to="/login" replace />;
    }

    function Logout() {
          logout(); // Executes logout and redirects
          return null;
        }

    return(
        <Router>
          {/* <Navbar/> */}
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
                         <FilesExplorer deviceId={localStorage.getItem("device_id")}/>
                       </PrivateRoute>
                     }
                    />
                    <Route
                     path="/devices"
                     element={
                       <PrivateRoute>
                         <DeviceManager/>
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