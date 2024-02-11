from .permissions import HavePermission
from rest_framework import permissions


class HavePermissionMixin:
    permission_classes = [HavePermission]
