import uuid
import os
from pathlib import Path
from django.conf import settings

from .models import User, Rule
from django.contrib.auth.models import Group
from .serializers import UserSerializer, RecentActionSerializer, RuleSerializer

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated

from auditlog.models import LogEntry
from rest_framework import status

from .compare_face import compare_face


# Create your views here.


class UserListAPIView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class RecentActionsListAPIView(generics.ListAPIView):
    queryset = LogEntry.objects.all()
    serializer_class = RecentActionSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user

        return qs.filter(actor_id=user.id).order_by("-timestamp")


class ChangePasswordView(APIView):

    def post(self, request):
        user = request.user
        data = request.data

        # Check if the old password matches
        if not user.check_password(data.get("old_password")):
            return Response(
                {"error": "Old password is incorrect"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if the new passwords match
        if data.get("new_password") != data.get("confirm_new_password"):
            return Response(
                {"error": "New passwords do not match"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Set the new password and save the user
        user.set_password(data.get("new_password"))
        user.save()

        return Response(
            {"message": "Password changed successfully"}, status=status.HTTP_200_OK
        )


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


# class UserDetailAPIView(generics.GenericAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         # Get the authenticated user


#         user = User.objects.get(pk=request.user.id)
#         serializer = UserSerializer(user)
#         return Response(serializer.data)
class UserDetailAPIView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def retrieve(self, request, *args, **kwargs):
        # Retrieve the current authenticated user
        user = request.user

        # Serialize user data
        serializer = self.get_serializer(user)

        return Response(serializer.data)


class UserDestroyAPIView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "pk"

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "user deleted successfully"}, status=200)


class UserUpdateAPIView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup = "pk"

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user

        return qs.filter(pk=user.id)


class RuleCreateAPIView(generics.CreateAPIView):
    queryset = Rule.objects.all()
    serializer_class = RuleSerializer

    def perform_create(self, serializer):

        return serializer.save(examiner=self.request.user)


class RuleListAPIView(generics.ListAPIView):
    queryset = Rule.objects.all()
    serializer_class = RuleSerializer

    def get_queryset(self):
        my_pk = self.request.parser_context["kwargs"]["pk"]

        return super().get_queryset().filter(examiner=my_pk)


class RuleDestroyAPIView(generics.DestroyAPIView):
    queryset = Rule.objects.all()
    serializer_class = RuleSerializer
    lookup_field = "pk"

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        id = instance.id
        self.perform_destroy(instance)
        return Response({"message": "Rule deleted successfully", "id": id}, status=200)


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
        verified = False
        print(result)

        # if result and result["distance"] < 0.35:
        #     verified = True
        if result:
            verified = result["verified"]

        # Return a success response (optional data about the uploaded image)
        os.remove(current_image)
        return Response({"verified": verified})
