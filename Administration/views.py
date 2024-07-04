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