from django.contrib import admin
from .models import User, OTP, UserBusiness

# Register your models here.
admin.site.register(User)
admin.site.register(OTP)
admin.site.register(UserBusiness)