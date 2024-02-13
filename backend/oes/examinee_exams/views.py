from rest_framework import generics, serializers, status
from rest_framework.response import Response

from exams.models import Exam
from .models import ExamineeExam
from questions.models import Question
from .serializers import ExamineeExamSerializer
from users.mixins import HavePermissionMixin

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

        exam = Exam.objects.get(exam_code=exam_code)
        already_joined = ExamineeExam.objects.filter(
            exam=exam, examinee=self.request.user
        )

        if already_joined:
            raise serializers.ValidationError({"detail": "Already joined"})

        serializer.save(examinee=self.request.user, exam=exam)


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

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "successfully left exam"}, status=200)
