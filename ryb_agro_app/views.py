from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login
from .models import Usuario, Planta
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.shortcuts import render
from .models import Planta, Etapa, Cronograma
from datetime import date

import os  # Adicione esta linha para importar o módulo 'os'
import json
from django.conf import settings
from django.shortcuts import render
from django.http import JsonResponse
from datetime import date
from .models import Planta, Cronograma, Etapa


def landingPage(request):
    return render(request, 'landingPage.html')


def cadastro(request):
    if request.method == 'POST':
        nome = request.POST.get('nome')
        email = request.POST.get('email')
        confirmar_email = request.POST.get('confirmar_email')
        celular = request.POST.get('celular')
        password = request.POST.get('password')
        confirmar_senha = request.POST.get('confirmar_senha')

        if not password and not email:
            messages.error(request, 'O email e senha são obrigatórios.')
            return redirect('cadastro')

        if not email:
            messages.error(request, 'O email é obrigatório.')
            return redirect('cadastro')

        if not password:
            messages.error(request, 'A senha é obrigatória.')
            return redirect('cadastro')

        if email != confirmar_email:
            messages.error(request, 'Os emails não coincidem.')
            return redirect('cadastro')

        if password != confirmar_senha:
            messages.error(request, 'As senhas não coincidem.')
            return redirect('cadastro')

        if Usuario.objects.filter(email=email).exists():
            messages.error(request, 'O email já está em uso.')
            return redirect('cadastro')

        # Criação do usuário
        usuario = Usuario.objects.create_user(
            nome=nome, email=email, celular=celular, password=password)

        # Autentica o usuário automaticamente
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)  # Autentica o usuário

        # Redireciona para o primeiro acesso
        return redirect('primeiro-acesso')

    return render(request, 'cadastro.html')


def dashboard(request):
    return render(request, 'dashboard.html')


def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        user = authenticate(request, email=email, password=password)

        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, 'Email ou senha incorretos.')
            return redirect('login')
    return render(request, 'login.html')


def recuperar_senha(request):
    return render(request, 'recuperar-senha.html')


def redefine_senha(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        messages.success(request, f'Link de redefinição enviado para {email}.')
        return redirect('login')
    return render(request, 'redefine-senha.html')


def trocar_senha(request):
    if request.method == 'POST':
        password = request.POST.get('password')
        new_password = request.POST.get('new_password')
        confirmar_password = request.POST.get('confirmar_password')

        if new_password != confirmar_password:
            messages.error(request, 'As senhas novas não coincidem.')
            return redirect('trocar_senha')

        user = request.user
        if not user.check_password(password):
            messages.error(request, 'A senha atual está incorreta.')
            return redirect('trocar_senha')

        user.set_password(new_password)
        user.save()

        messages.success(request, 'Sua senha foi alterada com sucesso.')
        return redirect('login')

    return render(request, 'trocar-senha.html')


def cadastrar_terreno(request):
    if request.method == "POST":
        cidade = request.POST.get("cidade")
        estado = request.POST.get("estado")
        tamanho = request.POST.get("tamanho")

        usuario = request.user  # O usuário logado
        usuario.cidade = cidade
        usuario.estado = estado
        usuario.tamanho = tamanho
        usuario.save()

        messages.success(request, 'Terreno cadastrado com sucesso.')
        return redirect('planta')

    return render(request, 'primeiro-acesso.html')


# View para renderizar e processar dados
@login_required  # Garante que o usuário esteja logado para acessar essa view
@csrf_exempt  # Apenas para testes, remova em produção
def add_planta(request):
    if request.method == 'GET':
        return render(request, 'add-planta.html')

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            plantas = data.get('plantas', [])

            # Salvar as plantas com o usuário associado
            for planta in plantas:
                Planta.objects.create(
                    nome=planta['name'],
                    quantidade=planta['amount'],
                    frequencia=planta['frequency'],
                    user=request.user  # Associa o usuário logado
                )

            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'invalid method'}, status=405)


def tarefas_do_dia(request):
    json_path = os.path.join(settings.BASE_DIR, 'etapas_plantas.json')
    with open(json_path, 'r', encoding='utf-8') as file:
        etapas_plantas = json.load(file)

    tarefas_do_dia = {}

    for planta in Planta.objects.all():
        dias_desde_plantio = (date.today() - planta.data_plantio).days
        tarefas = []

        etapas = etapas_plantas.get(planta.nome, [])
        if not planta.cronogramas.exists():
            cronograma = Cronograma.objects.create(planta=planta)
            for etapa in etapas:
                # Verifique se 'etapa' é realmente um dicionário
                if isinstance(etapa, dict):
                    Etapa.objects.create(
                        cronograma=cronograma,
                        tipo_acao=etapa.get('tipo_acao'),
                        dias_após_plantio=etapa.get('dias_após_plantio'),
                        intervalo_dias=etapa.get('intervalo_dias'),
                        descricao=etapa.get('descricao')
                    )
                else:
                    print(f"Etapa inesperada: {etapa}")  # Para depuração, remover em produção

        for cronograma in planta.cronogramas.all():
            for etapa in cronograma.etapas.all():
                if etapa.intervalo_dias == 0:
                    if dias_desde_plantio >= etapa.dias_após_plantio:
                        tarefas.append({
                            "tipo_acao": etapa.tipo_acao,
                            "descricao": etapa.descricao,
                            "planta": planta.nome
                        })
                else:
                    if dias_desde_plantio >= etapa.dias_após_plantio and \
                       (dias_desde_plantio - etapa.dias_após_plantio) % etapa.intervalo_dias == 0:
                        tarefas.append({
                            "tipo_acao": etapa.tipo_acao,
                            "descricao": etapa.descricao,
                            "planta": planta.nome
                        })

        if tarefas:
            tarefas_do_dia[planta.nome] = tarefas

    return render(request, 'tarefas_do_dia.html', {'tarefas_do_dia': tarefas_do_dia})


def registrar_colheita(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        tarefa_id = data.get('tarefaId')

        try:
            tarefa = Etapa.objects.get(id=tarefa_id, tipo_acao="Colheita")
            tarefa.concluida = True
            tarefa.save()

            # Lógica adicional para armazenar a quantidade colhida

            return JsonResponse({"message": "Colheita registrada com sucesso."}, status=200)
        except Etapa.DoesNotExist:
            return JsonResponse({"message": "Tarefa não encontrada ou não é de tipo Colheita."}, status=404)

    return JsonResponse({"message": "Método não permitido."}, status=405)