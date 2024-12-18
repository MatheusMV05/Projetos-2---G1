from .chatbot import get_chat_response
from .api import get_climate_data
from .task import get_tarefas_do_dia
from django.shortcuts import render, redirect,  get_object_or_404
from django.contrib import messages
from django.contrib.auth import authenticate, login
from .models import Usuario, Celeiro, Canteiro, Setor,Colheita
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.shortcuts import render
from .models import Planta, Etapa, Cronograma, DemandaComercial

from datetime import date
from django.conf import settings
from datetime import datetime

import os  # Adicione esta linha para importar o módulo 'os'
import json
from django.conf import settings
from django.shortcuts import render
from django.http import JsonResponse
from datetime import date
from django.views.decorators.http import require_POST
import requests




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
        return redirect('cadastrar_setores')

    return render(request, 'cadastro.html')


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


@login_required
@csrf_exempt
def cadastrar_setores(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        setores = data.get('setores', [])

        for index, setor_data in enumerate(setores, start=1):
            setor_nome = f"Setor {index}"  # Nome automático do setor
            setor = Setor.objects.create(usuario=request.user, nome=setor_nome)

            for i in range(setor_data['canteiros']):
                nome_canteiro = f"{setor.nome} Canteiro {chr(65 + i)}"  # Nome automático do canteiro
                Canteiro.objects.create(setor=setor, nome=nome_canteiro)

        return JsonResponse({"redirect_url": "/planta/"}, status=201)

    return render(request, 'cadastrar_setores.html')

# View para renderizar e processar dados


from django.http import JsonResponse
from django.shortcuts import get_object_or_404

@login_required
@csrf_exempt
def add_planta(request):
    if request.method == 'GET':
        return render(request, 'add-planta.html')

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            plantas = data.get('plantas', [])
            canteiro_id = data.get('canteiro_id')  # Recebe o ID do canteiro
            setor_id = data.get('setor_id')
            
            # Valida se o canteiro pertence ao usuário logado
            canteiro = get_object_or_404(
                Canteiro, id=canteiro_id, setor__usuario=request.user
            )
            setor = get_object_or_404(
                Setor, id=setor_id, usuario=request.user
            )

            if not canteiro_id or not plantas:
                return JsonResponse({'status': 'error', 'message': 'Canteiro ou plantas não fornecidos.'}, status=400)

            for planta in plantas:
                Planta.objects.create(
                    nome=planta['name'],
                    quantidade=planta['amount'],
                    frequencia=planta['frequency'],
                    user=request.user,
                    canteiro=canteiro,  # Associa ao canteiro
                    setor=setor,
                )

            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'invalid method'}, status=405)



@login_required
def get_canteiros(request):
    canteiros = Canteiro.objects.filter(setor__usuario=request.user)
    canteiros_data = [
        {
            "id": c.id,
            "name": f"{c.setor.nome} - {c.nome}",
            "setor": c.setor.id,  # Inclui o ID do setor
        }
        for c in canteiros
    ]
    return JsonResponse(canteiros_data, safe=False)


