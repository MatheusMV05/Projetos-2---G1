# Generated by Django 5.1 on 2024-11-12 14:46

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ryb_agro_app', '0003_alter_colheita_quantidade'),
    ]

    operations = [
        migrations.AddField(
            model_name='planta',
            name='peso_colhido',
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name='planta',
            name='peso_previsto',
            field=models.FloatField(default=1),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='Celeiro',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=255)),
                ('capacidade', models.IntegerField()),
                ('localizacao', models.CharField(max_length=255)),
                ('peso_colhido', models.FloatField(default=0)),
                ('peso_esperado', models.FloatField(default=0)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='planta',
            name='celeiro',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='plantas', to='ryb_agro_app.celeiro'),
            preserve_default=False,
        ),
    ]
