from django.db import models

# Create your models here.
from exams.models import Exam
from users.models import User


class ExamineeExam(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    examinee = models.ForeignKey(User, on_delete=models.CASCADE)

    score = models.DecimalField(
        default=0, max_digits=10, decimal_places=2, blank=True, null=True
    )
    total_time = models.TimeField(blank=True, null=True)

    joined_date = models.DateTimeField(auto_now_add=True)
    flags = models.IntegerField(blank=True, null=True)
    taken = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.exam.title
