import random, string
from rest_framework import generics, serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.utils import timezone


from users.mixins import HavePermissionMixin
from .models import Exam, Payment
from .serializers import ExamSerializer, PaymentSerializer


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

    def get_queryset(self):
        qs = super().get_queryset()

        if self.request.user.user_type == "EXAMINER":
            return qs.filter(created_by=self.request.user)

        return qs


class ExamUpdateAPIView(HavePermissionMixin, generics.UpdateAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    lookup = "pk"

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user

        return qs.filter(created_by=user)

    def perform_update(self, serializer):
        instance = serializer.instance

        if (
            instance.start_time < timezone.localtime()
            and instance.end_time > timezone.localtime()
        ):
            raise serializers.ValidationError(
                {"details": "You can't edit while the exam is live"}
            )

        return super().perform_update(serializer)


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


class PaymentListCreateAPIView(HavePermissionMixin, generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def get_queryset(self):
        return super().get_queryset()

    def perform_create(self, serializer):
        exam = serializer.validated_data["exam"]

        serializer.save(
            examiner=self.request.user,
            exam=exam,
        )


class PaymentDetailAPIView(HavePermissionMixin, generics.RetrieveAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    lookup = "pk"


class PaymentDestroyAPIView(HavePermissionMixin, generics.DestroyAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    lookup = "pk"


class PaymentUpdateAPIView(HavePermissionMixin, generics.ListAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer


@api_view(["GET"])
def payment_code(request, pk=None, *args, **kwargs):
    payment_code = "".join(random.choices(string.ascii_letters + string.digits, k=10))
    data = {
        "code": payment_code,
    }

    return Response(data)


@api_view(["GET"])
def payment_check(request, pk=None, *args, **kwargs):
    payment_code = "".join(random.choices(string.ascii_letters + string.digits, k=10))
    data = {
        "message": "paid",
    }

    return Response(data)
