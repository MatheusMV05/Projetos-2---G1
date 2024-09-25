from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),  # URL raiz para a página inicial
    path('home/', views.home, name='home'),  # URL para a página inicial
    path('login/', views.login, name='login'),  # URL para a página de login
    path('cadastro/', views.cadastro, name='cadastro'),  # URL para a página de cadastro
]