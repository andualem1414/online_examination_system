from rest_framework import generics

from .models import Question
from .serializers import QuestionSerializer
from exams.models import Exam


# Create your views here.


class QuestionListCreateAPIView(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    def perform_create(self, serializer):
        exam = Exam.objects.first()
        serializer.save(exam=exam)

    def get_queryset(self):
        qs = super().get_queryset()
        exam = Exam.objects.first()
        return qs.filter(exam=exam)
