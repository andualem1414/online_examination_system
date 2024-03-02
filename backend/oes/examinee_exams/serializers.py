from rest_framework import serializers

from .models import ExamineeExam
from exams.serializers import ExamSerializer
from users.serializers import UserSerializer


class ExamineeExamSerializer(serializers.ModelSerializer):
    exam = ExamSerializer(read_only=True)
    examinee = UserSerializer(read_only=True)
    exam_code = serializers.CharField(write_only=True)

    class Meta:
        model = ExamineeExam
        fields = [
            "id",
            "exam",
            "examinee",
            "score",
            "exam_code",
            "total_time",
            "joined_date",
            "flags",
            "updated_at",
            "taken",
        ]


class ExamineeExamUpdateSerializer(serializers.ModelSerializer):
    total_time = serializers.TimeField(write_only=True)

    class Meta:
        model = ExamineeExam
        fields = ["id", "total_time"]
