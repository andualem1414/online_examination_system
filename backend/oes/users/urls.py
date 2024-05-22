from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from . import views

urlpatterns = [
    path("list/", views.UserListAPIView.as_view()),
    path("create/", views.UserCreateAPIView.as_view()),
    path("<int:pk>/update/", views.UserUpdateAPIView.as_view()),
    path("<int:pk>/delete/", views.UserDestroyAPIView.as_view()),
    path("details/", views.UserDetailAPIView.as_view(), name="user_detail"),
    path("change-password/", views.ChangePasswordView.as_view()),
    # user verify
    path("verify-user/", views.VerifyUserView.as_view()),
    # Token
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    # recent Action
    path("recent-actions/", views.RecentActionsListAPIView.as_view()),
    # add and remove rules
    path("rules/<int:pk>/list/", views.RuleListAPIView.as_view()),
    path("rules/", views.RuleCreateAPIView.as_view()),
    path("rules/<int:pk>/delete/", views.RuleDestroyAPIView.as_view()),
]
