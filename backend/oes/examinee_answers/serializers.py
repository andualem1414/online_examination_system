from rest_framework import serializers
from .models import ExamineeAnswer, Flag


class ExamineeAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamineeAnswer
        fields = [
            "id",
            "question",
            "examinee",
            "answer",
            "result",
            "created_at",
            "updated_at",
        ]


class FlagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flag
        fields = ["id", "question", "type"]
