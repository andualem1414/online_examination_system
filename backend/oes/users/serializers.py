from rest_framework import serializers
from .models import User, Rule
from auditlog.models import LogEntry


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


class RecentActionSerializer(serializers.ModelSerializer):
    action_display = serializers.SerializerMethodField()

    class Meta:
        model = LogEntry
        fields = [
            "id",
            "object_repr",
            "action",
            "changes",
            "timestamp",
            "action_display",
        ]

    def get_action_display(self, obj):
        action_value = obj.action
        actions_map = {
            0: "create",
            1: "update",
            2: "delete",
            # Add additional mappings for other action values if needed
        }
        return actions_map.get(action_value, "unknown")


class RuleSerializer(serializers.ModelSerializer):
    examiner = UserSerializer(read_only=True)

    class Meta:
        model = Rule
        fields = ["id", "examiner", "rule"]
