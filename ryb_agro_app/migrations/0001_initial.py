# Generated by Django 5.1.1 on 2024-10-07 20:17

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Usuario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('celular', models.CharField(max_length=15)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('senha', models.CharField(max_length=100)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
