# Generated by Django 5.0.3 on 2024-03-13 18:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exams', '0005_rename_max_questions_exam_max_examinees'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='amount',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
