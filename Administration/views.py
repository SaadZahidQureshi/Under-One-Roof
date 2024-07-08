from django.shortcuts import render

# authentication views
def login(request):
    return render (request, 'authentication/login.html')

def forgot_password(request):
    return render(request, 'authentication/forgot-password.html')

def code_verify(request):
    return render(request, 'authentication/code-verify.html')

def reset_password(request):
    return render (request, 'authentication/reset-password.html')

# users views
def users(request):
    context = {}
    context['active_sidebar'] = 'users'
    context['range'] = range(0, 10)
    return render(request, 'user/users.html', context)

# shows views
def shows(request):
    context = {}
    context['active_sidebar'] = 'shows'
    context['range'] = range(0, 10)
    return render(request, 'show/shows.html', context)

# product_types views
def product_types(request):
    context = {}
    context['active_sidebar'] = 'product_types'
    context['range'] = range(0, 5)
    return render(request, 'product-type/product-types.html', context)

# categories views
def categories(request):
    context = {}
    context['active_sidebar'] = 'categories'
    context['range'] = range(0, 5)
    return render(request, 'category/categories.html', context)

# orders views
def orders(request):
    context = {}
    context['active_sidebar'] = 'orders'
    context['range'] = range(0, 5)
    return render(request, 'orders/orders.html', context)

# profile_settings views
def profile_settings(request):
    context = {}
    context['active_sidebar'] = 'profile_settings'
    context['range'] = range(0, 5)
    return render(request, 'profile/profile-setting.html', context)