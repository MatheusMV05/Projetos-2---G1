# Generated by Django 5.1.2 on 2024-11-05 01:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ryb_agro_app', '0009_planta_data_plantio_cronograma_etapa'),
    ]

    operations = [
        migrations.AddField(
            model_name='etapa',
            name='intervalo_dias',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
