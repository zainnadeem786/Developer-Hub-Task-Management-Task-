from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Task

# Serializer for Task model
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

# Serializer for user registration
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

# Serializer for user login
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
