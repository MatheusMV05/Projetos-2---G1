describe('Validação de Plantas - Cenário 1', () => {
    it('Deve validar corretamente quando as plantas cadastradas são compatíveis', () => {
        cy.visit('/');
        cy.get('.button').click();
        cy.get('.register-link > a').click();

        // Preenche os campos de registro do usuário
        cy.get('#nome').type('Luffy');
        cy.get('#celular').type('987654321');
        cy.get('#email').type('reidospiratas1@gmail.com');
        cy.get('#confirmar_email').type('reidospiratas1@gmail.com');
        cy.get('#password').type('carne');
        cy.get('#confirmar_senha').type('carne');
        cy.get('.submit').click();

        // Valida o redirecionamento após registro
        cy.url().should('include', '/cadastrar_plantas/');
       
        // Acessar a página de cadastro de plantas
        cy.visit('/cadastrar_plantas/');

        // Adicionar a primeira planta
        cy.get('.card-container').contains('Abóbora').click(); // Simula clicar no card da planta
        cy.get('#selectCanteiro').select('Canteiro 1'); // Seleciona o canteiro
        cy.get('#harvestAmount').type('50'); // Define a quantidade em kg
        cy.get('#harvestFrequency').select('Mensalmente'); // Define a frequência
        cy.get('#addPlantButton').click(); // Adiciona a planta

        // Adicionar a segunda planta
        cy.get('.card-container').contains('Milho').click();
        cy.get('#selectCanteiro').select('Canteiro 2');
        cy.get('#harvestAmount').type('30');
        cy.get('#harvestFrequency').select('Semanalmente');
        cy.get('#addPlantButton').click();

        // Salvar o cadastro
        cy.get('#saveAndContinueButton').click();

        // Valida a mensagem de sucesso
        cy.on('window:alert', (str) => {
            expect(str).to.equal('As plantas são compatíveis');
        });

        // Verifica se redireciona para a próxima etapa
        cy.url().should('include', '/proxima_etapa');
    });


    it('Deve exibir erro e listar plantas incompatíveis quando há plantas inimigas', () => {
        cy.visit('/');
        cy.get('.button').click();
        cy.get('.register-link > a').click();

        // Preenche os campos de registro do usuário
        cy.get('#nome').type('Luffy');
        cy.get('#celular').type('987654321');
        cy.get('#email').type('reidospiratas1@gmail.com');
        cy.get('#confirmar_email').type('reidospiratas1@gmail.com');
        cy.get('#password').type('carne');
        cy.get('#confirmar_senha').type('carne');
        cy.get('.submit').click();

        // Valida o redirecionamento após registro
        cy.url().should('include', '/cadastrar_plantas/');
        
        // Acessar a página de cadastro de plantas
        cy.visit('/cadastrar_plantas/');

        // Adicionar a primeira planta
        cy.get('.card-container').contains('Abóbora').click();
        cy.get('#selectCanteiro').select('Canteiro 1');
        cy.get('#harvestAmount').type('50');
        cy.get('#harvestFrequency').select('Mensalmente');
        cy.get('#addPlantButton').click();

        // Adicionar uma planta inimiga
        cy.get('.card-container').contains('Cenoura').click();
        cy.get('#selectCanteiro').select('Canteiro 2');
        cy.get('#harvestAmount').type('20');
        cy.get('#harvestFrequency').select('Semanalmente');
        cy.get('#addPlantButton').click();

        // Salvar o cadastro
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
