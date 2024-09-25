from django.shortcuts import render

# Create your views here.

def login(request):
    return render(request, 'ryb_agro_app/login.html')