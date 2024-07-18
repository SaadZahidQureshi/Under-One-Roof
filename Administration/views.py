import json
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.generic import View
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import SetPasswordForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth import update_session_auth_hash

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from UoneR.serializers import UserLoginSerializer, OTPSerializer
from UoneR.forms import UserChangeForm
from .forms import ShowForm
from .models import Show
from UoneR.models import User, OTP
from UnderOneRoof.helper import send_verification_code_email


@login_required(login_url='/administration/login/')
# users views
def users(request):
    context = {}
    context['active_sidebar'] = 'users'
    context['range'] = range(0, 10)
    return render(request, 'user/users.html', context)

@login_required(login_url='/administration/login/')
# product types views
def product_types(request):
    context = {}
    context['active_sidebar'] = 'product_types'
    context['range'] = range(0, 5)
    return render(request, 'product-type/product-types.html', context)

@login_required(login_url='/administration/login/')
# categories views
def categories(request):
    context = {}
    context['active_sidebar'] = 'categories'
    context['range'] = range(0, 5)
    return render(request, 'category/categories.html', context)

@login_required(login_url='/administration/login/')
# orders views
def orders(request):
    context = {}
    context['active_sidebar'] = 'orders'
    context['range'] = range(0, 5)
    return render(request, 'orders/orders.html', context)


class AdminLoginView(APIView):
    template_name = 'authentication/login.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)
    
    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            # Authenticate user
            user = authenticate(email=email, password=password)
            
            if user is not None:
                # Check if user is an admin
                if user.is_staff or user.is_superuser:
                    login(request, user)
                    return Response({'success': True, 'message': 'User logged in'}, status=status.HTTP_200_OK)
                else:
                    return Response({'success': False, 'message': 'You are not authorized to login here.'}, status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({'success': False, 'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class AdminLogoutView(View):
    """
     Logs user out of the dashboard.
    """

    def get(self, request):
        logout(request)
        return JsonResponse({'success': True, 'message': 'logged out!!!'})


class SendOTPAPIView(APIView):
    template_name = 'authentication/forgot-password.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)
    
    def post(self, request, *args, **kwargs):
        serializer = OTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.filter(email=email).first()
            if user is None:
                return Response({'success': False, 'message': 'This email is not registered, singup first.'}, status=status.HTTP_404_NOT_FOUND)
            elif user.role != User.Roles.ADMIN:
                return Response({'success': False, 'message': 'This account is not authorised here.'}, status=status.HTTP_404_NOT_FOUND)
            else:
                token = send_verification_code_email(email)
                if token == False:
                    return Response({'success': False, 'message': 'Could not send email, retry later.'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({'success': True, 'message': 'OTP generated', 'token': token, 'email': email}, status=status.HTTP_200_OK)
        else:
            return Response({'success': False, 'message': 'Invalid email'}, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTPAPIView(APIView):
    template_name =  'authentication/code-verify.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)
    
    def post(self, request, *args, **kwargs):
        try:
            data = request.data  # DRF automatically parses JSON data
            code = data.get('code')
            otp_record = OTP.objects.filter(verification_token=data.get('token')).first()

            if otp_record is None:
                return Response({'success': False, 'message': 'Verification code not found'}, status=status.HTTP_404_NOT_FOUND)
            elif otp_record.used:
                return Response({'success': False, 'message': 'Verification code already used'}, status=status.HTTP_400_BAD_REQUEST)
            elif code != otp_record.code:
                return Response({'success': False, 'message': 'Verification code is invalid'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                otp_record.used = True
                otp_record.save(update_fields=['used'])
                return Response({'success': True, 'message': 'Verification code successfully verified', 'token': data.get('token'), 'email': otp_record.email}, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({'success': False, 'message': 'Something bad happened'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PasswordResetView(APIView):
    template_name =  'authentication/reset-password.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)
    
    def post(self, request):
        context = {}
        try:
            data = json.loads(request.body)
            email = data.get('email', None)
            if email:
                user = User.objects.get(email=email)
                form = SetPasswordForm(data=request.POST, user=user)
                
                if form.is_valid():
                    form.save()
                    return JsonResponse({'success': True, 'message': 'Password is successfully reset'}, status=200)
            else:
                form = None
                return JsonResponse({'success': False, 'message': 'Email not found.'}, status=400)
        except User.DoesNotExist:
            form = None
            return JsonResponse({'success': False, 'message': 'User with the provided email does not exist.'}, status=404)
        except Exception as e:
            form = None
            return JsonResponse({'success': False, 'message': f'An error occurred: {str(e)}'}, status=500)

        context['form'] = form if form else None
        return render(request, self.template_name, context)    


class ProfileSettingView(LoginRequiredMixin, View):
    template_name =  'profile/profile-setting.html'
    login_url = '/administration/login/'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)
    
    def post(self, request, *args, **kwargs):
        context = {}
        user = request.user
        data = json.loads(request.body)
        
        user_form = UserChangeForm(data, request.FILES, instance=user)
        set_password_form = SetPasswordForm(user, data)
        
        if set_password_form.is_valid() and user_form.is_valid():
            user_form.save()
            set_password_form.save()
            update_session_auth_hash(request, user)
            context ['success'] = True
            context['message'] = "Profile and password updated successfully."
        else:
            context ['success'] = False
            errors = dict(user_form.errors.items())  # Convert dict_items to dict
            errors.update(set_password_form.errors)  # Merge set_password_form errors
            errors_list = []
            for field, errors in errors.items():
                for error in errors:
                    errors_list.append(f"{field}: {error}")
            context['message'] = errors_list
        
        return JsonResponse(context)
    
    
class ShowsViews(LoginRequiredMixin, View):
    template_name =  'show/shows.html'
    login_url = '/administration/login/'
    
    def get(self, request, *args, **kwargs):
        context = {}
        context['active_sidebar'] = 'shows'
        shows = Show.objects.filter(user = request.user).order_by('-id')
        context['shows'] = shows
        context['range'] = range(0, 10)
        return render(request, self.template_name, context)

    def post(self, request, *args, **kwargs):
        context = {}
        user = request.user
        data = json.loads(request.body)
        action = data.get('action')
        show_id = data.get('show_id')

        if action == 'delete' and show_id:  # Handle delete action
            show = get_object_or_404(Show, id=show_id, user=user)
            show.delete()
            context['success'] = True
        else:  # Handle create/update action
            if show_id:  # If show_id is provided, update the existing show
                show = get_object_or_404(Show, id=show_id, user=user)
                form = ShowForm(data, instance=show)
            else:  # If no show_id is provided, create a new show
                form = ShowForm(data)

            if form.is_valid():
                show = form.save(commit=False)
                show.user = user
                show.save()
                context['success'] = True
            else:
                context['success'] = False
                errors_list = []
                for field, errors in form.errors.items():
                    for error in errors:
                        errors_list.append(f"{field}: {error}")
                context['errors'] = errors_list

        return JsonResponse(context)

