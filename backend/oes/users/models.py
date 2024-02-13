from django.db import models

# Create your models here.

from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ("EXAMINER", "Examiner"),
        ("EXAMINEE", "Examinee"),
        ("ADMIN", "Admin"),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    # image = models.ImageField()
