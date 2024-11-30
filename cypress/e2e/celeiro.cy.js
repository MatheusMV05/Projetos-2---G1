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
        cy.get('#harvestAmount').type('30')
        cy.get('#harvestFrequency').select('uma vez')
        cy.get('#addPlantButton').click()
        cy.get('#saveAndContinueButton').click()

    });
});

describe('Meu Celeiro - Testes de Registro Manual', () => {
    beforeEach(() => {
        cy.cadastro(); // Cadastra o usuário antes de cada teste
        cy.setores(); // Configura os setores
        cy.add_plantas(); // Adiciona as plantas iniciais
        cy.visit('celeiro/'); // Visita a página "Meu Celeiro"
    });

    it('Cenário 1 - Registro bem-sucedido de colheita', () => {
        cy.get('#peso-Abobora').type('10'); // Adiciona quantidade colhida
        cy.get('[onclick="adicionarColheita(\'Abobora\')"]').click(); // Clica em adicionar
        cy.get('.spinner-border').should('not.exist'); // Verifica que o spinner sumiu
        cy.get('.list-group-item').contains('10 / 50 kg'); // Verifica atualização da colheita
    });

    it('Cenário 2 - Falha ao deixar o campo vazio', () => {
        cy.get('[onclick="adicionarColheita(\'Abobora\')"]').click(); // Clica em adicionar sem preencher
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Insira uma quantidade válida.'); // Verifica mensagem de alerta
        });
    });

    it('Cenário 3 - Falha ao exceder o total', () => {
        cy.get('#peso-Abobora').type('60'); // Tenta adicionar mais do que o permitido
        cy.get('[onclick="adicionarColheita(\'Abobora\')"]').click(); // Clica em adicionar
        cy.on('window:alert', (str) => {
            expect(str).to.equal('A quantidade colhida não pode exceder o total cadastrado.'); // Verifica alerta
        });
    });

    it('Cenário 4 - Resetar colheitas', () => {
        cy.get('#peso-Abobora').type('10'); // Adiciona uma colheita
        cy.get('[onclick="adicionarColheita(\'Abobora\')"]').click(); // Clica em adicionar
        cy.get('[onclick="resetColheita()"]').click(); // Clica em resetar colheitas
        cy.on('window:confirm', (str) => {
            expect(str).to.equal('Tem certeza de que deseja resetar todas as colheitas?'); // Confirma o reset
            return true; // Confirma a ação
        });
        cy.get('.list-group-item').contains('0 / 50 kg'); // Verifica que as colheitas foram resetadas
    });

    it('Cenário 5 - Exclusão de colheita', () => {
        cy.get('#peso-Abobora').type('20'); // Adiciona uma colheita
        cy.get('[onclick="adicionarColheita(\'Abobora\')"]').click(); // Clica em adicionar
        cy.get('[onclick="deletarColheita(\'Abobora\')"]').click(); // Clica em excluir
        cy.on('window:confirm', (str) => {
            expect(str).to.equal('Tem certeza de que deseja excluir esta colheita?'); // Confirma exclusão
            return true; // Confirma a ação
        });
        cy.get('.list-group-item').contains('0 / 50 kg'); // Verifica que a colheita foi excluída
    });
});
