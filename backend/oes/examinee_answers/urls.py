from django.urls import path
from . import views


urlpatterns = [
    path("", views.ExamineeAnswerListCreateAPIView.as_view()),
    path("<int:pk>/", views.ExamineeAnswerDetailAPIView.as_view()),
    path("<int:pk>/update/", views.ExamineeAnswerUpdateAPIView.as_view()),
    path("<int:pk>/delete/", views.ExamineeAnswerDestroyAPIView.as_view()),
    # For listing answers for a specific user and exam.
    path("answers/", views.ExamineeAnswerListAnswersCreateAPIView.as_view()),
    # APIs for Flags
    path("flags/", views.FlagListCreateAPIView.as_view()),
    path("flags/<int:pk>/", views.FlagDetailAPIView.as_view()),
    path("flags/<int:pk>/update/", views.FlagUpdateAPIView.as_view()),
    path("flags/<int:pk>/delete/", views.FlagDestroyAPIView.as_view()),
]
