from django.db import models

# Create your models here.

from django.contrib.auth.models import AbstractUser

from exams.models import Exam


class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ("EXAMINER", "Examiner"),
        ("EXAMINEE", "Examinee"),
        ("ADMIN", "Admin"),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    image = models.ImageField()


class Payment(models.Model):
    payment_code = models.CharField(max_length=40)
    examiner = models.ForeignKey(User, on_delete=models.SET_NULL)
    exam = models.ForeignKey(Exam, on_delete=models.SET_NULL)

    amount = models.IntegerField()
    payment_method = models.CharField(max_length=50)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
