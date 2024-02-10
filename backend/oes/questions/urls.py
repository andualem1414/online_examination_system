from django.urls import path

from . import views

urlpatterns = [
    path("", views.QuestionListCreateAPIView.as_view()),
]
