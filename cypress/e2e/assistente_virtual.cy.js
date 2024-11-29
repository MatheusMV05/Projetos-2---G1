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

})