from rest_framework import generics
from .models import User
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import Group


# Create your views here.


class UserListAPIView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserCreateAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = []
    authentication_classes = []

    def perform_create(self, serializer):
        password = serializer.validated_data.pop("password")
        type = serializer.validated_data.pop("user_type")

        user = serializer.save()
        user.set_password(password)
        dev_groups = Group.objects.get(name=type)
        user.groups.add(dev_groups)
        user.save()


class UserDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get the authenticated user
        user = request.user

        serializer = UserSerializer(user)
        return Response(serializer.data)


class UserDestroyAPIView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "pk"


class UserUpdateAPIView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup = "pk"
