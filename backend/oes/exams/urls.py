from django.urls import path
from . import views

urlpatterns = [
    path("", views.ExamListCreateAPIView.as_view()),
    path("<int:pk>/", views.ExamDetailAPIView.as_view(), name="exam-detail"),
    path("<int:pk>/delete/", views.ExamDestroyAPIView.as_view()),
    path("<int:pk>/update/", views.ExamUpdateAPIView.as_view()),
    path("payments/code", views.payment_code),
    path("payments/check", views.payment_check),
    path("payments/", views.PaymentListCreateAPIView.as_view()),
    path("payments/<int:pk>/", views.PaymentDetailAPIView.as_view()),
    path("payments/<int:pk>/delete/", views.PaymentDestroyAPIView.as_view()),
    path("payments/<int:pk>/update/", views.PaymentUpdateAPIView.as_view()),
]
