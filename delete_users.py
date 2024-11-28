import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'g1_agro_app.settings')  
django.setup()

from ryb_agro_app.models import Usuario


Usuario.objects.all().delete()
print("Todos os usuários foram deletados.")