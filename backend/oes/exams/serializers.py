from rest_framework import serializers
from rest_framework.reverse import reverse
from .models import Exam


class ExamSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name="exam-detail", lookup_field="pk"
    )

    class Meta:
        model = Exam
        fields = [
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
