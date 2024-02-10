from django.db import models
from questions.models import Question

# Create your models here.


class ExamineeAnswer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.TextField()
    result = models.IntegerField()
