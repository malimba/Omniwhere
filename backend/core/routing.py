from django.urls import re_path
from .ssh_terminal import SSHTerminalConsumer

websocket_urlpatterns = [
    re_path(r'ws/term/(?P<device_id>[a-zA-Z0-9]+)/$', SSHTerminalConsumer.as_asgi()),
]
