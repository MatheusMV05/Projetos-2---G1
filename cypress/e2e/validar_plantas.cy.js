Cypress.Commands.add('deleteAllUsers', () => {
    cy.exec('python delete_users.py', { failOnNonZeroExit: false });
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

    });
});

describe('Validação de Plantas', () => {
    
    // Cenário 1: Plantas Compatíveis
    it('Deve validar corretamente quando as plantas cadastradas são compatíveis', () => {
        // Realiza o cadastro de usuário
        cy.cadastro();
        cy.setores()
        cy.add_plantas()
        cy.on('window:alert', (alertText) => {
            // Verifica se o texto do alert é o esperado
            expect(alertText).to.equal('Plantas salvas com sucesso');
          });
        
    });

    // Cenário 2: Plantas Inimigas
    it('Deve exibir erro e listar plantas incompatíveis quando há plantas inimigas', () => {
        // Realiza o cadastro de usuário
        cy.cadastro();
        cy.setores()
        cy.add_plantas()

        cy.on('window:alert', (alertText) => {
            // Verifica se o texto do alert é o esperado
            expect(alertText).to.equal('As plantas cadastradas são incompatíveis');
          });

        
    });
});

