import os
import json
from datetime import date
from .models import Planta, Cronograma, Etapa
from django.conf import settings

def get_tarefas_do_dia(request):
    json_path = os.path.join(settings.BASE_DIR, 'etapas_plantas.json')
    with open(json_path, 'r', encoding='utf-8') as file:
        etapas_plantas = json.load(file)

    tarefas_do_dia = {}
    

    # Filtra apenas plantas do usuário logado
    for planta in Planta.objects.filter(user=request.user):
        dias_desde_plantio = (date.today() - planta.data_plantio).days
        tarefas = []

        planta_etapas = etapas_plantas.get(planta.nome, {})
        acoes = planta_etapas.get("acoes", [])

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

        for cronograma in planta.cronogramas.filter(planta__user=request.user):
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

    return tarefas_do_dia
