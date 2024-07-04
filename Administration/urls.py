from django.urls import path
from . import views

urlpatterns = [
    # authentication
    path('login/', views.login, name='login'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('code-verify/', views.code_verify, name='code_verify'),
    path('reset-password/', views.reset_password, name='reset_password'),
    
    # users urls
    path('users/', views.users, name='users'),
    
    # sows urls
    path('shows/', views.shows, name='shows'),
    
    
]
