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
    path('adicionar_tarefa/', views.adicionar_tarefa, name='adicionar_tarefa'),
    path('insumos/', views.insumos_view, name='insumos_view'),
    path('demandas/', views.demandas_comerciais, name='demandas_comerciais'),
]
