from rest_framework import generics, serializers
from django.utils import timezone
from .models import Question
from .serializers import QuestionSerializer
from exams.models import Exam
from rest_framework.response import Response

from users.mixins import HavePermissionMixin


# Create your views here.


class QuestionListCreateAPIView(HavePermissionMixin, generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    def perform_create(self, serializer):
        print(serializer.validated_data)

        return super().perform_create(serializer)

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.method == "GET":
            if "exam-id" in self.request.query_params:
                exam = Exam.objects.get(pk=self.request.query_params["exam-id"])
            else:
                raise serializers.ValidationError(
                    {"message": "Please provide exam ID."}
                )

            # if (
            #     self.request.user.user_type == "EXAMINEE"
            #     and timezone.now() < exam.start_time
            # ):
            #     raise serializers.ValidationError({"message": "Exam Haven't Started"})

            return qs.filter(exam=exam)
        return qs


class QuestionDetailAPIView(HavePermissionMixin, generics.RetrieveAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


class QuestionUpdateAPIView(HavePermissionMixin, generics.UpdateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    lookup = "pk"


class QuestionDestroyAPIView(HavePermissionMixin, generics.DestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    lookup_field = "pk"

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Question deleted successfully"}, status=200)
