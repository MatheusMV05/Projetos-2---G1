from django.shortcuts import render, redirect,  get_object_or_404
from django.contrib import messages
from django.contrib.auth import authenticate, login
from .models import Usuario, Planta, Celeiro
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
from .models import Planta, Cronograma, Etapa
from django.views.decorators.http import require_POST


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

def insumos_view(request):
    # Caminho do arquivo JSON com os insumos
    json_path = os.path.join(settings.BASE_DIR, 'etapas_plantas.json')

    # Carregar o arquivo JSON
    with open(json_path, 'r', encoding='utf-8') as file:
        data = json.load(file)

    # Filtrar os insumos de acordo com as plantas
    insumos_por_planta = {}
    for planta, detalhes in data.items():
        insumos_por_planta[planta] = detalhes['insumos_necessarios']

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
def celeiro(request):
    # Recupera todos os celeiros do usuário
    celeiros_usuario = Celeiro.objects.filter(user=request.user)
    
    celeiros_info = []

    for celeiro in celeiros_usuario:
        # Soma o peso esperado e o peso colhido total do celeiro
        peso_esperado_total = sum(planta.peso_previsto for planta in celeiro.plantas.all())
        peso_colhido_total = sum(planta.peso_colhido for planta in celeiro.plantas.all())

        # Armazena informações de cada planta no celeiro
        plantas_info = []
        for planta in celeiro.plantas.all():
            planta_info = {
                "nome": planta.nome,
                "quantidade": planta.quantidade,
                "frequencia": planta.frequencia,
                "data_plantio": planta.data_plantio,
                "peso_previsto": planta.peso_previsto,
                "peso_colhido": planta.peso_colhido,
            }
            plantas_info.append(planta_info)

        # Adiciona as informações do celeiro e das plantas
        celeiro_info = {
            "nome": celeiro.nome,
            "localizacao": celeiro.localizacao,
            "peso_esperado_total": peso_esperado_total,
            "peso_colhido_total": peso_colhido_total,
            "plantas_info": plantas_info,
        }
        celeiros_info.append(celeiro_info)

    return render(request, 'celeiro.html', {'celeiros_info': celeiros_info})





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
            messages.success(request, 'Demanda comercial registrada com sucesso.')
            return redirect('demandas_comerciais')
        
        elif 'editar' in request.POST:
            # Edição de demanda existente
            demanda = get_object_or_404(DemandaComercial, id=request.POST.get('demanda_id'), agricultor=request.user)
            demanda.nome = request.POST.get('nome')
            demanda.tipo = request.POST.get('tipo')
            demanda.quantidade = request.POST.get('quantidade')
            demanda.preco = request.POST.get('preco')
            demanda.prazo = request.POST.get('prazo')
            demanda.save()
            messages.success(request, 'Demanda comercial atualizada com sucesso.')
            return redirect('demandas_comerciais')

        elif 'alterar_status' in request.POST:
            # Atualização de status
            demanda = get_object_or_404(DemandaComercial, id=request.POST.get('demanda_id'), agricultor=request.user)
            demanda.status = request.POST.get('status')
            demanda.save()
            messages.success(request, 'Status da demanda atualizado com sucesso.')
            return redirect('demandas_comerciais')

    # Preparação para editar uma demanda
    if 'editar_demanda_id' in request.GET:
        demanda_em_edicao = get_object_or_404(DemandaComercial, id=request.GET['editar_demanda_id'], agricultor=request.user)

    # Exclusão de demanda
    if request.method == 'POST' and 'excluir' in request.POST:
        demanda = get_object_or_404(DemandaComercial, id=request.POST.get('demanda_id'), agricultor=request.user)
        demanda.delete()
        messages.success(request, 'Demanda comercial excluída com sucesso.')
        return redirect('demandas_comerciais')

    # Listagem e filtro
    demandas = DemandaComercial.objects.filter(agricultor=request.user).order_by('-data_criacao')
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