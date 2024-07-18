from rest_framework import serializers
from .models import OTP, User, UserBusiness
from rest_framework_simplejwt.tokens import RefreshToken


class OTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTP
        fields = ['email']
        
class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    phone_number = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True)
    full_name = serializers.CharField(required=False)
    # profile_picture = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['full_name', 'email', 'phone_number', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            phone_number=validated_data['phone_number'],
            password=validated_data['password'],
            role='user'
        )
        return user
    
    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.full_name = validated_data.get('full_name', instance.full_name)
        
        # profile_picture = validated_data.get('profile_picture', None)
        # if profile_picture:
        #     instance.profile_picture = profile_picture

        instance.save()
        return instance
        
class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    token = serializers.CharField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')
        if password != confirm_password:
            raise serializers.ValidationError("Password and confirm password do not match")
        return attrs

class UserBusinessSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(required=True)

    class Meta:
        model = UserBusiness
        fields = ['business_name', 'user']
        extra_kwargs = {
            'user': {'read_only': True}
        }

    def create(self, validated_data):
        user = self.context['request'].user
        user_business = UserBusiness.objects.create(user=user, **validated_data)
        return user_business

    def update(self, instance, validated_data):
        instance.business_name = validated_data.get('business_name', instance.business_name)
        instance.save()
        return instance