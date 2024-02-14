from django.urls import path
from . import views


urlpatterns = [
    path("", views.ExamineeAnswerListCreateAPIView.as_view()),
    path("answers/", views.ExamineeAnswerListAnswersCreateAPIView.as_view()),
    path("<int:pk>/", views.ExamineeAnswerDetailAPIView.as_view()),
    path("<int:pk>/update/", views.ExamineeAnswerUpdateAPIView.as_view()),
    path("<int:pk>/delete/", views.ExamineeAnswerDestroyAPIView.as_view()),
]
