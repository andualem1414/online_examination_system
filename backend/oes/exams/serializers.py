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
        ]
