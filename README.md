# Omniwhere Technologies 🌐

**Your OS. Your Files. Anywhere. On Any Device.**

Omniwhere is a new way of thinking about computing. It’s not just remote access — it’s your **entire digital life**, portable and persistent, accessible from **any device** with a browser. Powered by a **UNIX-based ecosystem**, Omniwhere offers a seamless, secure experience whether you’re running natively or connecting remotely.

---

## 🧠 What is Omniwhere?

At its core, **Omniwhere is a cloud-native OS-like environment** — built to provide remote system-level access, real-time sessions, and device synchronization across your personal machines. It unifies your computing experience from mobile, browser, or any terminal.

You can:
- Run **Omniwhere OS** as your **primary system** or live ISO
- Install the **Omniwhere agent** on existing devices
- **Access your sessions via browser** — no apps, no downloads
- Securely SSH into registered machines from anywhere

---

## ✨ Key Features

- 🌍 Web login & dashboard via React UI
- 🔐 JWT-based secure authentication (via Django)
- 🖥️ Live terminal access using xterm.js
- 📂 Remote file system browsing via SSH
- 🧠 Personal cloud OS session from any browser
- 🧩 Easy extensibility and agent-based device registration
- 💽 Bootable Omniwhere OS ISO (planned)

---

## 🔧 Tech Stack (MVP)

**Backend:**
- Django + Django REST Framework
- SimpleJWT for authentication
- Django Channels for WebSocket support
- Paramiko/Pexpect for SSH connections

**Frontend:**
- React (Vite-based) + Tailwind CSS
- xterm.js for real-time terminal emulation
- React Router for page navigation (Login, Dashboard, etc.)

**Agent:**
- Bash script to:
  - Register devices
  - Open reverse SSH tunnels
  - Provide identity and heartbeat to backend

---

## 📁 Project Structure

```plaintext
omniwhere/
├── backend/               # Django project (auth, DB, file API, WebSocket)
│   ├── omniwhere/         # Django core (asgi.py, settings.py, urls.py)
│   ├── core/              # App with views, models, API endpoints
│   └── requirements.txt   # Django, DRF, channels, paramiko, etc.
├── frontend/              # React (Vite + Tailwind) SPA
│   ├── src/pages/         # Login, Dashboard, etc.
│   ├── src/components/    # Navbar, Terminal, FileExplorer
│   ├── App.tsx
│   └── main.tsx
├── device-agent/          # Bash agent to register device + reverse tunnel
│   ├── agent.sh
│   └── config/.omniwhere-agent.conf
└── README.md
