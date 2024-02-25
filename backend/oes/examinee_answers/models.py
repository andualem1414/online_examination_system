from django.db import models
from questions.models import Question

from users.models import User
from exams.models import Exam

# Create your models here.


class ExamineeAnswer(models.Model):

    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    examinee = models.ForeignKey(User, on_delete=models.CASCADE)

    answer = models.TextField()
    result = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.answer


class Flag(models.Model):
    FLAG_TYPE_CHOICES = (
        ("FACE_LOST", "Face_Lost"),
        ("ANOTHER_PERSON", "Another_person"),
    )

    type = models.CharField(max_length=50, choices=FLAG_TYPE_CHOICES)
    examinee_answer = models.ForeignKey(ExamineeAnswer, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.type
