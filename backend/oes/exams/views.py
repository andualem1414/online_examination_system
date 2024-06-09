import random, string
from rest_framework import generics, serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.utils import timezone
import requests
import json
from rest_framework import status

from users.mixins import HavePermissionMixin
from .models import Exam, Payment
from .serializers import ExamSerializer, PaymentSerializer


class AdminExamListAPIView(HavePermissionMixin, generics.ListAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.user_type != "ADMIN":
            raise serializers.ValidationError({"details": "Not Authorized"})

        return qs.order_by("-created_at")


class ExamListCreateAPIView(HavePermissionMixin, generics.ListCreateAPIView):
    queryset = Exam.objects.order_by("-created_at").all()
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


class PublicExamListAPIView(HavePermissionMixin, generics.ListAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

    def get_queryset(self):
        qs = super().get_queryset()

        return qs.filter(public=True).order_by("-created_at")


class ExamDetailAPIView(HavePermissionMixin, generics.RetrieveAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    lookup = "pk"


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
        qs = super().get_queryset()
        user = self.request.user

        return qs.filter(examiner=user).order_by("-created_at")

    def perform_create(self, serializer):

        exam = Exam.objects.get(pk=serializer.validated_data["exam_id"])
        amount = exam.max_examinees * 0.5

        serializer.save(
            examiner=self.request.user,
            exam=exam,
            amount=amount,
        )


class ListAllPaymentAPIView(HavePermissionMixin, generics.ListAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def get_queryset(self):
        qs = super().get_queryset()

        return qs.order_by("-created_at")


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
    payment_code = "chewatatest-" + "".join(
        random.choices(string.ascii_letters + string.digits, k=10)
    )

    amount = request.GET.get("amount")
    title = request.GET.get("title")
    user = request.user

    url = "https://api.chapa.co/v1/transaction/initialize"
    payload = {
        "amount": amount,
        "currency": "ETB",
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "tx_ref": payment_code,
        "callback_url": "https://webhook.site/077164d6-29cb-40df-ba29-8a00e59a7e60",
        "customization": {
            "title": f"{amount} Birr",
            "description": f"Payment for online examination",
        },
    }
    headers = {
        "Authorization": "Bearer CHASECK_TEST-BCcWyNcXHudjE2G08204AWYlZk0xZM9l",
        "Content-Type": "application/json",
    }
    try: 
        response = requests.post(url, json=payload, headers=headers)
        response_data = response.text
        print(response_data)

        data = {"code": payment_code, "data": response_data}
    except:
        return Response(
            {"error": "No internet connection"}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    return Response(data)
 

@api_view(["GET"])
def payment_check(request, pk=None, *args, **kwargs):
    payment_code = request.GET.get("payment_code")

    url = f"https://api.chapa.co/v1/transaction/verify/{payment_code}"

    headers = {
        "Authorization": "Bearer CHASECK_TEST-BCcWyNcXHudjE2G08204AWYlZk0xZM9l",
    }

    status = False
    reference = ""
    try:
        response = requests.get(url, headers=headers)
        response_data = json.loads(response.text)
        if response_data["data"]["status"] == "success":
            status = True
            reference = response_data["data"]["reference"]
        print(response_data)
    except:
        print("error")

    data = {"paid": status, "reference": reference}

    return Response(data)
