from rest_framework import generics, serializers

from .models import Question
from .serializers import QuestionSerializer, QuestionDetailSerializer
from exams.models import Exam
from rest_framework.response import Response


# Create your views here.


class QuestionListCreateAPIView(generics.ListCreateAPIView):
    queryset = Question.objects.all()

    def get_serializer_class(self):
        if self.request.method == "POST":
            return QuestionSerializer
        return QuestionDetailSerializer

    def perform_create(self, serializer):
        print(serializer.validated_data)

        return super().perform_create(serializer)

    def get_queryset(self):
        qs = super().get_queryset()

        if "exam-id" in self.request.query_params:
            exam = Exam.objects.get(pk=self.request.query_params["exam-id"])
        else:
            raise serializers.ValidationError({"message": "Please provide exam ID."})

        return qs.filter(exam=exam)


class QuestionDetailAPIView(generics.RetrieveAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionDetailSerializer


class QuestionUpdateAPIView(generics.UpdateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    lookup = "pk"


class QuestionDestroyAPIView(generics.DestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    lookup_field = "pk"

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Question deleted successfully"}, status=200)
