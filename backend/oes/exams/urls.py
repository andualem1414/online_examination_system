from django.urls import path
from . import views

urlpatterns = [
    path("", views.ExamListCreateAPIView.as_view()),
    path("public-exams/", views.PublicExamListAPIView.as_view()),
    path("<int:pk>/", views.ExamDetailAPIView.as_view(), name="exam-detail"),
    path("<int:pk>/delete/", views.ExamDestroyAPIView.as_view()),
    path("<int:pk>/update/", views.ExamUpdateAPIView.as_view()),
    # payment
    path("payments/code/", views.payment_code),
    path("payments/check/", views.payment_check),
    path("payments/", views.PaymentListCreateAPIView.as_view()),
    path("payments/all/", views.ListAllPaymentAPIView.as_view()),
    path("payments/<int:pk>/", views.PaymentDetailAPIView.as_view()),
    path("payments/<int:pk>/delete/", views.PaymentDestroyAPIView.as_view()),
    path("payments/<int:pk>/update/", views.PaymentUpdateAPIView.as_view()),
    # admin
    path("admin-exams/", views.AdminExamListAPIView.as_view()),
]
