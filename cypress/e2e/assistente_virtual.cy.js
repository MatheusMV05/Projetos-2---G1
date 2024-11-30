Cypress.Commands.add('deleteAllUsers', () => {
    cy.exec('python delete_users.py', { failOnNonZeroExit: false })
});

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

Cypress.Commands.add('setores', () => {
    cy.get('#numSetores').type('2')
    cy.get('.btn-secondary').click()
    cy.get('#canteirosSetor1').type('3')
    cy.get('#canteirosSetor2').type('5')
    cy.get('.btn-primary').click()
});

Cypress.Commands.add('add_plantas', () => {
    cy.get('[data-title="Abóbora"]').click()
    cy.get('#selectCanteiro').should('exist')
    cy.get('#selectCanteiro option').should('have.length.greaterThan', 0).contains('Setor 1 - Setor 1 Canteiro B')
    .then(($option) => {
        const value = $option.val();
        cy.get('#selectCanteiro').select(value);
    });
    cy.get('#harvestAmount').type('50')
    cy.get('#harvestFrequency').select('semanalmente')
    cy.get('#addPlantButton').click()
    cy.get('[data-title="Milho"]').click()
    cy.get('#selectCanteiro option').should('have.length.greaterThan', 0).contains('Setor 2 - Setor 2 Canteiro C')
    .then(($option) => {
        const value = $option.val();
        cy.get('#selectCanteiro').select(value);
        cy.get('#harvestAmount').type('30')
        cy.get('#harvestFrequency').select('uma vez')
        cy.get('#addPlantButton').click()
        cy.get('#saveAndContinueButton').click()
        cy.wait(500)

    });
});

Cypress.Commands.add('abrirChat', () => {
    cy.get('#gemini-chat-btn').click(); // Abre o chat
    cy.get('#gemini-chat-modal').should('be.visible'); // Verifica que o modal está visível
});

<<<<<<< Updated upstream
describe('assistente_virtual', () => {
    it('responder perguntas', () => {
        //steps do cenario1
        cy.cadastro()
        cy.setores()
        cy.add_plantas()
        cy.abrirChat()
        cy.get('#chat-input').type('Qual a melhor época para plantar milho?')
        cy.get('.btn.btn-success').click()
        cy.get('#chat-messages > :nth-child(3)').should('be.visible')
        .and('not.be.empty')
        .and('contain', 'milho') // Certifique-se de que o texto esperado está presente
        .and('contain', 'época')
        .and('contain', 'plantio');


    })
=======
Cypress.Commands.add('enviarPergunta', (pergunta, respostaEsperada) => {
    cy.get('#chat-input').type(pergunta); // Digita a pergunta no campo de input
    cy.contains('Enviar').click(); // Clica no botão enviar
    cy.get('chat-messages', { timeout: 10000 }).should('contain', respostaEsperada); // Verifica a resposta esperada
});

describe('Assistente Virtual Bento', () => {
    

    // Cenário 1: Responder perguntas gerais sobre o plantio
    it('Deve responder perguntas gerais sobre o plantio', () => {
        cy.cadastro();
        cy.visit('/dashboard/');
        cy.abrirChat();
        cy.enviarPergunta('Qual a melhor época para plantar milho?', 'A melhor época para plantar milho depende da região.');
    });

    // Cenário 2: Responder sobre manejo de uma cultura específica
    it('Deve responder perguntas sobre manejo de uma cultura específica', () => {
        cy.cadastro();
        cy.visit('/dashboard/');
        cy.abrirChat();
        cy.enviarPergunta('Qual é a melhor forma de irrigar o tomate?', 'A irrigação do tomate deve ser feita de forma uniforme.');
    });

    // Cenário 3: Consultar sobre pragas e doenças
    it('Deve responder perguntas sobre pragas e doenças', () => {
        cy.cadastro();
        cy.visit('/dashboard/');
        cy.abrirChat();
        cy.enviarPergunta('Como tratar pulgões na minha plantação?', 'Pulgões podem ser tratados com inseticidas naturais.');
    });

    // Cenário 4: Perguntar sobre práticas agrícolas sustentáveis
    it('Deve responder sobre práticas agrícolas sustentáveis', () => {
        cy.cadastro();
        cy.visit('/dashboard/');
        cy.abrirChat();
        cy.enviarPergunta('O que posso fazer para economizar água na irrigação?', 'Considere usar sistemas de irrigação por gotejamento.');
    });

    // Cenário 5: Assistente indisponível
    it('Deve exibir mensagem de indisponibilidade quando o serviço estiver offline', () => {
        // Simula indisponibilidade do backend
        cy.intercept('POST', '/dashboard/', { statusCode: 500 });
        cy.cadastro();
        cy.visit('/dashboard/');
        cy.abrirChat();
        cy.enviarPergunta('Qual a melhor época para plantar milho?', 'O assistente está indisponível no momento. Tente novamente mais tarde.');
    });
});
>>>>>>> Stashed changes

})