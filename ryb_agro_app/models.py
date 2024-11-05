from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from datetime import date

# Gerenciador de Usuário Personalizado
class UsuarioManager(BaseUserManager):
    def create_user(self, email, nome=None, celular=None, password=None):
        if not email:
            raise ValueError("O usuário deve ter um email")
        usuario = self.model(email=self.normalize_email(email), nome=nome, celular=celular)
        usuario.set_password(password)
        usuario.save(using=self._db)
        return usuario

    def create_superuser(self, email, nome=None, celular=None, password=None):
        usuario = self.create_user(email, nome=nome, celular=celular, password=password)
        usuario.is_admin = True
        usuario.save(using=self._db)
        return usuario

# Modelo de Usuário Personalizado
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

# Modelo de Planta

class Planta(models.Model):
    nome = models.CharField(max_length=255)
    quantidade = models.FloatField()
    frequencia = models.CharField(max_length=50)
    user = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    data_plantio = models.DateField(auto_now_add=True)  # Define a data de plantio automaticamente para novos registros

    def __str__(self):
        return f'{self.nome} - {self.quantidade} kg ({self.frequencia})'

# Modelo de Cronograma para cada planta
class Cronograma(models.Model):
    planta = models.ForeignKey(Planta, on_delete=models.CASCADE, related_name='cronogramas')
    descricao_geral = models.TextField(blank=True, null=True)

    def __str__(self):
        return f'Cronograma para {self.planta.nome}'

# Modelo de Etapas para cada cronograma
class Etapa(models.Model):
    cronograma = models.ForeignKey(Cronograma, on_delete=models.CASCADE, related_name='etapas')
    nome = models.CharField(max_length=100)
    dias_após_plantio = models.IntegerField()
    intervalo_dias = models.PositiveIntegerField(default=0)  # Novo campo
    descricao = models.TextField()
    tipo_acao = models.CharField(
        max_length=50,
        choices=[
            ('Preparo do Solo', 'Preparo do Solo'),
            ('Plantio', 'Plantio'),
            ('Irrigação', 'Irrigação'),
            ('Inspeção', 'Inspeção'),
            ('Biofertilização', 'Biofertilização'),
            ('Controle de Pragas', 'Controle de Pragas'),
            ('Colheita', 'Colheita')
        ],
        default='Plantio'
    )

    def __str__(self):
        return f'{self.nome} ({self.dias_após_plantio} dias após plantio)'