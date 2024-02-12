from rest_framework import generics
from .models import User

from .serializers import UserSerializer

# Create your views here.


class UserListCreateAPIView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        password = serializer.validated_data.pop("password")

        user = serializer.save()
        user.set_password(password)
        user.save()


class UserDetailAPIView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDestroyAPIView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "pk"


class UserUpdateAPIView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup = "pk"
