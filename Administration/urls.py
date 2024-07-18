from django.urls import path
from .import views
from .views import AdminLoginView, AdminLogoutView, SendOTPAPIView, VerifyOTPAPIView,PasswordResetView, ProfileSettingView, ShowsViews

urlpatterns = [

    # Admin login
    path("login/", AdminLoginView.as_view(), name="UserLoginView"),
    # send opt
    path("forgot-password/", SendOTPAPIView.as_view(), name="SendOTPAPIView"),
    # code verify
    path("code-verify/", VerifyOTPAPIView.as_view(), name="VerifyOTPAPIView"),
    # reset password
    path("reset-password/", PasswordResetView.as_view(), name="PasswordResetView"),
    # logout    
    path("logout/", AdminLogoutView.as_view(), name="AdminLogoutView"),
    # profile urls
    path('profile-settings/', ProfileSettingView.as_view(), name="profile_settings"),
    # Shows
    path("shows/", ShowsViews.as_view(), name="ShowsViews"),
    
    # users urls
    path('users/', views.users, name='users'),
    # shows urls
    # path('shows/', views.shows, name='shows'),
    # product type urls
    path('product-types/', views.product_types, name="product_types"),
    # categories urls
    path('categories/', views.categories, name="categories"),
    # orders urls
    path('orders/', views.orders, name="orders"),
    
]
