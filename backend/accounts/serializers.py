from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "full_name", "role")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("email", "full_name", "password")

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data["email"],
            full_name=validated_data["full_name"],
            password=validated_data["password"],
            role=User.Roles.STUDENT,
        )


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")
        if not email:
            raise serializers.ValidationError({"email": "Enter your email address."})

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {"email": "No account found with this email. Please register first."}
            )

        if not user.check_password(password):
            raise serializers.ValidationError({"password": "Incorrect password. Try again."})

        if not user.is_active:
            raise serializers.ValidationError({"email": "This account is disabled."})

        authenticate(request=self.context.get("request"), email=user.email, password=password)
        data = super().validate({"email": user.email, "password": password})
        data["user"] = UserSerializer(user).data
        return data


class AdminUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, min_length=8)

    class Meta:
        model = User
        fields = ("id", "email", "full_name", "role", "is_active", "password")

    def create(self, validated_data):
        password = validated_data.pop("password", None) or "Heirloom@123"
        role = validated_data.pop("role", User.Roles.STUDENT)
        return User.objects.create_user(password=password, **validated_data, role=role)

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for key, value in validated_data.items():
            setattr(instance, key, value)
        if password:
            instance.set_password(password)
        if instance.role == User.Roles.ADMIN:
            instance.is_staff = True
        instance.save()
        return instance
