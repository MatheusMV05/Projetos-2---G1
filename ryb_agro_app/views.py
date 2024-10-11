from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login as auth_login  
from .models import Usuario, Terreno, Planta

def landingPage(request):
    return render(request, 'landingPage.html')

def cadastro(request):
    if request.method == 'POST':
        nome = request.POST.get('nome')
        email = request.POST.get('email')
        confirmar_email = request.POST.get('confirmar_email')
        celular = request.POST.get('celular')
        password = request.POST.get('password')
        confirmar_senha = request.POST.get('confirmar_senha')

        if email != confirmar_email:
            messages.error(request, 'Os emails não coincidem.')
            return redirect('cadastro')

        if password != confirmar_senha:
            messages.error(request, 'As senhas não coincidem.')
            return redirect('cadastro')

        # Verifica se já existe um usuário com esse email
        if Usuario.objects.filter(email=email).exists():
            messages.error(request, 'O email já está em uso.')
            return redirect('cadastro')

        # Criação do usuário usando o manager
        usuario = Usuario.objects.create_user(email=email, celular=celular, password=password)
        
        messages.success(request, 'Cadastro realizado com sucesso. Agora você pode fazer login.')
        return redirect('primeiro-acesso')
    
    return render(request, 'cadastro.html')

def dashboard(request):
    return render(request, 'dashboard.html')

def login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        user = authenticate(request, username=email, password=password)

        if user is not None:
            auth_login(request, user)  
            return redirect('dashboard')
        else:
            messages.error(request, 'Email ou senha incorretos.')
            return redirect('login')
    return render(request, 'login.html')

def recuperar_senha(request):
    return render(request, 'recuperar-senha.html')

def redefine_senha(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        messages.success(request, f'Link de redefinição enviado para {email}.')
        return redirect('login')
    return render(request, 'redefine-senha.html')

def trocar_senha(request):
    if request.method == 'POST':
        password = request.POST.get('password')
        new_password = request.POST.get('new_password')
        confirmar_password = request.POST.get('confirmar_password')

        if new_password != confirmar_password:
            messages.error(request, 'As senhas novas não coincidem.')
            return redirect('trocar_senha')

        user = request.user
        if not user.check_password(password):
            messages.error(request, 'A senha atual está incorreta.')
            return redirect('trocar_senha')

        user.set_password(new_password)
        user.save()

        messages.success(request, 'Sua senha foi alterada com sucesso.')
        return redirect('login')

    return render(request, 'trocar-senha.html')

def cadastrar_terreno(request):
    if request.method == "POST":
        tamanho = request.POST.get("tamanho")
        plantas = request.POST.get("plantas")

        terreno = Terreno(
            tamanho=tamanho,
            plantas=plantas,
        )

        terreno.save()
        messages.success(request, 'Terreno cadastrado com sucesso.')
        return redirect('alguma_view_de_sucesso')  

    return render(request, 'primeiro-acesso.html')



def adicionar_planta(request, terreno_id):
    if request.method == "POST":
        planta_id = request.POST.get('planta_id')
        terreno = Terreno.objects.get(id=terreno_id)
        planta = Planta.objects.get(id=planta_id)

        # Adicionando a planta ao terreno
        terreno.plantas.add(planta)

        messages.success(request, f'{planta.nome} adicionada com sucesso ao terreno.')
        return redirect('detalhes_terreno', terreno_id=terreno.id)

    plantas = Planta.objects.all()
    return render(request, 'adicionar_planta.html', {'plantas': plantas, 'terreno_id': terreno_id})
