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



describe('Registro de Terreno', () => {
    
    
    
    it('Deve validar corretamente quando as plantas cadastradas são compatíveis', () => {
      
        cy.cadastro();

        cy.url().should('include', '/cadastrar_setores/');

        
        cy.visit('/cadastrar_setores/');

      
        cy.contains('Salvar').click();


        cy.on('window:alert', (str) => {
            expect(str).to.equal('Todos os campos são obrigatórios');
        });

        
        cy.contains('Gerar Campos para Setores').click();
        cy.get('#canteirosSetor1').should('not.exist');
    });

    
    it('Deve exibir erro e listar plantas incompatíveis quando há plantas inimigas', () => {
    
        cy.cadastro();

       
        cy.url().should('include', '/cadastrar_setores/');

        
        cy.visit('/cadastrar_setores/');

       
        cy.get('#numSetores').type('2');

        
        cy.contains('Gerar Campos para Setores').click();

        
        cy.get('#canteirosSetor1').type('-5'); 
        cy.get('#canteirosSetor2').type('abc'); 

        
        cy.contains('Salvar').click();

       
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Os valores de canteiros devem ser números positivos');
        });

       
        
    });
});