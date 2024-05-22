from rest_framework import generics, serializers
from rest_framework.response import Response

from exams.models import Exam
from users.models import User
from users.mixins import HavePermissionMixin
from examinee_exams.models import ExamineeExam

from .results import calculate_result
from .models import ExamineeAnswer, Flag
from .serializers import (
    ExamineeAnswerSerializer,
    ExamineeAnswerDetailSerializer,
    FlagSerializer,
)
from rest_framework.parsers import MultiPartParser, FormParser
from examinee_exams.utils import calculate_score

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

        if not ExamineeExam.objects.filter(
            exam=exam, examinee=self.request.user
        ).exists():
            raise serializers.ValidationError(
                {"message": "You haven't Joined This Exam"}
            )

        # User ML algorithm here to calculate the result
        result = calculate_result(question, answer)
        already_answered = ExamineeAnswer.objects.filter(
            question=question, examinee=self.request.user
        )

        if already_answered.exists():
            raise serializers.ValidationError({"id": already_answered.first().id})

        serializer.save(examinee=self.request.user, exam=exam, result=result)

    def get_queryset(self):
        qs = super().get_queryset()

        if self.request.method == "GET":
            if "exam-id" in self.request.query_params:
                try:
                    exam = Exam.objects.get(pk=self.request.query_params["exam-id"])
                except:
                    raise serializers.ValidationError(
                        {"message": "Exam does not exist"}
                    )
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
        question = serializer.instance.question
        answer = serializer.validated_data["answer"]

        result = calculate_result(question, answer)
        print(result)
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


class ExamineeAnswerListAnswersCreateAPIView(HavePermissionMixin, generics.ListAPIView):
    queryset = ExamineeAnswer.objects.all()
    serializer_class = ExamineeAnswerDetailSerializer

    def get_queryset(self):
        qs = super().get_queryset()

        if (
            "exam-id" in self.request.query_params
            and "user-id" in self.request.query_params
        ):
            exam = Exam.objects.get(pk=self.request.query_params["exam-id"])
            user = User.objects.get(pk=self.request.query_params["user-id"])
        else:
            raise serializers.ValidationError(
                {"message": "Please provide exam ID and User ID."}
            )

        return qs.filter(examinee=user, exam=exam)


# Views for Flag
class FlagListCreateAPIView(HavePermissionMixin, generics.ListCreateAPIView):
    queryset = Flag.objects.all()
    serializer_class = FlagSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        qs = super().get_queryset()

        if self.request.method == "GET":
            if self.request.query_params["examinee-answer"]:
                examinee_answer = ExamineeAnswer.objects.get(
                    pk=self.request.query_params["examinee-answer"]
                )
            else:
                raise serializers.ValidationError(
                    {"message": "Please provide exam ID."}
                )

            return qs.filter(examinee_answer=examinee_answer)
        return qs

    def perform_create(self, serializer):

        if "examinee-answer" in self.request.query_params:
            examinee_answer = ExamineeAnswer.objects.get(
                pk=self.request.query_params["examinee-answer"]
            )
            if Flag.objects.filter(examinee_answer=examinee_answer).exists():
                raise serializers.ValidationError({"message": "Flag already exist"})
        else:
            raise serializers.ValidationError(
                {"message": "Please provide examiee answer."}
            )

        serializer.save(examinee_answer=examinee_answer)


class FlagDetailAPIView(HavePermissionMixin, generics.RetrieveAPIView):
    queryset = Flag.objects.all()
    serializer_class = FlagSerializer


class FlagUpdateAPIView(HavePermissionMixin, generics.UpdateAPIView):
    queryset = Flag.objects.all()
    serializer_class = FlagSerializer
    lookup = "pk"


class FlagDestroyAPIView(HavePermissionMixin, generics.DestroyAPIView):
    queryset = Flag.objects.all()
    serializer_class = FlagSerializer
    lookup = "pk"

    def perform_destroy(self, instance):
        examinee_answer = instance.examinee_answer
        exam = examinee_answer.exam
        instance.delete()

        examinee_exam_id = self.request.GET.get("examinee-exam", "")

        examinee_exam = ExamineeExam.objects.get(pk=examinee_exam_id)

        score, flags = calculate_score(examinee_exam.examinee, exam)

        print(examinee_exam)
        if examinee_exam:
            examinee_exam.score = score
            examinee_exam.flags = flags
            examinee_exam.save()
        print(score, flags)
