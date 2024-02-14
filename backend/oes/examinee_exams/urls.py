from django.urls import path
from . import views


urlpatterns = [
    path("", views.ExamineeExamListCreateAPIView.as_view()),
    path("examinees/", views.ExamineeExamUsersListAPIView.as_view()),
    path("<int:pk>/", views.ExamineeExamDetailAPIView.as_view()),
    path("<int:pk>/update/", views.ExamineeExamUpdateAPIView.as_view()),
    path("<int:pk>/delete/", views.ExamineeExamDestroyAPIView.as_view()),
]
