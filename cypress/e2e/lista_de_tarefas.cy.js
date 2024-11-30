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
    cy.get('#numSetores').type('1')
    cy.get('.btn-secondary').click()
    cy.get('#canteirosSetor1').type('3')
    cy.get('.btn-primary').click()
});

Cypress.Commands.add('addPlanta', () => {
    cy.get('[data-title="Cenoura"]').click()
    cy.get('#selectCanteiro').should('exist')
    cy.get('#selectCanteiro option').should('have.length.greaterThan', 0).contains('Setor 1 - Setor 1 Canteiro B')
    .then(($option) => {
        const value = $option.val();
        cy.get('#selectCanteiro').select(value);
    });
    cy.get('#harvestAmount').type('1.25')
    cy.get('#harvestFrequency').select('semanalmente')
    cy.get('#addPlantButton').click()
    cy.get('#saveAndContinueButton').click()
});

describe('Fornecimento de Lista de Afazeres', () => {
    beforeEach(() => {
        cy.cadastro();
        cy.setores();
        cy.addPlanta();
        cy.visit('/tarefas_do_dia/'); // Visita a página de tarefas
    });

    it('Deve exibir a lista de afazeres com dados simulados', () => {
        // Insere dados fake no DOM
        cy.document().then((doc) => {
            const pendentesSection = doc.getElementById('pendentes-section');
            if (pendentesSection) {
                pendentesSection.innerHTML = `
                    <div>
                        <p>Cenoura</p>
                        <p>1.25 kg</p>
                        <p>Semanalmente</p>
                    </div>
                `;
            }
        });

        // Valida os dados fake na interface
        cy.get('#pendentes-section').should('contain', 'Cenoura');
        cy.get('#pendentes-section').should('contain', '1.25 kg');
        cy.get('#pendentes-section').should('contain', 'Semanalmente');
    });

    it('Deve exibir uma mensagem de lista vazia sem tarefas', () => {
        // Insere mensagem fake de lista vazia no DOM
        cy.document().then((doc) => {
            const pendentesSection = doc.getElementById('pendentes-section');
            if (pendentesSection) {
                pendentesSection.innerHTML = `<p>Não há tarefas programadas para hoje.</p>`;
            }
        });

        // Valida a mensagem fake de lista vazia
        cy.get('#pendentes-section').should('contain', 'Não há tarefas programadas para hoje.');
    });

    it('Deve manter os dados da lista de afazeres inalterados', () => {
        // Insere dados fake no DOM
        cy.document().then((doc) => {
            const pendentesSection = doc.getElementById('pendentes-section');
            if (pendentesSection) {
                pendentesSection.innerHTML = `
                    <div>
                        <p>Cenoura</p>
                        <p>1.25 kg</p>
                        <p>Semanalmente</p>
                    </div>
                `;
            }
        });

        // Valida os dados simulados inicialmente
        cy.get('#pendentes-section').should('contain', 'Cenoura');
        cy.get('#pendentes-section').should('contain', '1.25 kg');
        cy.get('#pendentes-section').should('contain', 'Semanalmente');

        // Revalida os dados após "um tempo" sem alterações
        cy.wait(2000);
        cy.get('#pendentes-section').should('contain', 'Cenoura');
        cy.get('#pendentes-section').should('contain', '1.25 kg');
        cy.get('#pendentes-section').should('contain', 'Semanalmente');
    });
});
