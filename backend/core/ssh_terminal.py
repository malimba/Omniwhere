import asyncssh
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import os

"""
🔐 SSH Key-Based Authentication Setup for Omniwhere Terminal

To enable secure password-less SSH access for the backend terminal over WebSocket:

1. ✅ Generate a new SSH key pair with NO passphrase (for unattended use):
   Run this in your terminal:
       ssh-keygen -t rsa -b 4096 -f ~/.ssh/omniwhere_id_rsa -N ""

   - `-f ~/.ssh/omniwhere_id_rsa`: Save key with a specific name
   - `-N ""`: Empty passphrase (required for non-interactive authentication)

2. 🪪 Add the public key to the authorized keys for the target SSH user (`malimba`):
       cat ~/.ssh/omniwhere_id_rsa.pub >> ~/.ssh/authorized_keys
       chmod 600 ~/.ssh/authorized_keys

3. ⚙️ Ensure proper permissions for SSH to work:
       chmod 700 ~/.ssh
       chmod 600 ~/.ssh/omniwhere_id_rsa
       chmod 644 ~/.ssh/omniwhere_id_rsa.pub

4. 🧠 In the backend (this file), set `client_keys=[path_to_key]` in asyncssh.connect

5. 🚫 (Optional for production): Disable password-based login for extra security:
       Edit /etc/ssh/sshd_config:
           PasswordAuthentication no
       Then restart the SSH service:
           sudo systemctl restart ssh

This allows Omniwhere to open secure, interactive SSH sessions using keys only.
"""

class SSHTerminalConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.device_id = self.scope['url_route']['kwargs']['device_id']
        await self.accept()

        self.host = "localhost"
        self.port = 22
        self.username = "malimba"
        self.private_key_path = os.path.expanduser("~/.ssh/omniwhere_id_rsa")

        try:
            self.ssh_conn = await asyncssh.connect(
                self.host,
                port=self.port,
                username=self.username,
                client_keys=[self.private_key_path],
                known_hosts=None  # Don't verify host key (dev only)
            )

            self.channel, _ = await self.ssh_conn.create_session(
                lambda: SSHStream(self), term_type='xterm'
            )

        except Exception as e:
            await self.send(text_data=f"[SSH ERROR] Failed to connect: {str(e)}")
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'ssh_conn'):
            self.ssh_conn.close()
            await self.ssh_conn.wait_closed()

    async def receive(self, text_data):
        if hasattr(self, 'channel'):
            self.channel.write(text_data)

    async def send_output(self, data):
        await self.send(text_data=data)


class SSHStream(asyncssh.SSHClientSession):
    def __init__(self, consumer):
        self.consumer = consumer

    def data_received(self, data, datatype):
        asyncio.create_task(self.consumer.send_output(data))

    def connection_lost(self, exc):
        pass
