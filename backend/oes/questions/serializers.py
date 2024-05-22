from rest_framework import serializers
from .models import Question
from exams.serializers import ExamSerializer
from exams.models import Exam


class QuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Question
        fields = [
            "id",
            "exam",
            "question",
            "description",
            "choices",
            "answer",
            "point",
            "type",
            "created_at",
            "updated_at",
        ]


class QuestionUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Question
        fields = [
            "id",
            "question",
            "description",
            "choices",
            "answer",
            "point",
            "type",
            "created_at",
            "updated_at",
        ]
