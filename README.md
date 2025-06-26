# Omniwhere Technologies 🌐

**Your OS. Your Files. Anywhere. On Any Device.**

Omniwhere is a reimagined computing experience — not just remote access, but your entire digital environment, **portable and persistent**, and accessible from any device, anywhere in the world.

We’re building a **UNIX-based, cloud-native ecosystem** that bridges the convenience of browser-based access with the power and extensibility of a native operating system.

---

## 🧱 Vision

> **Omniwhere aims to blur the boundary between your local and remote environments.**
> Wherever you go, your OS, tools, files, and sessions follow.

Through a seamless interface and secure backend architecture, Omniwhere provides the freedom to **log into your own personalized computing environment** — from any browser, terminal, or future bootable device.

This is just the beginning of a broader vision: an interoperable system that gives users full control over how, where, and when they access their digital workspace.

---

## ✨ Core Capabilities

* 🌍 **Web-based OS Access**: Reach your personalized environment from any modern browser
* 🔐 **Secure Auth**: JWT-backed login with session persistence
* 💻 **Live Terminal Sessions**: SSH-enabled terminal via WebSocket + xterm.js
* 📁 **Remote File Viewer**: Explore, upload, download, and manage remote files
* ⚙️ **Device Agent Integration**: Lightweight script to expose local machines to the cloud
* 🧩 **Modular Architecture**: Designed to scale, with pluggable components

---

## 🔧 Tech Stack (MVP)

### Backend

* Django + Django REST Framework
* Django Channels (ASGI for real-time communication)
* SimpleJWT for token-based auth
* Paramiko + AsyncSSH for secure remote operations

### Frontend

* React (Vite) + Tailwind CSS
* React Router for routing
* xterm.js for live terminal display
* Axios for API interaction

### Device Agent

* Bash shell script to:

  * Authenticate with backend using stored credentials
  * Register device with unique `device_id`
  * Create a reverse SSH tunnel to expose the local machine
  * Load secure configs from `.omniwhere-agent.conf`

---

## 📁 Project Structure

```plaintext
omniwhere/
├── backend/               # Django core + APIs
│   ├── omniwhere/         # ASGI config, settings, urls
│   ├── core/              # API views, models, WebSocket consumer
│   └── requirements.txt
├── frontend/              # React SPA with Tailwind
│   ├── src/pages/         # Login, Dashboard
│   ├── src/components/    # Navbar, Terminal, FileExplorer
│   ├── App.tsx
│   └── main.tsx
├── device-agent/          # Remote client agent
│   ├── agent.sh           # Bash script to login, register, and tunnel
│   └── config/
│       └── .omniwhere-agent.conf  # Agent config (username, password, backend URL)
└── README.md
```

---

## 🚀 How to Run

### ▶ Backend

```bash
# Inside your project root
cd backend/
source env/bin/activate
python3 -m daphne backend.asgi:application
```

### ▶ Frontend

```bash
cd frontend/
npm install
npm run dev
```

---

## 🛁 Registering a Device with the Agent

To expose a local device for terminal and file access:

1. Fill in the agent config:

```bash
# device-agent/config/.omniwhere-agent.conf
USERNAME=your_username
PASSWORD=your_password
BACKEND_URL=http://localhost:8000
```

2. Run the agent:

```bash
cd device-agent/
bash agent.sh
```

This will:

* Authenticate using your username/password
* Register the device with a `device_id`
* Open a reverse SSH tunnel so the server can access your local machine

---

## 🧪 Status

> MVP is near completion ✅
> Features completed:
>
> * Login system (JWT)
> * Device registration
> * File explorer
> * SSH WebSocket terminal
> * Device agent reverse tunnel

Remaining polish:

* Terminal stability improvements
* UI enhancements
* Docker and deployment pipelines (Not to keen on it. But optional)

---

## 🤝 Want to Contribute?

Open an issue, suggest a feature, or fork and build — all contributions are welcome.
📬 Email: [malimbageorgeyandanbon@gmail.com](mailto:malimbageorgeyandanbon@gmail.com)
