from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

class UsuarioManager(BaseUserManager):
    def create_user(self, email, celular, password=None):
        if not email:
            raise ValueError("O usuário deve ter um email")
        usuario = self.model(email=self.normalize_email(email), celular=celular)
        usuario.set_password(password)  # Define a senha de forma segura
        usuario.save(using=self._db)
        return usuario

class Usuario(AbstractBaseUser):
    celular = models.CharField(max_length=15)
    email = models.EmailField(unique=True)

    objects = UsuarioManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['celular']

    def __str__(self):
        return self.email
    
class Terreno(models.Model):
    pais = models.CharField(max_length=60)
    estado = models.CharField(max_length=60)
    cidade = models.CharField(max_length=60)
    plantas = models.CharField(max_length=60)

