from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

# Usuário e gerenciador de usuário
class UsuarioManager(BaseUserManager):
    def create_user(self, email, nome=None, celular=None, password=None):
        if not email:
            raise ValueError("O usuário deve ter um email")
        usuario = self.model(email=self.normalize_email(email), nome=nome, celular=celular)
        usuario.set_password(password)
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

# Modelo de Planta
class Planta(models.Model):
    nome = models.CharField(max_length=255)
    quantidade = models.FloatField()
    frequencia = models.CharField(max_length=50)
    user = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.nome} - {self.quantidade} kg ({self.frequencia})'

# Modelo de Cronograma para cada planta
class Cronograma(models.Model):
    # Associa o cronograma a uma planta específica
    planta = models.ForeignKey(Planta, on_delete=models.CASCADE, related_name='cronogramas')
    
    # Descrição geral do cronograma (opcional)
    descricao_geral = models.TextField(blank=True, null=True)

    # Representação em string do cronograma, mostrando o nome da planta associada
    def __str__(self):
        return f'Cronograma para {self.planta.nome}'

# Modelo de Etapas para cada cronograma
class Etapa(models.Model):
    # Associa a etapa a um cronograma específico
    cronograma = models.ForeignKey(Cronograma, on_delete=models.CASCADE, related_name='etapas')
    
    # Nome da etapa (ex.: "Plantio", "Irrigação")
    nome = models.CharField(max_length=100)
    
    # Quantos dias após o plantio essa etapa ocorre
    dias_após_plantio = models.PositiveIntegerField()
    
    # Descrição detalhada da etapa
    descricao = models.TextField()
    
    # Tipo da ação a ser realizada, com opções predefinidas
    tipo_acao = models.CharField(max_length=50, choices=[
        ('Preparo do Solo', 'Preparo do Solo'),
        ('Plantio', 'Plantio'),
        ('Irrigação', 'Irrigação'),
        ('Inspeção', 'Inspeção'),
        ('Biofertilização', 'Biofertilização'),
        ('Controle de Pragas', 'Controle de Pragas'),
        ('Colheita', 'Colheita')
    ], default='Plantio')

    # Representação em string da etapa, mostrando o nome e os dias após o plantio
    def __str__(self):
        return f'{self.nome} ({self.dias_após_plantio} dias após plantio)'
