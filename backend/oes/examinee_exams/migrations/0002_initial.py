# Generated by Django 5.0.2 on 2024-02-13 08:34

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('examinee_exams', '0001_initial'),
        ('exams', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='examineeexam',
            name='exam',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='exams.exam'),
        ),
    ]
