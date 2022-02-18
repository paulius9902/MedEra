from django.urls import path
from .views import BlacklistTokenUpdateView, ChangePasswordView, UserView
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

app_name = 'users'

urlpatterns = [
    path('token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout', BlacklistTokenUpdateView.as_view(), name='logout'),
    path('change_password', ChangePasswordView.as_view(), name='change_password'),
    path('info', UserView.as_view(), name='info')
]