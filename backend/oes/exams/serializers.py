from rest_framework import serializers
from rest_framework.reverse import reverse
from django.utils import timezone
from users.models import User
from users.serializers import UserSerializer

from .models import Exam, Payment


class ExamSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name="exam-detail", lookup_field="pk", read_only=True
    )
    exam_code = serializers.CharField(read_only=True)
    created_by = serializers.PrimaryKeyRelatedField(read_only=True)
    status = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Exam
        fields = [
            "id",
            "url",
            "title",
            "description",
            "exam_code",
            "created_by",
            "remote",
            "public",
            "start_time",
            "end_time",
            "updated_at",
            "created_at",
            "duration",
            "status",
        ]

    def get_status(self, obj):
        if obj.end_time < timezone.localtime():
            return "Conducted"
        elif obj.start_time < timezone.localtime():
            return "Live"
        else:
            return "Scheduled"


class PaymentSerializer(serializers.ModelSerializer):
    examiner = UserSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = ["id", "payment_code", "exam", "examiner", "amount", "payment_method"]
