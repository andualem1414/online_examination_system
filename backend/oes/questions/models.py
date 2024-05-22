from django.db.models.signals import post_save, post_delete
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
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.TextField()

    choices = models.JSONField(null=True, blank=True)
    answer = models.TextField()
    point = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.question


def update_exam_total_marks(sender, instance, **kwargs):
    # Get the exam associated with the question
    try:
        exam = instance.exam  # Assuming a ForeignKey relationship

        if exam:
            # Calculate the new total marks (consider logic for handling different question types)
            total_marks = sum(question.point for question in exam.question_set.all())
            questions_count = exam.question_set.all().count()

            # Update the exam model with the new total marks
            exam.questions_count = questions_count
            exam.total_mark = total_marks
            exam.save()
    except:
        print("error")


# Connect the receiver function to the signals
post_save.connect(update_exam_total_marks, sender=Question)
post_delete.connect(update_exam_total_marks, sender=Question)
