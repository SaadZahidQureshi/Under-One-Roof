import json
from django.shortcuts import render
from django.views.generic import View, DeleteView
from django.http import JsonResponse
from django.contrib.auth import login,logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .forms import UserChangeForm, UserBusinessForm
from .models import OTP, User, UserBusiness
from .serializers import OTPSerializer, UserSerializer, UserLoginSerializer, PasswordResetSerializer
from UnderOneRoof.helper import send_verification_code_email

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

@login_required(login_url='/')
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

@login_required(login_url='/')
def cart(request):
    context = {}
    context['is_login'] = True
    context['hide_nav_func'] = False
    context['range'] = range(0, 5)
    context['active_page'] = 'cart'
    
    return render(request, 'cart/cart.html', context)

@login_required(login_url='/')
def orders(request):
    context = {}
    context['is_login'] = True
    context['hide_nav_func'] = False
    context['range'] = range(0, 5)
    context['active_page'] = 'orders'
    
    return render(request, 'order/orders.html', context)

@login_required(login_url='/')
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


class SendOTPAPIView(APIView):
    
    def post(self, request, *args, **kwargs):
        serializer = OTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.filter(email=email).first()
            if user is not None:
                return Response({'success': False, 'message': 'This email is already registered.'}, status=status.HTTP_404_NOT_FOUND)
            elif user.is_delete:
                return Response({'success': False, 'message': 'This account is deleted.'}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                token = send_verification_code_email(email)
                if token == False:
                    return Response({'success': False, 'message': 'Could not send email, retry later.'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({'success': True, 'message': 'OTP generated', 'token': token}, status=status.HTTP_200_OK)
        else:
            return Response({'success': False, 'message': 'Invalid email'}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        return Response({'success': False, 'message': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTPAPIView(APIView):

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

    def get(self, request, *args, **kwargs):
        return Response({'success': False, 'message': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)
    

class CreateUserAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            if User.objects.filter(email__iexact=serializer.validated_data['email']).exists():
                return Response({'success': False, 'message': 'User already exists'}, status=status.HTTP_409_CONFLICT)
            user = serializer.save()
            login(request, user)
            return Response({'success': True, 'message': 'User created and logged in'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'success': False, 'message': 'Invalid data', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, *args, **kwargs):
        return Response({'success': False, 'message': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)

    
class UserLoginView(APIView):
    permission_classes = [AllowAny]  # Ensure this is a list or tuple

    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            try:
                user = User.objects.get(email__iexact=data['email'])
            except User.DoesNotExist:
                return Response({'success': False, 'message': 'This email is not registered, signup first'}, status=status.HTTP_404_NOT_FOUND)
            
            if not user.check_password(data['password']):
                return Response({'success': False, 'message': 'Password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
            if not user.is_active:
                return Response({'success': False, 'message': 'This account is suspended'}, status=status.HTTP_401_UNAUTHORIZED)
            if user.is_delete:
                return Response({'success': False, 'message': 'This account is deleted.'}, status=status.HTTP_401_UNAUTHORIZED)
            if user.is_staff or user.is_superuser:
                return Response({'success': False, 'message': 'You are not authorized person.'}, status=status.HTTP_403_FORBIDDEN)
             
            login(request, user)
            return Response({'success': True, 'message': 'User logged in'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        return Response({'success': False, 'message': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)
    
    
class UserLogoutView(View):
    """
     Logs user out of the dashboard.
    """
    # template_name = 'product/products.html'

    def get(self, request):
        logout(request)
        return JsonResponse({'success': True, 'message': 'You have successfully logged out.'})


class SendOTPForgotAPIView(APIView):
    
    def post(self, request, *args, **kwargs):
        serializer = OTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.filter(email=email).first()
            if user is None:
                return Response({'success': False, 'message': 'This email is not registered, singup first.'}, status=status.HTTP_404_NOT_FOUND)
            elif user.is_delete:
                return Response({'success': False, 'message': 'This account is deleted.'}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                token = send_verification_code_email(email)
                if token == False:
                    return Response({'success': False, 'message': 'Could not send email, retry later.'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({'success': True, 'message': 'OTP generated', 'token': token}, status=status.HTTP_200_OK)
        else:
            return Response({'success': False, 'message': 'Invalid email'}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        return Response({'success': False, 'message': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)
    
    
class PasswordResetView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            email = data.get('email')
            token = data.get('token')
            password = data.get('password')

            otp_record = OTP.objects.filter(verification_token=token).first()
            user = User.objects.filter(email=email).first()

            if otp_record is None:
                return Response({'success': False, 'message': 'Verification code not found'}, status=status.HTTP_404_NOT_FOUND)
            elif otp_record.used == False:
                return Response({'success': False, 'message': 'Verification code not verified'}, status=status.HTTP_400_BAD_REQUEST)
            elif user is None:
                return Response({'success': False, 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            else:
                user.set_password(password)
                user.save(update_fields=['password'])
                otp_record.delete()
                return Response({'success': True, 'message': 'Password updated successfully'}, status=status.HTTP_200_OK)
        
        return Response({'success': False, 'message': 'Invalid data', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class ChangePersonalInfoView(LoginRequiredMixin, View):
    login_url = '/'
    template_name = 'settings/personal-information.html'
    
    def get(self, request, *args, **kwargs):
        context = {
            'active_page': 'settings',
            'active_sidebar': 'personal_information',
            'form': UserChangeForm(instance=request.user)
        }
        return render(request, self.template_name, context)

    def post(self, request, *args, **kwargs):
        user = request.user
        data = json.loads(request.body) 
        
        user_form = UserChangeForm(data, request.FILES, instance=user)
        user_business_instance = self.get_user_business_instance(user)
        user_business_form = UserBusinessForm(data, instance=user_business_instance)
        
        if user_form.is_valid() and user_business_form.is_valid():
            user_form.save()
            if user_business_instance is None:
                user_business_instance = user_business_form.save(commit=False)
                user_business_instance.user = user  # Assign the user instance
            user_business_instance.save()
            
            response = {
                'success': True,
                'message': 'Your account details were successfully updated!'
            }
            return JsonResponse(response)

        context = {
            'form': user_form,
            'active_page': 'settings',
            'active_sidebar': 'personal_information',
        }
        return render(request, self.template_name, context)

    def get_user_business_instance(self, user):
        try:
            user_business_instance = UserBusiness.objects.get(user=user)
        except UserBusiness.DoesNotExist:
            user_business_instance = None
        return user_business_instance
    

class ChangePasswordView(LoginRequiredMixin, View):
    login_url = '/'
    template_name = 'settings/change-password.html'

    def get(self, request, *args, **kwargs):
        form = PasswordChangeForm(request.user)
        context = {
            'form': form,
            'active_page': 'settings',
            'active_sidebar': 'change_password'
        }
        return render(request, self.template_name, context)

    def post(self, request, *args, **kwargs):
        user = request.user
        data = json.loads(request.body)        
        form = PasswordChangeForm(user, data)

        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)
            response_data = {
                'success': True,
                'message': 'Your password was successfully updated!'
            }
            return JsonResponse(response_data)
        else:
            errors_list = []
            for field, errors in form.errors.items():
                for error in errors:
                    errors_list.append(f"{field}: {error}")
            response_data = {
                'success': False,
                'errors': errors_list
            }
            return JsonResponse(response_data)
        
        
class DeleteAccountView(LoginRequiredMixin, DeleteView):
    model = User 
    login_url = '/'

    def delete(self, request, *args, **kwargs):
        self.object = self.get_object()
        self.object.is_delete = True  
        self.object.save()
        logout(request)

        context = {
            'success': True,
            'message': 'Your account has been marked as deleted.'
        }
        return JsonResponse(context)