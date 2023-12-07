# Generated by Django 4.2.6 on 2023-12-06 00:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('meetings', '0007_alter_meeting_comments'),
        ('feedbacks', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedback',
            name='meeting',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='meetings.meeting'),
        ),
    ]
