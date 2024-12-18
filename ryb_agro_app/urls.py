from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [

    path('', views.landingPage, name='landingPage'),
    path('cadastro/', views.cadastro, name='cadastro'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('login/', views.login_view, name='login'),
    path('recuperar-senha/', views.recuperar_senha, name='recuperar-senha'),
    path('redefine-senha/', views.redefine_senha, name='redefine-senha'),
    path('trocar-senha/', views.trocar_senha, name='trocar-senha'),
    path('cadastrar_setores/', views.cadastrar_setores, name='cadastrar_setores'),
    path('planta/', views.add_planta, name='planta'),
    path('get-canteiros/', views.get_canteiros, name='get_canteiros'),
    path('tarefas_do_dia/', views.tarefas_do_dia, name='tarefas_do_dia'),
    path('registrar_colheita/', views.registrar_colheita, name='registrar_colheita'),
    path('buscar_planta/', views.buscar_planta, name='buscar_planta'),
    path('celeiro/', views.celeiro, name='celeiro'),
    path('celeiro/atualizar_pesos/', views.atualizar_pesos_celeiro, name='atualizar_pesos_celeiro'),
    path('adicionar_tarefa/', views.adicionar_tarefa, name='adicionar_tarefa'),
    path('insumos/', views.insumos_view, name='insumos_view'),
    path('demandas/', views.demandas_comerciais, name='demandas_comerciais'),
    path('meu_plantio/', views.meu_plantio_view, name='meu_plantio'),
    path("adicionar-setor/", views.adicionar_setor, name="adicionar_setor"),
    path("renomear-setor/<int:setor_id>/", views.renomear_setor, name="renomear_setor"),
    path("apagar-setor/<int:setor_id>/", views.apagar_setor, name="apagar_setor"),
    path("adicionar-planta/<int:canteiro_id>/", views.adicionar_planta, name="adicionar_planta"),
    path('remover-planta/<int:planta_id>/', views.remover_planta, name='remover_planta'),
    path('apagar-canteiro/<int:canteiro_id>/', views.apagar_canteiro, name='apagar_canteiro'),
    path('adicionar_canteiro/<int:setor_id>/', views.adicionar_canteiro, name='adicionar_canteiro'),

]
