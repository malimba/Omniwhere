# Omniwhere Technologies 🌐  
**Your OS. Your Files. Anywhere. On Any Device.**

Omniwhere is a reimagined computing experience — not just remote access, but your entire digital environment, **portable and persistent**, and accessible from any device, anywhere in the world.

We’re building a **UNIX-based, cloud-native ecosystem** that bridges the convenience of browser-based access with the power and extensibility of a native operating system.

---

## 🧭 Vision

> **Omniwhere aims to blur the boundary between your local and remote environments.**  
> Wherever you go, your OS, tools, files, and sessions follow.

Through a seamless interface and secure backend architecture, Omniwhere provides the freedom to **log into your own personalized computing environment** — from any browser, terminal, or future bootable device.

This is just the beginning of a broader vision: an interoperable system that gives users full control over how, where, and when they access their digital workspace.

---

## ✨ Core Capabilities

- 🌍 **Web-based OS Access**: Reach your personalized environment from any modern browser  
- 🔐 **Secure Auth**: JWT-backed authentication with user-based session control  
- 💻 **Live Terminal Sessions**: SSH-enabled terminal over WebSockets with xterm.js  
- 📁 **Remote File System Viewer**: Explore and interact with device files  
- ⚙️ **Agent-Powered Devices**: Lightweight script registers and exposes devices securely  
- 🧩 **Modular Design**: Built to scale with plugins and future system-level integrations  

---

## 🔧 Tech Stack (MVP)

**Backend**  
- Django + Django REST Framework  
- Django Channels (WebSocket sessions)  
- SimpleJWT for authentication  
- Paramiko & AsyncSSH for device interaction  

**Frontend**  
- React (Vite) + TailwindCSS  
- xterm.js for live shell access  
- React Router for multi-page UX  

**Device Agent**  
- Bash script for:
  - Device registration
  - Reverse SSH tunneling
  - Heartbeat and identification

---

## 📁 Project Structure

```plaintext
omniwhere/
├── backend/               # Django core + API + WebSocket server
│   ├── omniwhere/         # ASGI config, settings, URLs
│   ├── core/              # Auth, SSH, file APIs
│   └── requirements.txt
├── frontend/              # Vite + React SPA
│   ├── src/pages/         # Login, Dashboard
│   ├── src/components/    # Nav, Terminal, FileExplorer
│   ├── App.tsx
│   └── main.tsx
├── device-agent/          # Remote agent script
│   ├── agent.sh
│   └── config/.omniwhere-agent.conf
└── README.md


---

## 🧪 Status

> MVP in active development.  
> Looking for contributors with experience in:  
> - SSH/WebSocket systems  
> - Browser virtualization / remote shell UX  
> - OS packaging or embedded Linux scripting  

---

## 🤝 Want to Contribute?

Open an issue, suggest a feature, or fork and build — all contributions are welcome.  
For direct collaboration, reach out to mailto: malimbageorgeyandanbon@gnmail.com.
