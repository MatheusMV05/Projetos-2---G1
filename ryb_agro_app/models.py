from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

class UsuarioManager(BaseUserManager):
    def create_user(self, email, nome=None, celular=None, password=None):
        if not email:
            raise ValueError("O usuário deve ter um email")
        usuario = self.model(email=self.normalize_email(email), nome=nome, celular=celular)
        usuario.set_password(password)  # Define a senha de forma segura
        usuario.save(using=self._db)
        return usuario


class Usuario(AbstractBaseUser):
    nome = models.CharField(max_length=255)
    celular = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    estado = models.CharField(max_length=60)
    cidade = models.CharField(max_length=60)
    tamanho = models.CharField(max_length=100)

    objects = UsuarioManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['celular']

    def __str__(self):
        return self.email
    


class Planta(models.Model):
    nome = models.CharField(max_length=255)
    quantidade = models.FloatField()
    frequencia = models.CharField(max_length=50)
    user = models.ForeignKey(Usuario, on_delete=models.CASCADE)  # Associa cada planta a um usuário

    def __str__(self):
        return f'{self.nome} - {self.quantidade} kg ({self.frequencia})'

class cronograma(models.Model):
    # Associa o cronograma a um usuário específico
    user = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    
    # Data específica do cronograma
    data = models.DateField()
    
    # Associa o cronograma a uma planta específica
    planta = models.ForeignKey(Planta, on_delete=models.CASCADE)
    
    # Quantidade de planta associada ao cronograma (referência à planta)
    quantidade = models.ForeignKey(Planta, on_delete=models.CASCADE)
    
    # Frequência de atividades associada ao cronograma (referência à planta)
    frequencia = models.ForeignKey(Planta, on_delete=models.CASCADE)
    
    # Descrição do preparo da planta
    preparo = models.TextField()
    
    # Descrição da rega da planta
    regar = models.TextField()
    
    # Descrição da adubação da planta
    adubar = models.TextField()
    
    # Descrição do controle de pragas da planta
    pragas = models.TextField()
    
    # Descrição da colheita da planta
    colheita = models.TextField()

    # Representação em string do cronograma, mostrando a data e o nome da planta
    def __str__(self):
        return f'{self.data} - {self.planta.nome}'