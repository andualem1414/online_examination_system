from django.db import models
from exams.models import Exam

# Create your models here.


class Question(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    question = models.TextField()
    answer = models.TextField()
