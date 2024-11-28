Cypress.Commands.add('cadastro', () => {
    cy.deleteAllUsers();
    cy.visit('/');
    cy.get('.button').click();
    cy.get('.register-link > a').click();
    cy.get('#nome').type('Ana');
    cy.get('#celular').type('987654321');
    cy.get('#email').type('aa@gmail.com');
    cy.get('#confirmar_email').type('aa@gmail.com');
    cy.get('#password').type('123');
    cy.get('#confirmar_senha').type('123');
    cy.get('.submit').click();
});

Cypress.Commands.add('abrirChat', () => {
    cy.get('#gemini-chat-btn').click(); // Abre o chat
    cy.get('#gemini-chat-modal').should('be.visible'); // Verifica que o modal está visível
});

Cypress.Commands.add('enviarPergunta', (pergunta, respostaEsperada) => {
    cy.get('#chat-input').type(pergunta); // Digita a pergunta no campo de input
    cy.contains('Enviar').click(); // Clica no botão enviar
    cy.get('#chat-messages').should('contain', respostaEsperada); // Verifica a resposta esperada
});

describe('Assistente Virtual Bento', () => {
    beforeEach(() => {
        // Garante que o ambiente está limpo e acessa o dashboard
        cy.visit('/dashboard/');
    });

    // Cenário 1: Responder perguntas gerais sobre o plantio
    it('Deve responder perguntas gerais sobre o plantio', () => {
        cy.cadastro();
        cy.abrirChat();
        cy.enviarPergunta('Qual a melhor época para plantar milho?', 'A melhor época para plantar milho depende da região.');
    });

    // Cenário 2: Responder sobre manejo de uma cultura específica
    it('Deve responder perguntas sobre manejo de uma cultura específica', () => {
        cy.cadastro();
        cy.abrirChat();
        cy.enviarPergunta('Qual é a melhor forma de irrigar o tomate?', 'A irrigação do tomate deve ser feita de forma uniforme.');
    });

    // Cenário 3: Consultar sobre pragas e doenças
    it('Deve responder perguntas sobre pragas e doenças', () => {
        cy.cadastro();
        cy.abrirChat();
        cy.enviarPergunta('Como tratar pulgões na minha plantação?', 'Pulgões podem ser tratados com inseticidas naturais.');
    });

    // Cenário 4: Perguntar sobre práticas agrícolas sustentáveis
    it('Deve responder sobre práticas agrícolas sustentáveis', () => {
        cy.cadastro();
        cy.abrirChat();
        cy.enviarPergunta('O que posso fazer para economizar água na irrigação?', 'Considere usar sistemas de irrigação por gotejamento.');
    });

    // Cenário 5: Assistente indisponível
    it('Deve exibir mensagem de indisponibilidade quando o serviço estiver offline', () => {
        // Simula indisponibilidade do backend
        cy.intercept('POST', '/dashboard/', { statusCode: 500 });
        cy.cadastro();

        cy.abrirChat();
        cy.enviarPergunta('Qual a melhor época para plantar milho?', 'O assistente está indisponível no momento. Tente novamente mais tarde.');
    });
});

