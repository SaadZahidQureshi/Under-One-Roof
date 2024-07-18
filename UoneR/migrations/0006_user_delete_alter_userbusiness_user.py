# Generated by Django 5.0.6 on 2024-07-17 09:00

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('UoneR', '0005_user_full_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='delete',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='userbusiness',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='business', to=settings.AUTH_USER_MODEL),
        ),
    ]
