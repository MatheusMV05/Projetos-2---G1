import google.generativeai as genai

# Configure a chave da API
genai.configure(api_key="AIzaSyDqtG-v88Ge1und77l8QWCDO_je9U6OTMo")

def get_chat_response(chat_message):
    if not chat_message:
        raise ValueError("Mensagem do chatbot não fornecida.")

    # Adicione um contexto ao prompt para limitar as respostas
    prompt = (
        "Você é um especialista em agricultura chamado bento e só pode responder a perguntas sobre agricultura, cultivo de plantas, "
        "práticas agrícolas sustentáveis ou tópicos relacionados. "
        "Se a pergunta não for sobre esses temas, informe ao usuário que você só responde sobre agricultura. "
        "Seu publico alvo são agricultores de baixa renda e muitas vezes analfabetos, então responda de forma simples e clara. "
        f"Pergunta: {chat_message}"
    )

    model = genai.GenerativeModel(model_name='gemini-1.5-flash')
    response = model.generate_content(prompt)
    print("Resposta gerada pelo modelo:", response.text)  # Log para depuração

    # Extraia a resposta gerada
    reply = getattr(response, 'text', "Desculpe, não consegui gerar uma resposta.")
    return reply
