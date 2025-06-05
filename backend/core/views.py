import os
from .models import Device
from django.utils import timezone
from asgiref.sync import async_to_sync
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

from django.contrib.auth.models import User
import asyncssh
import asyncio

# Custom JWT Token Serializer to include extra user info
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        # Add more custom claims here if needed
        return token

# JWT Token View
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# Device registration endpoint (Authenticated)


class RegisterDeviceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        device_id = request.data.get("device_id")
        ssh_port = request.data.get("ssh_port", 22)
        ssh_host = request.data.get("ssh_host", "localhost")  # optional
        ssh_username = request.data.get("ssh_username", user.username)  # fallback to Django username
        ssh_password = request.data.get("ssh_password", "")  # optional
        name = request.data.get("name", "My Device")

        if not device_id:
            return Response({'error': 'device_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        device, created = Device.objects.update_or_create(
            user=user,
            device_id=device_id,
            defaults={
                "ssh_port": ssh_port,
                "ssh_host": ssh_host,
                "ssh_username": ssh_username,
                "ssh_password": ssh_password,
                "name": name,
                "last_seen": timezone.now()
            }
        )

        return Response({
            'message': 'Device registered',
            'device_id': device.device_id,
            'created': created
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)



# File list view via SSH
class FileListView(APIView):
    permission_classes = [IsAuthenticated]

    async def get_file_list(self, host, port, username, key_path):
        try:
            async with asyncssh.connect(
                host,
                port=port,
                username=username,
                client_keys=[key_path],
                known_hosts=None  # Don't use in production
            ) as conn:
                result = await conn.run('ls', check=True)
                return result.stdout.strip().split('\n')
        except Exception as e:
            return f"SSH connection failed: {str(e)}"

    def get(self, request):
        # You can replace this with DB lookup or request.user info
        host = request.query_params.get('host', 'localhost')
        port = int(request.query_params.get('port', 22))
        username = request.query_params.get('username', 'malimba')
        key_path = os.path.expanduser("~/.ssh/id_rsa")

        result = async_to_sync(self.get_file_list)(host, port, username, key_path)

        if isinstance(result, str):  # Error string returned
            return Response({"error": result}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"files": result}, status=status.HTTP_200_OK)



#logout view
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)