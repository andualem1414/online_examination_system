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
