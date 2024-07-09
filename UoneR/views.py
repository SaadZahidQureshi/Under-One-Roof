from django.shortcuts import render

# Create your views here.

def index(request):
    context = {}
    context['is_login'] = True
    context['hide_nav_func'] = False
    context['range'] = range(0, 50)
    context['active_page'] = 'home'
    
    return render(request, 'dashboard/index.html', context)

def about_us(request):
    context = {}
    context['is_login'] = True
    context['hide_nav_func'] = False
    context['range'] = range(0, 50)
    context['active_page'] = 'about_us'
    
    return render(request, 'aboutus/about_us.html', context)


def personal_information(request):
    context = {}
    context['is_login'] = True
    context['hide_nav_func'] = False
    context['range'] = range(0, 50)
    context['active_page'] = 'settings'
    context['active_sidebar'] = 'personal_information'
    
    return render(request, 'settings/personal-information.html', context)

def change_password(request):
    context = {}
    context['is_login'] = True
    context['hide_nav_func'] = False
    context['range'] = range(0, 50)
    context['active_page'] = 'settings'
    context['active_sidebar'] = 'change_password'
    
    return render(request, 'settings/change-password.html', context)

def payment_cards(request):
    context = {}
    context['is_login'] = True
    context['hide_nav_func'] = False
    context['range'] = range(0, 5)
    context['active_page'] = 'settings'
    context['active_sidebar'] = 'payment_cards'
    
    return render(request, 'settings/payment-cards.html', context)



def products(request):
    context = {}
    context['is_login'] = True
    context['hide_nav_func'] = False
    context['range'] = range(0, 50)
    context['active_page'] = 'products'
    
    return render(request, 'product/products.html', context)

def product_details(request):
    context = {}
    context['is_login'] = True
    context['hide_nav_func'] = False
    context['active_page'] = 'products'
    
    return render(request, 'product/product-details.html', context)

def cart(request):
    context = {}
    context['is_login'] = True
    context['hide_nav_func'] = False
    context['range'] = range(0, 5)
    context['active_page'] = 'cart'
    
    return render(request, 'cart/cart.html', context)

def orders(request):
    context = {}
    context['is_login'] = True
    context['hide_nav_func'] = False
    context['range'] = range(0, 5)
    context['active_page'] = 'orders'
    
    return render(request, 'order/orders.html', context)

def order_details (request):
    context = {}
    context['is_login'] = True
    context['hide_nav_func'] = False
    context['range'] = range(0, 5)
    context['active_page'] = 'orders'
    
    return render(request, 'order/order-details.html', context)

def test_url(request):
    context = {}
    return render(request, 'test/test-file.html', context)