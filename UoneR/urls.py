from django.urls import path
from . import views


urlpatterns = [
    #Home
    path('', views.index, name="index"), 
    
    #aboutus
    path('aboutus', views.about_us, name='about_us'),
    
    #settings
    path('personal-information/', views.personal_information, name='personal_information'),  
    path('change-password/', views.change_password, name='change_password'),
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
]
