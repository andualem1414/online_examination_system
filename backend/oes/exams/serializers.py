from rest_framework import serializers
from rest_framework.reverse import reverse
from .models import Exam

from users.serializers import UserSerializer


class ExamSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name="exam-detail", lookup_field="pk", read_only=True
    )
    exam_code = serializers.CharField(read_only=True)
    created_by = UserSerializer(read_only=True)

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
        ]
