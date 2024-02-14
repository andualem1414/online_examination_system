from rest_framework import generics, serializers
from rest_framework.response import Response
from .models import ExamineeAnswer
from exams.models import Exam
from questions.models import Question
from .serializers import ExamineeAnswerSerializer, ExamineeAnswerDetailSerializer

from users.mixins import HavePermissionMixin

# Create your views here.


class ExamineeAnswerListCreateAPIView(HavePermissionMixin, generics.ListCreateAPIView):
    queryset = ExamineeAnswer.objects.all()

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ExamineeAnswerSerializer
        return ExamineeAnswerDetailSerializer

    def perform_create(self, serializer):
        question = serializer.validated_data["question"]
        answer = serializer.validated_data["answer"]
        exam = Exam.objects.get(pk=question.exam.id)
        # User ML algorithm here to calculate the result
        if question.answer == answer:
            result = question.point
        else:
            result = 0
        if ExamineeAnswer.objects.filter(question=question):
            raise serializers.ValidationError({"message": "Answer already exists"})
        serializer.save(examinee=self.request.user, exam=exam, result=result)

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.method == "GET":
            if "exam-id" in self.request.query_params:
                exam = Exam.objects.get(pk=self.request.query_params["exam-id"])
            else:
                raise serializers.ValidationError(
                    {"message": "Please provide exam ID."}
                )

            return qs.filter(examinee=self.request.user, exam=exam)
        return qs


class ExamineeAnswerDetailAPIView(HavePermissionMixin, generics.RetrieveAPIView):
    queryset = ExamineeAnswer.objects.all()
    serializer_class = ExamineeAnswerDetailSerializer


class ExamineeAnswerUpdateAPIView(HavePermissionMixin, generics.UpdateAPIView):
    queryset = ExamineeAnswer.objects.all()
    serializer_class = ExamineeAnswerSerializer
    lookup = "pk"

    def perform_update(self, serializer):
        question = serializer.validated_data["question"]
        answer = serializer.validated_data["answer"]

        if question.answer == answer:
            result = question.point
            serializer.validated_data["result"] = result

        return super().perform_update(serializer)


class ExamineeAnswerDestroyAPIView(HavePermissionMixin, generics.DestroyAPIView):
    queryset = ExamineeAnswer.objects.all()
    serializer_class = ExamineeAnswerSerializer
    lookup = "pk"

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Examinee Answer deleted successfully"}, status=200)
