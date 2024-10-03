from django.shortcuts import render

# Create your views here.
def landingPage(request):
    return render(request, 'landingPage.html')

def login(request):
    return render(request, 'login.html')

def cadastro(request):
    return render(request, 'cadastro.html')