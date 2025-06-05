from django.urls import path
from .views import CustomTokenObtainPairView, RegisterDeviceView, FileListView, LogoutView

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register_device/', RegisterDeviceView.as_view()),
    path('files/', FileListView.as_view()),
    path('logout/', LogoutView.as_view(), name='logout'),
]
