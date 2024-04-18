from django.urls import path

from . import views

urlpatterns = [
    path("", views.QuestionListCreateAPIView.as_view()),
    path("<int:pk>/", views.QuestionDetailAPIView.as_view()),
    path("<int:pk>/update/", views.QuestionUpdateAPIView.as_view()),
    path("<int:pk>/delete/", views.QuestionDestroyAPIView.as_view()),
    path("question-pool/", views.QuestionPoolMixinView.as_view()),
]
