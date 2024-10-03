from django.shortcuts import render

# Create your views here.
def landingPage(request):
    return render(request, 'landingPage.html')

def cadastro(request):
    return render(request, 'cadastro.html')

def dashboard(request):
    return render(request, 'dashboard.html')

def login(request):
    return render(request, 'login.html')

def recuperar_senha(request):
    return render(request, 'recuperar-senha.html')

def redefine_senha(request):
    return render(request, 'redefine-senha.html')

def trocar_senha(request):
    return render(request, 'trocar-senha.html')