from rest_framework import serializers
from .models import ExamineeAnswer


class ExamineeAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamineeAnswer
        fields = ["id", "answer", "result"]
