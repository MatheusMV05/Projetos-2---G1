from django.shortcuts import render

# Create your views here.
def landinPage(request):
    return render(request, 'ryb_agro_app/landingPage.html')

def login(request):
    return render(request, 'ryb_agro_app/login.html')

def cadastro(request):
    return render(request, 'ryb_agro_app/cadastro.html')