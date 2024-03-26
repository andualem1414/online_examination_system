from rest_framework import serializers
from rest_framework.reverse import reverse
from users.models import User
from users.serializers import UserSerializer

from .models import Exam, Payment


class ExamSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name="exam-detail", lookup_field="pk", read_only=True
    )
    exam_code = serializers.CharField(read_only=True)
    created_by = serializers.PrimaryKeyRelatedField(read_only=True)
    total_mark = serializers.IntegerField(read_only=True)
    questions_count = serializers.IntegerField(read_only=True)

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
            "max_examinees",
            "end_time",
            "updated_at",
            "created_at",
            "duration",
            "status",
            "total_mark",
            "questions_count",
        ]


class PaymentSerializer(serializers.ModelSerializer):
    examiner = UserSerializer(read_only=True)
    exam = ExamSerializer(read_only=True)
    amount = serializers.IntegerField(read_only=True)
    exam_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Payment
        fields = [
            "id",
            "payment_code",
            "exam",
            "exam_id",
            "examiner",
            "amount",
            "payment_method",
            "created_at",
        ]
