from django.db import models
from django.contrib.auth.models import User

class Device(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='devices')
    name = models.CharField(max_length=100)  # Friendly name like "My Laptop"
    device_id = models.CharField(max_length=128, unique=True)
    ssh_host = models.GenericIPAddressField()  # e.g., "192.168.1.100"
    ssh_port = models.IntegerField(default=22)
    ssh_username = models.CharField(max_length=100)
    ssh_password = models.CharField(max_length=128)  # You should encrypt this in production

    created_at = models.DateTimeField(auto_now_add=True)
    last_seen = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.device_id})"

    class Meta:
        unique_together = ('user', 'device_id')
