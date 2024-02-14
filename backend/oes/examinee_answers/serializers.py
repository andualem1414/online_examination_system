from rest_framework import serializers
from .models import ExamineeAnswer, Flag
from questions.serializers import QuestionSerializer


class ExamineeAnswerDetailSerializer(serializers.ModelSerializer):
    question = QuestionSerializer()

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


class ExamineeAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamineeAnswer
        fields = [
            "id",
            "question",
            "answer",
        ]


class FlagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flag
        fields = ["id", "question", "type"]