@login_required
def tarefas_do_dia(request):
    # Caminho para o arquivo JSON contendo as etapas das plantas
    json_path = os.path.join(settings.BASE_DIR, 'etapas_plantas.json')
    with open(json_path, 'r', encoding='utf-8') as file:
        etapas_plantas = json.load(file)

    # Dicionário para armazenar as tarefas do dia
    tarefas_do_dia = {}

    # Filtra apenas plantas associadas ao usuário logado
    plantas_usuario = Planta.objects.filter(user=request.user)

    for planta in plantas_usuario:
        dias_desde_plantio = (date.today() - planta.data_plantio).days
        tarefas = []

        # Obtenha as etapas de ações da planta
        planta_etapas = etapas_plantas.get(planta.nome, {})
        acoes = planta_etapas.get("acoes", [])

        # Verifica e cria cronograma se não existir
        if not planta.cronogramas.exists():
            cronograma = Cronograma.objects.create(planta=planta)
            for acao in acoes:
                # Verifica se 'acao' é um dicionário
                if isinstance(acao, dict):
                    Etapa.objects.create(
                        cronograma=cronograma,
                        tipo_acao=acao.get('tipo_acao'),
                        dias_após_plantio=acao.get('dias_após_plantio'),
                        intervalo_dias=acao.get('intervalo_dias'),
                        descricao=acao.get('descricao')
                    )
                else:
                    # Para depuração, remover em produção
                    print(f"Etapa inesperada: {acao}")

        # Verifica etapas já existentes no cronograma da planta
        for cronograma in planta.cronogramas.all():
            for etapa in cronograma.etapas.all():
                if etapa.intervalo_dias == 0:
                    if dias_desde_plantio >= etapa.dias_após_plantio:
                        tarefas.append({
                            "tipo_acao": etapa.tipo_acao,
                            "descricao": etapa.descricao,
                            "planta": planta.nome,
                        })
                else:
                    if dias_desde_plantio >= etapa.dias_após_plantio and \
                       (dias_desde_plantio - etapa.dias_após_plantio) % etapa.intervalo_dias == 0:
                        tarefas.append({
                            "tipo_acao": etapa.tipo_acao,
                            "descricao": etapa.descricao,
                            "planta": planta.nome,
                        })

        if tarefas:
            tarefas_do_dia[planta.nome] = tarefas

    return render(request, 'tarefas_do_dia.html', {'tarefas_do_dia': tarefas_do_dia})




@login_required
def insumos_view(request):
    # Caminho do arquivo JSON com os insumos
    json_path = os.path.join(settings.BASE_DIR, 'etapas_plantas.json')

    # Carregar o arquivo JSON
    with open(json_path, 'r', encoding='utf-8') as file:
        data = json.load(file)

    # Recuperar as plantas cadastradas pelo usuário autenticado
    plantas_cadastradas = Planta.objects.filter(user=request.user)

    # Filtrar os insumos de acordo com as plantas do usuário
    insumos_por_planta = {}
    for planta in plantas_cadastradas:
        planta_nome = planta.nome
        if planta_nome in data:
            insumos_por_planta[planta_nome] = data[planta_nome]['insumos_necessarios']

    # Renderizar o template com os dados de insumos
    return render(request, 'insumos.html', {'insumos_por_planta': insumos_por_planta})


@login_required
@csrf_exempt
def buscar_planta(request):
    if request.method == 'GET':
        termo_busca = request.GET.get('query', '').lower()
        tipo_acao_filtro = request.GET.get('tipo_acao', '').lower()
        tarefas_filtradas = {}

        for planta in Planta.objects.all():
            # Aplica o termo de busca
            if termo_busca in planta.nome.lower():
                tarefas = []
                dias_desde_plantio = (date.today() - planta.data_plantio).days

                # Carrega as etapas de cada planta do arquivo JSON
                etapas_plantas = json.load(open(os.path.join(
                    settings.BASE_DIR, 'etapas_plantas.json'), 'r', encoding='utf-8'))
                planta_etapas = etapas_plantas.get(
                    planta.nome, {}).get("acoes", [])

                # Filtra as etapas da planta com base nas regras de intervalo
                for cronograma in planta.cronogramas.all():
                    for etapa in cronograma.etapas.all():
                        if etapa.intervalo_dias == 0:
                            if dias_desde_plantio >= etapa.dias_após_plantio:
                                # Verifica se corresponde ao filtro de tipo de ação
                                if not tipo_acao_filtro or tipo_acao_filtro == etapa.tipo_acao.lower():
                                    tarefas.append({
                                        "tipo_acao": etapa.tipo_acao,
                                        "descricao": etapa.descricao,
                                        "planta": planta.nome
                                    })
                        else:
                            if dias_desde_plantio >= etapa.dias_após_plantio and \
                               (dias_desde_plantio - etapa.dias_após_plantio) % etapa.intervalo_dias == 0:
                                if not tipo_acao_filtro or tipo_acao_filtro == etapa.tipo_acao.lower():
                                    tarefas.append({
                                        "tipo_acao": etapa.tipo_acao,
                                        "descricao": etapa.descricao,
                                        "planta": planta.nome
                                    })

                if tarefas:
                    tarefas_filtradas[planta.nome] = tarefas

        return JsonResponse({'tarefas': tarefas_filtradas})
    return JsonResponse({'error': 'Método não permitido'}, status=405)


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


