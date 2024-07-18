from django.urls import path
from . import views

from .views import SendOTPAPIView, VerifyOTPAPIView, CreateUserAPIView, UserLogoutView, UserLoginView, SendOTPForgotAPIView, PasswordResetView, ChangePersonalInfoView, ChangePasswordView, DeleteAccountView

urlpatterns = [
    #Home
    path('', views.index, name="index"), 
    
    #aboutus
    path('aboutus', views.about_us, name='about_us'),
    # Payment cards
    path('payment-cards/', views.payment_cards, name='payment_cards'),
    
    # product urls
    path('products/', views.products, name="products"),   
    path('product-details/', views.product_details, name="product_details"),   
    
    #cart urls
    path('cart/', views.cart, name="cart"), 
    
    #order urls
    path('orders/', views.orders, name='orders'),
    path('order-details/', views.order_details, name='order_details'),
    
    # test url
    path('single-ride-regular-fare/', views.test_url, name="test_url"),
    
    
    # SenOTP
    path('send-otp/', SendOTPAPIView.as_view(), name='send-otp-api'),
    # Verify OPT
    path('verify-otp/', VerifyOTPAPIView.as_view(), name='verify-otp'),
    # Signup
    path('create-user/', CreateUserAPIView.as_view(), name='create-user'),
    # Signin
    path('login/', UserLoginView.as_view(), name='login'),
    # Forgot
    path("send-forgot-otp/", SendOTPForgotAPIView.as_view(), name="SendOTPForgotAPIView"),
    # Reset Password
    path('reset-password/', PasswordResetView.as_view(), name='reset-password'),   
    # Update user
    path('personal-information/', ChangePersonalInfoView.as_view(), name='update_user_business'),
    # change-password
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    # Delete account
    path('delete-account/<pk>', DeleteAccountView.as_view(), name='delete_account'),
    # Signout
    path('logout/', UserLogoutView.as_view(), name='logout'),
]
