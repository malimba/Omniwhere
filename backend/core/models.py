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
    root_path = models.CharField(max_length=256, blank=True)  # todo: dynamically set when device is registered
    created_at = models.DateTimeField(auto_now_add=True)
    last_seen = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.root_path:
            self.root_path = f"/home/{self.user.username}" #assuminng the username used to login is the same as the user profile on the home machine
        super().save(*args, **kwargs)
    def __str__(self):
        return f"{self.name} ({self.device_id})"

    class Meta:
        unique_together = ('user', 'device_id')
