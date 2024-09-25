from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'ryb_agro_app/home.html')

def login(request):
    return render(request, 'ryb_agro_app/login.html')

def cadastro(request):
    return render(request, 'ryb_agro_app/cadastro.html')