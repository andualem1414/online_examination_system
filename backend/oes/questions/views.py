from rest_framework import generics, serializers, mixins
from rest_framework.response import Response
from django.utils import timezone

from exams.models import Exam
from users.mixins import HavePermissionMixin

from .models import Question
from .serializers import QuestionSerializer, QuestionUpdateSerializer
import json


# Create your views here.


class QuestionListCreateAPIView(HavePermissionMixin, generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    def perform_create(self, serializer):
        exam = serializer.validated_data["exam"]

        if exam:
            if exam.created_by != self.request.user:
                raise serializers.ValidationError(
                    {"message": "You don't have access to this exam"}
                )
        else:
            exam = None

        serializer.save(created_by=self.request.user, exam=exam)

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.method == "GET":

            # Check if the exam exists
            if (
                "exam-id" in self.request.query_params
                and Exam.objects.filter(
                    pk=self.request.query_params["exam-id"]
                ).exists()
            ):
                exam = Exam.objects.get(pk=self.request.query_params["exam-id"])

            else:
                raise serializers.ValidationError(
                    {"message": "Please provide Valid exam ID."}
                )

            # Check If the Examiner is the creator of the exam
            if not exam.public:
                if (
                    self.request.user.user_type == "EXAMINER"
                    and exam.created_by != self.request.user
                ):
                    raise serializers.ValidationError(
                        {"message": "You don't have access to this exam"}
                    )

                if (
                    self.request.user.user_type == "EXAMINEE"
                    and timezone.localtime() < exam.start_time
                ):
                    raise serializers.ValidationError(
                        {"message": "Exam Haven't Started"}
                    )

            return qs.filter(exam=exam)
        return qs


class QuestionDetailAPIView(HavePermissionMixin, generics.RetrieveAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


class QuestionUpdateAPIView(HavePermissionMixin, generics.UpdateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionUpdateSerializer
    lookup = "pk"

    # check if you have created the question
    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user

        return qs.filter(created_by=user)


class QuestionDestroyAPIView(HavePermissionMixin, generics.DestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    lookup_field = "pk"

    # check if you have created the question
    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user

        return qs.filter(created_by=user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Question deleted successfully"}, status=200)


class QuestionPoolMixinView(
    mixins.ListModelMixin,
    generics.GenericAPIView,
):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user

        return qs.filter(created_by=user, exam=None).order_by("-created_at")

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        ids = json.loads(request.data["ids"])
        examId = request.data["exam"]
        exam = Exam.objects.get(pk=examId)

        for id in ids:
            question = Question.objects.get(pk=id)

            Question.objects.create(
                exam=exam,
                type=question.type,
                description=question.description,
                question=question.question,
                choices=question.choices,
                answer=question.answer,
                point=question.point,
                created_by=self.request.user,
            )

        return Response({"message": "Questions Added successfully"}, status=200)
