import random, string
from rest_framework import generics
from rest_framework.response import Response

from users.mixins import HavePermissionMixin
from .models import Exam
from .serializers import ExamSerializer


class ExamListCreateAPIView(HavePermissionMixin, generics.ListCreateAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user

        return qs.filter(created_by=user)

    def random_code(self):
        exam_code = "".join(random.choices(string.ascii_letters + string.digits, k=10))

        # check if the code is already in the database.
        if Exam.objects.filter(exam_code=exam_code).exists():
            return self.random_code()

        return exam_code

    def perform_create(self, serializer):
        exam_code = self.random_code()

        serializer.save(created_by=self.request.user, exam_code=exam_code)


class ExamDetailAPIView(HavePermissionMixin, generics.RetrieveAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer


class ExamUpdateAPIView(HavePermissionMixin, generics.UpdateAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    lookup = "pk"

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user

        return qs.filter(created_by=user)


class ExamDestroyAPIView(HavePermissionMixin, generics.DestroyAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    lookup_field = "pk"

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user

        return qs.filter(created_by=user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Exam deleted successfully"}, status=200)
