from django.db import models
from exams.models import Exam
from users.models import User


# Create your models here.


class Question(models.Model):
    QUESTION_TYPE_CHOICES = (
        ("CHOICE", "Choice"),
        ("TRUE_FALSE", "True_False"),
        ("SHORT_ANSWER", "Short_Answer"),
    )

    type = models.CharField(max_length=50, choices=QUESTION_TYPE_CHOICES)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.TextField()
  
    choices = models.JSONField(null=True, blank=True)
    answer = models.TextField()
    point = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.question
