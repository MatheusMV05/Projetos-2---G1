Cypress.Commands.add('deleteAllUsers', () => {
    cy.exec('python delete_users.py', { failOnNonZeroExit: false })
});

Cypress.Commands.add('cadastro', () => {
    cy.deleteAllUsers()
    cy.visit('/')
    cy.get('.button').click()
    cy.get('.register-link > a').click()
    cy.get('#nome').type("Monkey D. Luffy")
    cy.get('#celular').type('987654321')
    cy.get('#email').type('reidospiratas@gmail.com')
    cy.get('#confirmar_email').type('reidospiratas@gmail.com')
    cy.get('#password').type('carne')
    cy.get('#confirmar_senha').type('carne')
    cy.get('.submit').click()
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
        
    });
    cy.get('#harvestAmount').type('30')
    cy.get('#harvestFrequency').select('uma vez')
    cy.get('#addPlantButton').click()
    cy.get('#saveAndContinueButton').click()
});

describe('previsao', () => {
    it('validar', () => {
        //steps do cenario1
        cy.cadastro()
        cy.setores()
        cy.add_plantas()

        })

    it('cenario2', () => {
        //steps do cenario2
        cy.cadastro()
        cy.setores()
        cy.add_plantas()
        cy.get('.card-clickable > .card-body').click()
        cy.get('.card-clima-atual').click({ force: true });

        
        });

    })

