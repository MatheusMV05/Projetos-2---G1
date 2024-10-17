# Generated by Django 5.1.2 on 2024-10-15 17:46

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ryb_agro_app', '0007_remove_planta_tipo_planta_frequencia_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='planta',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]