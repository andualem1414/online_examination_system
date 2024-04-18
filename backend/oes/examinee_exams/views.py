from rest_framework import generics, serializers, status
from rest_framework.response import Response
from datetime import datetime


from exams.models import Exam
from users.mixins import HavePermissionMixin
from examinee_answers.models import ExamineeAnswer, Flag

from .models import ExamineeExam
from .serializers import ExamineeExamSerializer, ExamineeExamUpdateSerializer
from .utils import calculate_score


# Create your views here.


class ExamineeExamListCreateAPIView(HavePermissionMixin, generics.ListCreateAPIView):
    queryset = ExamineeExam.objects.order_by("-joined_date").all()
    serializer_class = ExamineeExamSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        return qs.filter(examinee=user)

    def perform_create(self, serializer):
        exam_code = serializer.validated_data.pop("exam_code")

        if Exam.objects.filter(exam_code=exam_code).exists():
            exam = Exam.objects.get(exam_code=exam_code)
            number_of_examiees = ExamineeExam.objects.filter(exam=exam).count()
            print(number_of_examiees)
            already_joined = ExamineeExam.objects.filter(
                exam=exam, examinee=self.request.user
            )

            if exam.status != "Scheduled":
                raise serializers.ValidationError(
                    {"detail": "You can't Join after the Exam starts"}
                )

            if number_of_examiees >= exam.max_examinees:
                raise serializers.ValidationError({"detail": "Exam room is full"})

            if already_joined:
                raise serializers.ValidationError({"detail": "Already joined"})
        else:
            raise serializers.ValidationError({"message": "Exam not found"})

        serializer.save(examinee=self.request.user, exam=exam)


class ExamineeExamDetailAPIView(HavePermissionMixin, generics.RetrieveAPIView):
    queryset = ExamineeExam.objects.all()
    serializer_class = ExamineeExamSerializer
    lookup = "pk"

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.user_type == "EXAMINEE":

            return qs.filter(examinee=user)

        return qs


class ExamineeExamUpdateAPIView(HavePermissionMixin, generics.UpdateAPIView):
    queryset = ExamineeExam.objects.all()
    serializer_class = ExamineeExamUpdateSerializer
    lookup = "pk"

    def perform_update(self, serializer):
        instance = serializer.instance
        exam = instance.exam

        if instance.examinee != self.request.user:
            raise serializers.ValidationError(
                {"detail": "Not Authorized to perform this action"}
            )

        if instance.taken:
            raise serializers.ValidationError({"detail": "Already Submitted"})

        total_time = serializer.validated_data.pop("total_time")

        score, flags = calculate_score(self.request.user, exam)

        serializer.validated_data["score"] = score
        serializer.validated_data["total_time"] = total_time
        serializer.validated_data["flags"] = flags

        serializer.validated_data["taken"] = True

        return super().perform_update(serializer)


class ExamineeExamDestroyAPIView(HavePermissionMixin, generics.DestroyAPIView):
    queryset = ExamineeExam.objects.all()
    serializer_class = ExamineeExamSerializer
    lookup = "pk"

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        return qs.filter(examinee=user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "successfully left exam"}, status=200)


class ExamineeExamUsersListAPIView(HavePermissionMixin, generics.ListAPIView):
    queryset = ExamineeExam.objects.all()
    serializer_class = ExamineeExamSerializer

    def get_queryset(self):

        qs = super().get_queryset()
        try:
            exam = Exam.objects.get(
                created_by=self.request.user, pk=self.request.query_params["exam-id"]
            )
        except:
            raise serializers.ValidationError({"message": "Exam doesn't exist"})

        return qs.filter(exam=exam)
