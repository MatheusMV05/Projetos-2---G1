import os
import json
from datetime import date
from .models import Planta, Cronograma, Etapa
from django.conf import settings

def get_tarefas_do_dia(request):
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

        # Busca as etapas específicas para o nome da planta
        planta_etapas = etapas_plantas.get(planta.nome, {})
        acoes = planta_etapas.get("acoes", [])

        # Verifica se a planta já possui cronogramas associados, caso contrário cria
        if not planta.cronogramas.exists():
            cronograma = Cronograma.objects.create(planta=planta)
            for acao in acoes:
                if isinstance(acao, dict):
                    Etapa.objects.create(
                        cronograma=cronograma,
                        tipo_acao=acao.get('tipo_acao'),
                        dias_após_plantio=acao.get('dias_após_plantio'),
                        intervalo_dias=acao.get('intervalo_dias'),
                        descricao=acao.get('descricao')
                    )

        # Itera pelos cronogramas e etapas associados à planta do usuário
        for cronograma in planta.cronogramas.all():
            for etapa in cronograma.etapas.all():
                # Verifica se a etapa deve ser realizada hoje
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

        # Se houver tarefas para a planta, adiciona ao dicionário de tarefas do dia
        if tarefas:
            tarefas_do_dia[planta.nome] = tarefas

    # Retorna as tarefas filtradas por usuário
    return tarefas_do_dia
