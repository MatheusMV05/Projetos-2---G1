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




