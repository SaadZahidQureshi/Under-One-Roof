# Generated by Django 5.0.6 on 2024-07-15 06:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('UoneR', '0002_otp'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='phone_number',
            field=models.CharField(default='000 000 000 000', max_length=20),
        ),
    ]
