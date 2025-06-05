import api from '../api'; // your axios instance

export async function logout() {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      await api.post('/logout/', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (err) {
    console.error("Logout failed (server-side):", err);
    // Even if logout fails, we'll still clear the client session
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('device_id');
    window.location.href = '/'; // Redirect to login page
  }
}
