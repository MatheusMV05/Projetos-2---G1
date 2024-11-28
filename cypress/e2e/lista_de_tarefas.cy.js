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

Cypress.Commands.add('addPlanta', (planta, canteiro, quantidade, frequencia) => {
    cy.get('.card-container').contains(planta).click(); // Clica no card da planta
    cy.get('#selectCanteiro').select(canteiro); // Seleciona o canteiro
    cy.get('#harvestAmount').type(quantidade); // Define a quantidade
    cy.get('#harvestFrequency').select(frequencia); // Define a frequência
    cy.get('#addPlantButton').click(); // Adiciona a planta
});

describe('Fornecimento de Lista de Afazeres', () => {
    beforeEach(() => {
        // Garante ambiente limpo para cada teste
        cy.deleteAllUsers();
    });

    // Cenário 1: Exibição da lista de afazeres com base no cadastro de plantas
    it('Deve exibir a lista de afazeres com base no cadastro de plantas', () => {
        // Cadastro e adição de planta
        cy.cadastro();
        cy.addPlanta('Cenoura', 'Canteiro 1', '1.25', 'Semanalmente');
        cy.get('#saveAndContinueButton').click();

        // Acessa a seção "Meu Plantio"
        cy.visit('/meu_plantio/');

        // Valida a exibição da tarefa na lista de afazeres
        cy.get('#pendentes-section').should('contain', 'Cenoura');
        cy.get('#pendentes-section').should('contain', '1.25 kg');
        cy.get('#pendentes-section').should('contain', 'Semanalmente');
    });

    // Cenário 2: Atualização da lista de afazeres após mudança no cadastro
    it('Deve atualizar a lista de afazeres após mudança no cadastro', () => {
        // Cadastro e adição de planta inicial
        cy.cadastro();
        cy.addPlanta('Cenoura', 'Canteiro 1', '1.25', 'Semanalmente');
        cy.get('#saveAndContinueButton').click();

        // Altera a planta cadastrada
        cy.visit('/cadastrar_plantas/');
        cy.get('.card-container').contains('Cenoura').click();
        cy.get('#harvestAmount').clear().type('2.5'); // Atualiza a quantidade
        cy.get('#harvestFrequency').select('Mensalmente'); // Atualiza a frequência
        cy.get('#addPlantButton').click();
        cy.get('#saveAndContinueButton').click();

        // Acessa a seção "Meu Plantio"
        cy.visit('/meu_plantio/');

        // Valida a exibição atualizada da lista de afazeres
        cy.get('#pendentes-section').should('contain', 'Cenoura');
        cy.get('#pendentes-section').should('contain', '2.5 kg');
        cy.get('#pendentes-section').should('contain', 'Mensalmente');
    });

    // Cenário 3: Lista de afazeres vazia por falta de cadastro
    it('Deve exibir mensagem de lista vazia sem plantas cadastradas', () => {
        // Realiza cadastro sem adicionar plantas
        cy.cadastro();

        // Acessa a seção "Meu Plantio"
        cy.visit('/meu_plantio/');

        // Valida que a lista está vazia
        cy.get('#pendentes-section').should('contain', 'Não há tarefas programadas para hoje.');
    });

    // Cenário 4: Manutenção da lista de afazeres sem alterações no cadastro
    it('Deve manter a lista de afazeres inalterada sem mudanças no cadastro', () => {
        // Cadastro e adição de planta
        cy.cadastro('reidospiratas4@gmail.com');
        cy.addPlanta('Cenoura', 'Canteiro 1', '1.25', 'Semanalmente');
        cy.get('#saveAndContinueButton').click();

        // Acessa a seção "Meu Plantio" pela primeira vez
        cy.visit('/meu_plantio/');
        cy.get('#pendentes-section').should('contain', 'Cenoura');
        cy.get('#pendentes-section').should('contain', '1.25 kg');
        cy.get('#pendentes-section').should('contain', 'Semanalmente');

        // Acessa novamente depois de um tempo (simulado)
        cy.wait(2000);
        cy.visit('/meu_plantio/');

        // Valida que a lista permanece inalterada
        cy.get('#pendentes-section').should('contain', 'Cenoura');
        cy.get('#pendentes-section').should('contain', '1.25 kg');
        cy.get('#pendentes-section').should('contain', 'Semanalmente');
    });
});
