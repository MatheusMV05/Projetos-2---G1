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

Cypress.Commands.add('cadastroSetores', () => {
    cy.visit('/cadastrar_setores/');
    cy.get('#numSetores').clear().type('2'); // Cadastra 2 setores
    cy.get('button').contains('Gerar Campos para Setores').click();
    cy.get('#canteirosSetor1').type('3'); // Canteiros no setor 1
    cy.get('#canteirosSetor2').type('2'); // Canteiros no setor 2
    cy.get('button[type="submit"]').click();

    // Verifica redirecionamento após cadastro
    cy.url().should('include', '/planta/');
});

Cypress.Commands.add('addPlanta', (planta, setor, canteiro, quantidade, frequencia) => {
    cy.get(`[data-title="${planta}"]`).click();
    cy.get('#selectCanteiro option')
        .should('contain', `${setor} - ${setor} ${canteiro}`)
        .then(($option) => {
            const value = $option.val();
            cy.get('#selectCanteiro').select(value);
        });
    cy.get('#harvestAmount').clear().type(quantidade);
    cy.get('#harvestFrequency').select(frequencia);
    cy.get('#addPlantButton').click();
});

describe('Validação de Plantas', () => {
    beforeEach(() => {
        cy.cadastro(); // Realiza cadastro de usuário
        cy.cadastroSetores(); // Cadastra setores e canteiros
    });

    it('Deve validar plantas compatíveis', () => {
        cy.addPlanta('Abóbora', 'Setor 1', 'Canteiro B', '50', 'Mensalmente');
        cy.addPlanta('Milho', 'Setor 2', 'Canteiro A', '30', 'Semanalmente');

        cy.get('#saveAndContinueButton').click();

        cy.on('window:alert', (str) => {
            expect(str).to.equal('As plantas são compatíveis');
        });
    });

    it('Deve exibir erro para plantas incompatíveis', () => {
        cy.addPlanta('Abóbora', 'Setor 1', 'Canteiro B', '50', 'Mensalmente');
        cy.addPlanta('Cenoura', 'Setor 2', 'Canteiro A', '20', 'Semanalmente');

        cy.get('#saveAndContinueButton').click();

        cy.on('window:alert', (str) => {
            expect(str).to.equal('As plantas cadastradas são incompatíveis');
        });

        cy.get('#plantListContainer')
            .should('be.visible')
            .and('contain', 'Abóbora')
            .and('contain', 'Cenoura');
    });
});

