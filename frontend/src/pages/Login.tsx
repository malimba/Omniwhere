import { useState, useEffect } from 'react';
import api from '../api'; // axios instance
import { useNavigate } from 'react-router-dom';
import '../assets/styles/Login.css'; // Import the CSS file for styling
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State for error messages
    const [loading, setLoading] = useState(false); // State for login loading indicator
    const [isCheckingAuth, setIsCheckingAuth] = useState(true); // New state to indicate initial auth check
    const [deviceId, setDeviceId] = useState<string | null>(null); // State to store deviceId

    const navigate = useNavigate(); // for navigation

    const isAuthenticated = () => {
        return !!localStorage.getItem('token');
    }

    // Effect to check authentication and redirect
    useEffect(() => {
        if (isAuthenticated()) {
            // If already authenticated, redirect immediately
            navigate('/dashboard', { replace: true });
        } else {
            // If not authenticated, proceed to load device ID and show login form
            setIsCheckingAuth(false);
            const getAndSetDeviceId = async () => {
                try {
                    const fp = await FingerprintJS.load();
                    const result = await fp.get();
                    setDeviceId(result.visitorId);
                } catch (err) {
                    console.error("Failed to get device ID:", err);

                    setError('Could not generate device ID. Please try again.');
                }
            };
            getAndSetDeviceId();
        }
    }, [navigate]); // navigate is a stable function, but good to include in deps

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true);
        setError(''); // Clear previous errors

        // Ensure deviceId is available before attempting login
        if (!deviceId) {
            setError('Device ID not generated yet. Please wait a moment or refresh.');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/login/', { username, password });
            localStorage.setItem('token', response.data.access);

            const registerResponse = await api.post('/register_device/', {
              device_id: deviceId, // Use the deviceId from state
              ssh_port: 22
            }, {
              headers: {
                Authorization: `Bearer ${response.data.access}`
              }
            });

            localStorage.setItem('device_id', registerResponse.data.device_id); // store deviceID in localStorage
            console.log('Login success!');

            navigate('/dashboard'); // Redirect to dashboard UI
        } catch (err: any) {
            setLoading(false);
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail); // Display specific backend error
            } else {
                setError('Login failed. Please check your credentials or network.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Render a loading state while checking authentication
    if (isCheckingAuth) {
        return (
            <div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'white' }}>
                <p>Loading...</p>
            </div>
        );
    }

    // Render the login form only if not authenticated and not currently checking auth
    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2 className="login-title">Welcome Back!</h2>
                <p className="login-subtitle">Sign in to your account</p>

                {error && <div className="error-message">{error}</div>}

                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="login-button" disabled={loading || !deviceId}>
                    {loading ? 'Logging in...' : (deviceId ? 'Login' : 'Loading Device ID...')}
                </button>
            </form>
        </div>
    );
}