@login_required
@csrf_exempt
def celeiro(request):
    plantas_usuario = Planta.objects.filter(user=request.user)
    peso_previsto = sum(planta.quantidade for planta in plantas_usuario)
    peso_colhido = sum(planta.peso_colhido or 0 for planta in plantas_usuario)

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            action = data.get('action')

            if action == 'add_colheita':
                planta_id = data.get('planta_id')
                kg_colhidos = float(data.get('peso_colhido', 0))
                planta = Planta.objects.get(id=planta_id, user=request.user)
                
                # Validação para não exceder o limite
                if (planta.peso_colhido or 0) + kg_colhidos > planta.quantidade:
                    return JsonResponse({
                        'success': False,
                        'error': 'A quantidade colhida não pode exceder o total cadastrado para esta planta.'
                    }, status=400)
                
                planta.peso_colhido = (planta.peso_colhido or 0) + kg_colhidos
                planta.save()
                return JsonResponse({'success': True, 'message': 'Quantidade colhida atualizada com sucesso!'})

            elif action == 'reset_colheita':
                for planta in plantas_usuario:
                    planta.peso_colhido = 0
                    planta.save()
                return JsonResponse({'success': True, 'message': 'Colheita resetada com sucesso!'})

            elif action == 'delete_colheita':
                planta_id = data.get('planta_id')
                planta = Planta.objects.get(id=planta_id, user=request.user)
                
                # Resetar o peso colhido da planta para 0
                planta.peso_colhido = 0
                planta.save()
                return JsonResponse({'success': True, 'message': 'Colheita excluída com sucesso!'})

        except Planta.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Planta não encontrada.'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    return render(request, 'celeiro.html', {
        'plantas': plantas_usuario,
        'peso_previsto': peso_previsto,
        'peso_colhido': peso_colhido,
    })


