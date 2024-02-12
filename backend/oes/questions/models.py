from django.db import models
from exams.models import Exam

# Create your models here.


class Question(models.Model):
    QUESTION_TYPE_CHOICES = (
        ("CHOICE", "Choice"),
        ("TRUE_FALSE", "True_False"),
        ("SHORT_ANSWER", "Short_Answer"),
    )

    type = models.CharField(max_length=10, choices=QUESTION_TYPE_CHOICES)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    question = models.TextField()
    choices = models.TextField()

    answer = models.TextField()
    point = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
