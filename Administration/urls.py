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
    
    # shows urls
    path('shows/', views.shows, name='shows'),
    
    # product type urls
    path('product-types/', views.product_types, name="product_types"),
    
    
    # categories urls
    path('categories/', views.categories, name="categories"),
    
    # orders urls
    path('orders/', views.orders, name="orders"),
    
    # profile urls
    path('profile-settings/', views.profile_settings, name="profile_settings"),
    
]
