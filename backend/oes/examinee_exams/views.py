from rest_framework import generics

from .models import ExamineeExam
from questions.models import Question
from .serializers import ExamineeExamSerializer

# Create your views here.


class ExamineeExamListCreateAPIView(generics.ListCreateAPIView):
    queryset = ExamineeExam.objects.all()
    serializer_class = ExamineeExamSerializer


class ExamineeExamDetailAPIView(generics.RetrieveAPIView):
    queryset = ExamineeExam.objects.all()
    serializer_class = ExamineeExamSerializer


class ExamineeExamUpdateAPIView(generics.UpdateAPIView):
    queryset = ExamineeExam.objects.all()
    serializer_class = ExamineeExamSerializer
    lookup = "pk"


class ExamineeExamDestroyAPIView(generics.DestroyAPIView):
    queryset = ExamineeExam.objects.all()
    serializer_class = ExamineeExamSerializer
    lookup = "pk"
