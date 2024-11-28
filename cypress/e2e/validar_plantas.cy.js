Cypress.Commands.add('deleteAllUsers', () => {
    cy.exec('python delete_users.py', { failOnNonZeroExit: false });
});

Cypress.Commands.add('cadastro', (email) => {
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

Cypress.Commands.add('addPlanta', (planta, canteiro, quantidade, frequencia) => {
    cy.get('.card-container').contains(planta).click(); // Clica no card da planta
    cy.get('#selectCanteiro').select(canteiro); // Seleciona o canteiro
    cy.get('#harvestAmount').type(quantidade); // Define a quantidade
    cy.get('#harvestFrequency').select(frequencia); // Define a frequência
    cy.get('#addPlantButton').click(); // Adiciona a planta
});

describe('Validação de Plantas', () => {
    
    // Cenário 1: Plantas Compatíveis
    it('Deve validar corretamente quando as plantas cadastradas são compatíveis', () => {
        // Realiza o cadastro de usuário
        cy.cadastro();

        // Valida o redirecionamento após registro
        cy.url().should('include', '/cadastrar_plantas/');

        // Adiciona plantas compatíveis
        cy.addPlanta('Abóbora', 'Canteiro 1', '50', 'Mensalmente');
        cy.addPlanta('Milho', 'Canteiro 2', '30', 'Semanalmente');

        // Salva o cadastro
        cy.get('#saveAndContinueButton').click();

        // Valida a mensagem de sucesso
        cy.on('window:alert', (str) => {
            expect(str).to.equal('As plantas são compatíveis');
        });

        // Verifica o redirecionamento para a próxima etapa
        cy.url().should('include', '/proxima_etapa');
    });

    // Cenário 2: Plantas Inimigas
    it('Deve exibir erro e listar plantas incompatíveis quando há plantas inimigas', () => {
        // Realiza o cadastro de usuário
        cy.cadastro();

        // Valida o redirecionamento após registro
        cy.url().should('include', '/cadastrar_plantas/');

        // Adiciona plantas incompatíveis
        cy.addPlanta('Abóbora', 'Canteiro 1', '50', 'Mensalmente');
        cy.addPlanta('Cenoura', 'Canteiro 2', '20', 'Semanalmente');

        // Salva o cadastro
        cy.get('#saveAndContinueButton').click();

        // Valida a mensagem de erro
        cy.on('window:alert', (str) => {
            expect(str).to.equal('As plantas cadastradas são incompatíveis');
        });

        // Valida a lista de plantas inimigas
        cy.get('#plantListContainer')
            .should('be.visible')
            .and('contain', 'Abóbora')
            .and('contain', 'Cenoura');
    });
});
