from django.db import models

from users.models import User

# Create your models here.


class Exam(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField()
    exam_code = models.CharField(max_length=10)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    remote = models.BooleanField(default=True)
    public = models.BooleanField(default=False)

    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def duration(self):
        try:
            return self.end_time - self.start_time
        except:
            return None

    def __str__(self):
        return self.title


class Payment(models.Model):
    payment_code = models.CharField(max_length=40)
    examiner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    exam = models.ForeignKey(Exam, on_delete=models.SET_NULL, null=True)

    amount = models.IntegerField()
    payment_method = models.CharField(max_length=50)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
