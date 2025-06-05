import os

from django.http import FileResponse
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser

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
                "last_seen": timezone.now(),
                "root_path": f"/home/{user.username}",
            }
        )

        return Response({
            'message': 'Device registered',
            'device_id': device.device_id,
            'created': created
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)



# File list view via SSH

#helper function
def secure_path_join(base_path, *paths):
    # Prevent directory traversal attacks
    final_path = os.path.abspath(os.path.join(base_path, *paths))
    if not final_path.startswith(os.path.abspath(base_path)):
        raise Exception("Invalid path traversal attempt")
    return final_path
class FileListView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    def get_device(self, device_id, user):
        return get_object_or_404(Device, device_id=device_id, user=user)


    def get(self, request, device_id):
        device = self.get_device(device_id, request.user)

        base_path = device.root_path #todo: redefine this path or just assuming it's the home path
        rel_path = request.query_params.get("path", "")

        try:
            abs_path = secure_path_join(base_path, rel_path)
            if not os.path.exists(abs_path):
                return Response({"error": "Path not found"}, status=404)
            if not os.path.isdir(abs_path):
                return Response({"error": "Not a directory"}, status=400)

            contents = []
            for item in os.listdir(abs_path):
                item_path = os.path.join(abs_path, item)
                contents.append({
                    "name": item,
                    "is_dir": os.path.isdir(item_path),
                    "size": os.path.getsize(item_path) if os.path.isfile(item_path) else None,
                    "path": os.path.relpath(item_path, base_path),
                })

            return Response({
                "current_path": os.path.relpath(abs_path, base_path),
                "contents": contents,
            })
        except Exception as e:
            return Response({"error": str(e)}, status=400)

    def post(self, request, device_id):
        """
        Upload a file to the current directory path.
        Params:
          - path (optional): target directory relative to base_path
          - file (form-data): uploaded file
        """
        device = self.get_device(device_id, request.user)

        base_path = device.root_path
        rel_path = request.query_params.get("path", "")
        abs_path = secure_path_join(base_path, rel_path)

        if not os.path.isdir(abs_path):
            return Response({"error": "Target directory not found"}, status=404)

        upload_file = request.FILES.get("file")
        if not upload_file:
            return Response({"error": "No file uploaded"}, status=400)

        save_path = os.path.join(abs_path, upload_file.name)

        with open(save_path, "wb+") as destination:
            for chunk in upload_file.chunks():
                destination.write(chunk)

        return Response({"message": f"File '{upload_file.name}' uploaded successfully."})

    def delete(self, request, device_id):
        """
        Delete a file or empty directory.
        Params:
          - path (required): relative path of file/dir to delete
        """
        device = self.get_device(device_id, request.user)

        base_path = device.root_path
        rel_path = request.query_params.get("path")
        if not rel_path:
            return Response({"error": "Parameter 'path' required"}, status=400)

        try:
            abs_path = secure_path_join(base_path, rel_path)
            if not os.path.exists(abs_path):
                return Response({"error": "Path not found"}, status=404)

            if os.path.isdir(abs_path):
                os.rmdir(abs_path)  # Only deletes empty dirs
            else:
                os.remove(abs_path)

            return Response({"message": f"'{rel_path}' deleted successfully."})
        except Exception as e:
            return Response({"error": str(e)}, status=400)
#fie download endpoint
class DeviceFileDownloadView(APIView):
    permission_classes = [IsAuthenticated]

    def get_device(self, device_id, user):
        return get_object_or_404(Device, device_id=device_id, user=user)


    def get(self, request, device_id):
        device = self.get_device(device_id, request.user)
        base_path = device.root_path
        rel_path = request.query_params.get("path", "")

        abs_path = secure_path_join(base_path, rel_path)

        if not os.path.isfile(abs_path):
            return Response({"error": "File not found"}, status=404)

        response = FileResponse(open(abs_path, 'rb'), as_attachment=True)
        return response

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