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
    path('primeiro-acesso/', views.cadastrar_terreno, name='primeiro-acesso'),
    path('planta/', views.add_planta, name='planta'),
    path('afazeres/', views.afazeres, name='afazeres'),
    
]
