from rest_framework import generics, serializers, status
from rest_framework.response import Response

from exams.models import Exam
from .models import ExamineeExam
from questions.models import Question
from .serializers import ExamineeExamSerializer, ExamineeExamUpdateSerializer
from users.mixins import HavePermissionMixin
from examinee_answers.models import ExamineeAnswer

# Create your views here.


class ExamineeExamListCreateAPIView(HavePermissionMixin, generics.ListCreateAPIView):
    queryset = ExamineeExam.objects.all()
    serializer_class = ExamineeExamSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        return qs.filter(examinee=user)

    def perform_create(self, serializer):

        exam_code = serializer.validated_data.pop("exam_code")

        if Exam.objects.filter(exam_code=exam_code).exists():
            exam = Exam.objects.get(exam_code=exam_code)
            already_joined = ExamineeExam.objects.filter(
                exam=exam, examinee=self.request.user
            )

            if already_joined:
                raise serializers.ValidationError({"detail": "Already joined"})
        else:
            raise serializers.ValidationError({"message": "Exam not found"})

        serializer.save(examinee=self.request.user, exam=exam)


class ExamineeExamDetailAPIView(HavePermissionMixin, generics.RetrieveAPIView):
    queryset = ExamineeExam.objects.all()
    serializer_class = ExamineeExamSerializer


class ExamineeExamUpdateAPIView(HavePermissionMixin, generics.UpdateAPIView):
    queryset = ExamineeExam.objects.all()
    serializer_class = ExamineeExamSerializer
    lookup = "pk"

    def calculate_score(self, exam):
        score = 0
        answers = ExamineeAnswer.objects.filter(exam=exam)
        for answer in answers:
            score += answer.result
        return score

    def perform_update(self, serializer):
        exam = serializer.instance.exam

        total_time = serializer.validated_data.pop("total_time")
        score = self.calculate_score(exam)
        serializer.validated_data["score"] = score
        serializer.validated_data["total_time"] = total_time

        return super().perform_update(serializer)


class ExamineeExamDestroyAPIView(HavePermissionMixin, generics.DestroyAPIView):
    queryset = ExamineeExam.objects.all()
    serializer_class = ExamineeExamSerializer
    lookup = "pk"

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "successfully left exam"}, status=200)


class ExamineeExamUsersListAPIView(HavePermissionMixin, generics.ListAPIView):
    queryset = ExamineeExam.objects.all()
    serializer_class = ExamineeExamSerializer

    def get_queryset(self):

        qs = super().get_queryset()

        exam = Exam.objects.get(pk=self.request.query_params["exam-id"])
        return qs.filter(exam=exam)
