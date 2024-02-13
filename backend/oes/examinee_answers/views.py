from rest_framework import generics

from .models import ExamineeAnswer
from questions.models import Question
from .serializers import ExamineeAnswerSerializer

# Create your views here.


class ExamineeAnswerListCreateAPIView(generics.ListCreateAPIView):
    queryset = ExamineeAnswer.objects.all()
    serializer_class = ExamineeAnswerSerializer

    def perform_create(self, serializer):

        question = Question.objects.first()
        serializer.save(question=question)

    def get_queryset(self):
        qs = super().get_queryset()
        question = Question.objects.first()
        return qs.filter(question=question)


class ExamineeAnswerDetailAPIView(generics.RetrieveAPIView):
    queryset = ExamineeAnswer.objects.all()
    serializer_class = ExamineeAnswerSerializer


class ExamineeAnswerUpdateAPIView(generics.UpdateAPIView):
    queryset = ExamineeAnswer.objects.all()
    serializer_class = ExamineeAnswerSerializer
    lookup = "pk"


class ExamineeAnswerDestroyAPIView(generics.DestroyAPIView):
    queryset = ExamineeAnswer.objects.all()
    serializer_class = ExamineeAnswerSerializer
    lookup = "pk"
