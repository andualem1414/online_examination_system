from rest_framework import serializers

from .models import ExamineeExam


class ExamineeExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamineeExam
        fields = [
            "id",
            "exam",
            "examinee",
            "score",
            "total_time",
            "joined_date",
            "flags",
            "created_at",
            "updated_at",
        ]
