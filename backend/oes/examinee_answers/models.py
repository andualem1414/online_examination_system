from django.db import models
from questions.models import Question

from users.models import User

# Create your models here.


class ExamineeAnswer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    examinee = models.ForeignKey(User, on_delete=models.CASCADE)

    answer = models.TextField()
    result = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Flag(models.Model):
    FLAG_TYPE_CHOICES = (
        ("FACE_LOST", "Face_Lost"),
        ("ANOTHER_PERSON", "Another_person"),
    )

    type = models.CharField(max_length=10, choices=FLAG_TYPE_CHOICES)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
