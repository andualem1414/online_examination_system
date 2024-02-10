from django.db import models

# Create your models here.


class Exam(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField()
