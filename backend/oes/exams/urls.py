from django.urls import path
from . import views

urlpatterns = [
    path("", views.ExamListCreateAPIView.as_view()),
    path("<int:pk>/", views.ExamDetailAPIView.as_view()),
    path("<int:pk>/delete/", views.ExamDestroyAPIView.as_view()),
    path("<int:pk>/update/", views.ExamUpdateAPIView.as_view()),
]
