from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.conf import settings
from datetime import date, timedelta


# Gerenciador de Usuário Personalizado


class UsuarioManager(BaseUserManager):
    def create_user(self, email, nome=None, celular=None, password=None):
        if not email:
            raise ValueError("O usuário deve ter um email")
        usuario = self.model(email=self.normalize_email(
            email), nome=nome, celular=celular)
        usuario.set_password(password)
        usuario.save(using=self._db)
        return usuario

    def create_superuser(self, email, nome=None, celular=None, password=None):
        usuario = self.create_user(
            email, nome=nome, celular=celular, password=password)
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


class Setor(models.Model):
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="setores")
    nome = models.CharField(max_length=100)

    def __str__(self):
        return self.nome


class Canteiro(models.Model):
    setor = models.ForeignKey(
        Setor, on_delete=models.CASCADE, related_name="canteiros")
    nome = models.CharField(max_length=255)

    def __str__(self):
        return self.nome

# Modelo do Celeiro


class Celeiro(models.Model):
    nome = models.CharField(max_length=255)
    capacidade = models.IntegerField()
    localizacao = models.CharField(max_length=255)
    # Peso real colhido até o momento
    peso_colhido = models.FloatField(default=0)
    # Peso esperado somando todas as plantas
    peso_esperado = models.FloatField(default=0)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.nome} - {self.localizacao}'

    def atualizar_peso_colhido(self, peso_adicional):
        # Atualiza o peso colhido total no celeiro
        self.peso_colhido += peso_adicional
        self.save()


# Modelo de Planta


class Planta(models.Model):
    nome = models.CharField(max_length=255)
    # Quantidade em unidades ou quilogramas disponíveis para plantio
    quantidade = models.FloatField(default=0)
    frequencia = models.CharField(max_length=50)
    data_plantio = models.DateField(auto_now_add=True)
    # Peso previsto para essa planta ao final da colheita
    peso_previsto = models.FloatField(null=True, blank=True)
    # Peso real colhido dessa planta até o momento
    peso_colhido = models.FloatField(null=True, blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    celeiro = models.ForeignKey(
        Celeiro, on_delete=models.CASCADE, related_name="plantas", null=True, blank=True)

    def __str__(self):
        return f'{self.nome} - {self.quantidade} kg ({self.frequencia})'


# Modelo de Cronograma para cada planta


class Cronograma(models.Model):
    # Associa o cronograma a uma planta específica
    planta = models.ForeignKey(
        Planta, on_delete=models.CASCADE, related_name='cronogramas')

    # Descrição geral do cronograma (opcional)
    descricao_geral = models.TextField(blank=True, null=True)

    def __str__(self):
        return f'Cronograma para {self.planta.nome}'


# Modelo de Etapas para cada cronograma


class Etapa(models.Model):
    cronograma = models.ForeignKey(
        Cronograma, on_delete=models.CASCADE, related_name='etapas')
    nome = models.CharField(max_length=100)
    dias_após_plantio = models.IntegerField()
    intervalo_dias = models.PositiveIntegerField(default=0)
    descricao = models.TextField()
    tipo_acao = models.CharField(max_length=50, choices=[
        ('Preparo do Solo', 'Preparo do Solo'),
        ('Plantio', 'Plantio'),
        ('Irrigação', 'Irrigação'),
        ('Inspeção', 'Inspeção'),
        ('Biofertilização', 'Biofertilização'),
        ('Controle de Pragas', 'Controle de Pragas'),
        ('Colheita', 'Colheita')
    ], default='Plantio')
    # Novo campo para marcar conclusão
    concluida = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.nome} ({self.dias_após_plantio} dias após plantio)'


class Colheita(models.Model):
    etapa = models.ForeignKey(
        Etapa, on_delete=models.CASCADE, related_name='colheitas')

    quantidade = models.IntegerField()

    data_colheita = models.DateField(auto_now_add=True)

    def __str__(self):
        return f'Colheita de {self.quantidade} kg em {self.data_colheita}'


class DemandaComercial(models.Model):
    nome = models.CharField(max_length=100)  # Novo campo para nome da demanda
    TIPOS_DEMANDA = [
        ('compra', 'Compra'),
        ('venda', 'Venda')
    ]
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('concluída', 'Concluída'),
        ('cancelada', 'Cancelada')
    ]

    tipo = models.CharField(max_length=20, choices=TIPOS_DEMANDA)
    quantidade = models.PositiveIntegerField()
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    prazo = models.DateField()
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pendente')
    data_criacao = models.DateField(auto_now_add=True)
    agricultor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="demandas_comerciais")

    def prazo_proximo(self):
        return self.prazo <= date.today() + timedelta(days=3)

    def __str__(self):
        return f"{self.nome} - {self.tipo.capitalize()} - {self.status}"


class Clima(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    temperatura = models.FloatField()
    descricao = models.CharField(max_length=255)
    umidade = models.FloatField()
    vento = models.FloatField()
    fase_da_lua = models.CharField(max_length=100)
    data = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Clima de {self.user.cidade} em {self.data}"
