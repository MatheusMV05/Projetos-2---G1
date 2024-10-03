from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
   
    path('', views.landingPage, name='landingPage'),  # URL raiz para a página inicial
]