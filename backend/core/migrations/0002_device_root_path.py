# Generated by Django 4.2.22 on 2025-06-05 01:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='device',
            name='root_path',
            field=models.CharField(blank=True, max_length=256),
        ),
    ]
