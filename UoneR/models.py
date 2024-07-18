from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.conf import settings



class CustomUserManager(BaseUserManager):

    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', User.Roles.ADMIN)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)
    

class User(AbstractUser):

    class Roles(models.TextChoices):
        USER = 'user', ('User')
        ADMIN = 'admin', ('Admin')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name']
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, default="000 000 000 000")
    role = models.CharField(max_length=20, default=Roles.USER.value, choices=Roles.choices)
    profile_picture = models.ImageField(upload_to='profiles/', default=settings.DEFAULT_PROFILE_IMAGE, null=True, blank=True) 
    is_delete = models.BooleanField(default=False)
    username = None
    objects = CustomUserManager()
    
    def __str__(self):
        return self.email
    
class OTP(models.Model):
    class Otp_types(models.TextChoices):
        create = 'create', 'create'
        forgot = 'forgot', 'forgot'

    email  = models.EmailField(max_length=100)
    code = models.IntegerField(null=True)
    type = models.CharField(max_length=100,null=True, choices=Otp_types.choices, blank=True)
    verification_token = models.CharField(max_length=200 , null=True)
    used = models.BooleanField(default=False, null=True)
    timeout = models.DateTimeField(null=True)
    created_at = models.DateTimeField(null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email    

class UserBusiness(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='business')
    business_name = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.business_name