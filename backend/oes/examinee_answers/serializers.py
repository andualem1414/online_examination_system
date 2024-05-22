from rest_framework import serializers
from .models import ExamineeAnswer, Flag
from questions.serializers import QuestionSerializer


class ExamineeAnswerDetailSerializer(serializers.ModelSerializer):
    question = QuestionSerializer(read_only=True)
    examinee = serializers.PrimaryKeyRelatedField(read_only=True)
    result = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

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
    examinee_answer = ExamineeAnswerSerializer(read_only=True)

    class Meta:
        model = Flag
        fields = ["id", "examinee_answer", "type", "image"]
