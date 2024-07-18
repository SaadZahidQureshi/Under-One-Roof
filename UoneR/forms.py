from django import forms
from .models import User, UserBusiness

class UserChangeForm(forms.ModelForm):
    
    class Meta:
        model = User
        fields = ['full_name', 'email', 'profile_picture']

class UserBusinessForm(forms.ModelForm):
    
    class Meta:
        model = UserBusiness
        fields = ['business_name']