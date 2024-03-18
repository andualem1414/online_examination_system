import uuid
import os
from pathlib import Path
from django.conf import settings

from .models import User
from django.contrib.auth.models import Group
from .serializers import UserSerializer

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated

from .compare_face import compare_face


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
        type = serializer.validated_data["user_type"]

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

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user

        return qs.filter(pk=user.id)


class VerifyUserView(APIView):
    parser_classes = [MultiPartParser, FormParser]  # Allow multipart form data

    def store_image(self, image_file):
        if image_file is None:
            return Response({"error": "No image file uploaded"}, status=400)

        # Handle image processing and storage logic here
        filename = f"temp/{uuid.uuid4()}.{image_file.name}"
        filepath = os.path.join(settings.MEDIA_ROOT, filename)

        with open(filepath, "wb+") as destination:
            for chunk in image_file.chunks():
                destination.write(chunk)

        return filepath

    def post(self, request):
        image_file = request.FILES.get("image")
        if image_file:
            current_image = self.store_image(image_file)
        else:
            return Response({"verified": False})

        profile_image = self.request.user.profile_picture.path

        result = compare_face(current_image, profile_image)
        print(result)
        verified = result["verified"] if result else False
        # Return a success response (optional data about the uploaded image)
        os.remove(current_image)
        return Response({"verified": verified})