@login_required
@csrf_exempt
def atualizar_pesos_celeiro(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        planta_id = data.get('planta_id')
        peso_colhido = data.get('peso_colhido', 0)

        try:
            planta = Planta.objects.get(id=planta_id, user=request.user)
            planta.peso_colhido = planta.peso_colhido + peso_colhido if planta.peso_colhido else peso_colhido
            planta.save()

            celeiro = planta.celeiro
            if celeiro:
                celeiro.atualizar_peso_colhido(peso_colhido)

            return JsonResponse({'success': True, 'peso_colhido': planta.peso_colhido}, status=200)
        except Planta.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Planta não encontrada.'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)



@login_required
@csrf_exempt
@require_POST
def adicionar_tarefa(request):
    data = json.loads(request.body)
    tipo_acao = data.get('tipo_acao')
    descricao = data.get('descricao')
    planta_nome = data.get('planta')

    try:
        planta = Planta.objects.get(nome=planta_nome, user=request.user)
        cronograma, created = Cronograma.objects.get_or_create(planta=planta)

        # Criação da etapa com base nas informações recebidas
        etapa = Etapa.objects.create(
            cronograma=cronograma,
            tipo_acao=tipo_acao,
            descricao=descricao,
            dias_após_plantio=0,  # Assume que é para hoje
            intervalo_dias=0  # Uma vez única para esta tarefa
        )

        return JsonResponse({
            'success': True,
            'tarefa': {
                'id': etapa.id,
                'tipo_acao': etapa.tipo_acao,
                'descricao': etapa.descricao,
                'planta': planta.nome
            }
        }, status=201)
    except Planta.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Planta não encontrada.'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

# @login_required


def demandas_comerciais(request):
    demanda_em_edicao = None  # Variável para armazenar a demanda em edição

    # Registrar ou editar demanda
    if request.method == 'POST':
        if 'registrar' in request.POST:
            # Registro de nova demanda
            DemandaComercial.objects.create(
                nome=request.POST.get('nome'),
                tipo=request.POST.get('tipo'),
                quantidade=request.POST.get('quantidade'),
                preco=request.POST.get('preco'),
                prazo=request.POST.get('prazo'),
                agricultor=request.user
            )
            messages.success(
                request, 'Demanda comercial registrada com sucesso.')
            return redirect('demandas_comerciais')

        elif 'editar' in request.POST:
            # Edição de demanda existente
            demanda = get_object_or_404(DemandaComercial, id=request.POST.get(
                'demanda_id'), agricultor=request.user)
            demanda.nome = request.POST.get('nome')
            demanda.tipo = request.POST.get('tipo')
            demanda.quantidade = request.POST.get('quantidade')
            demanda.preco = request.POST.get('preco')
            demanda.prazo = request.POST.get('prazo')
            demanda.save()
            messages.success(
                request, 'Demanda comercial atualizada com sucesso.')
            return redirect('demandas_comerciais')

        elif 'alterar_status' in request.POST:
            # Atualização de status
            demanda = get_object_or_404(DemandaComercial, id=request.POST.get(
                'demanda_id'), agricultor=request.user)
            demanda.status = request.POST.get('status')
            demanda.save()
            messages.success(
                request, 'Status da demanda atualizado com sucesso.')
            return redirect('demandas_comerciais')

    # Preparação para editar uma demanda
    if 'editar_demanda_id' in request.GET:
        demanda_em_edicao = get_object_or_404(
            DemandaComercial, id=request.GET['editar_demanda_id'], agricultor=request.user)

    # Exclusão de demanda
    if request.method == 'POST' and 'excluir' in request.POST:
        demanda = get_object_or_404(DemandaComercial, id=request.POST.get(
            'demanda_id'), agricultor=request.user)
        demanda.delete()
        messages.success(request, 'Demanda comercial excluída com sucesso.')
        return redirect('demandas_comerciais')

    # Listagem e filtro
    demandas = DemandaComercial.objects.filter(
        agricultor=request.user).order_by('-data_criacao')
    tipo_filtro = request.GET.get('tipo')
    status_filtro = request.GET.get('status')

    if tipo_filtro:
        demandas = demandas.filter(tipo=tipo_filtro)
    if status_filtro:
        demandas = demandas.filter(status=status_filtro)

    return render(request, 'demandas_comerciais.html', {
        'demandas': demandas,
        'demanda_em_edicao': demanda_em_edicao,
        'tipo_filtro': tipo_filtro,
        'status_filtro': status_filtro
    })



def dashboard(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            # Mensagem inicial do chatbot
            if data.get("is_initial", False):
                reply = (
                    "Olá! Eu sou Bento, um especialista em agricultura. "
                    "Estou aqui para ajudar com suas dúvidas sobre cultivo, práticas agrícolas e sustentabilidade."
                )
                return JsonResponse({"reply": reply}, status=200)

            # Lógica para clima
            if "latitude" in data and "longitude" in data:
                latitude = data.get("latitude")
                longitude = data.get("longitude")
                clima = get_climate_data(latitude, longitude)
                return JsonResponse(clima, status=200)

            # Lógica para chatbot
            elif "chat_message" in data:
                chat_message = data.get("chat_message")
                reply = get_chat_response(chat_message)
                return JsonResponse({"reply": reply}, status=200)

            return JsonResponse({"error": "Dados inválidos fornecidos."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    # Renderiza a página inicial
    tarefas_do_dia = get_tarefas_do_dia(request)
    return render(request, 'dashboard.html', {'tarefas_do_dia': tarefas_do_dia})

@login_required
def meu_plantio_view(request):
    # Lista fixa de plantas suportadas no sistema
    plantas_suportadas = [
        {"id": 1, "nome": "Milho"},
        {"id": 2, "nome": "Inhame"},
        {"id": 3, "nome": "Batata Doce"},
        {"id": 4, "nome": "Abóbora"},
        {"id": 5, "nome": "Cenoura"},
    ]

    # Carrega os setores e canteiros do usuário
    setores = Setor.objects.filter(usuario=request.user)
    dados_plantio = [
        {
            "setor_id": setor.id,
            "setor": setor.nome,
            "canteiros": [
                {
                    "id": canteiro.id,
                    "canteiro": canteiro.nome,
                    "plantas": list(canteiro.plantas.all()),
                }
                for canteiro in setor.canteiros.all()
            ],
        }
        for setor in setores
    ]

    return render(
        request,
        "meu_plantio.html",
        {
            "dados_plantio": dados_plantio,
            "plantas_disponiveis": plantas_suportadas,
        },
    )


from django.shortcuts import redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Setor, Canteiro


@login_required
def adicionar_setor(request):
    if request.method == "POST":
        nome = request.POST.get("nome")
        quantidade_canteiros = int(request.POST.get("quantidade_canteiros", 0))

        if nome and quantidade_canteiros > 0:
            # Cria o setor
            setor = Setor.objects.create(nome=nome, usuario=request.user)

            # Cria os canteiros
            for i in range(1, quantidade_canteiros + 1):
                Canteiro.objects.create(nome=f"Canteiro {i}", setor=setor)

    return redirect("meu_plantio")

@login_required
def renomear_setor(request, setor_id):
    setor = get_object_or_404(Setor, id=setor_id, usuario=request.user)
    if request.method == "POST":
        novo_nome = request.POST.get("novo_nome")
        if novo_nome:
            setor.nome = novo_nome
            setor.save()
    return redirect("meu_plantio")

@login_required
def apagar_setor(request, setor_id):
    setor = get_object_or_404(Setor, id=setor_id, usuario=request.user)
    if request.method == "POST":
        setor.delete()
    return redirect("meu_plantio")

from django.shortcuts import get_object_or_404, redirect
from .models import Canteiro, Planta

@login_required
def adicionar_planta(request, canteiro_id):
    if request.method == "POST":
        canteiro = get_object_or_404(Canteiro, id=canteiro_id)
        planta_nome = request.POST.get("planta_nome")

        # Verifica se a planta já existe no banco e a associa ao canteiro
        planta, created = Planta.objects.get_or_create(
            nome=planta_nome, defaults={"user": request.user}
        )
        planta.canteiro = canteiro
        planta.save()

        return redirect("meu_plantio")
    
def remover_planta(request, planta_id):
    # Obtém a planta pelo ID e verifica o usuário autenticado
    planta = get_object_or_404(Planta, id=planta_id, user=request.user)

    # Remove a planta
    planta.delete()

    # Redireciona de volta para a página principal
    return redirect('meu_plantio')

def apagar_canteiro(request, canteiro_id):
    # Obtém o canteiro pelo ID e verifica o usuário autenticado
    canteiro = get_object_or_404(Canteiro, id=canteiro_id, setor__usuario=request.user)
    
    # Apaga o canteiro
    canteiro.delete()

    # Redireciona de volta para a página principal
    return redirect('meu_plantio')

def adicionar_canteiro(request, setor_id):
    setor = get_object_or_404(Setor, id=setor_id)
    if request.method == 'POST':
        nome_canteiro = request.POST.get('nome')
        if nome_canteiro:
            Canteiro.objects.create(nome=nome_canteiro, setor=setor)
        return redirect('meu_plantio_view')  # Redirecionar para a página desejada após adicionar o canteiro.
    return render(request, 'meu_plantio.html')  # Ou outra página de sua escolha


