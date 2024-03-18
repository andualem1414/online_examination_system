from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=128, write_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "user_type",
            "password",
            "full_name",
            "profile_picture",
            "description",
            "created_at",
        ]

    def get_full_name(self, obj):
        # Call the get_full_name() method on the user instance
        return obj.get_full_name()
