from django.urls import path
from .views import CustomTokenObtainPairView, RegisterDeviceView, FileListView, LogoutView, DeviceFileDownloadView, DeviceListView,DeviceDeleteView

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register_device/', RegisterDeviceView.as_view()),
    path('devices/<str:device_id>/files/', FileListView.as_view()),
    path("devices/<str:device_id>/files/download/", DeviceFileDownloadView.as_view(), name="device-file-download"),
    path('devices/', DeviceListView.as_view(), name='device-list'),
    path('devices/<str:device_id>/', DeviceDeleteView.as_view(), name='device-delete'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
