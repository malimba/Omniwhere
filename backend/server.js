// omniwhere/backend/server.js

const WebSocket = require('ws');
const pty = require('node-pty');
const os = require('os');

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

const wss = new WebSocket.Server({ port: 3001 }, () => {
  console.log('WebSocket server running on ws://localhost:3001');
});

wss.on('connection', (ws) => {
  console.log('Client connected');

  const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env,
  });

  // Terminal → WebSocket
  ptyProcess.on('data', (data) => {
    ws.send(data);
  });

  // WebSocket → Terminal
  ws.on('message', (msg) => {
    ptyProcess.write(msg);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    ptyProcess.kill();
  });
});
