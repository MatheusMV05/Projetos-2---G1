describe('Registro de Terreno', () => {
    
    // Cenário 1: Registro bem-sucedido do terreno
    it('Deve registrar corretamente quando todos os campos são preenchidos', () => {
        // Acessa a página de registro
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
        cy.url().should('include', '/cadastrar_setores/');

        // Acessa a página de cadastro de setores
        cy.visit('/cadastrar_setores/');

        // Preenche o número de setores
        cy.get('#numSetores').type('2');

        // Gera os campos para setores
        cy.contains('Gerar Campos para Setores').click();

        // Preenche os campos de canteiros
        cy.get('#canteirosSetor1').type('10');
        cy.get('#canteirosSetor2').type('15');

        // Clica no botão de salvar
        cy.contains('Salvar').click();

        // Valida o redirecionamento para a próxima etapa
        cy.url().should('include', '/proxima_etapa');
    });

    // Cenário 2: Falha no registro por campo não preenchido
    it('Deve exibir erro ao não preencher todos os campos obrigatórios', () => {
         // Acessa a página de registro
         cy.visit('/');
         cy.get('.button').click();
         cy.get('.register-link > a').click();
 
         // Preenche os campos de registro do usuário
         cy.get('#nome').type('Luffy');
         cy.get('#celular').type('987654321');
         cy.get('#email').type('reidospiratas2@gmail.com');
         cy.get('#confirmar_email').type('reidospiratas2@gmail.com');
         cy.get('#password').type('carne');
         cy.get('#confirmar_senha').type('carne');
         cy.get('.submit').click();
 
         // Valida o redirecionamento após registro
         cy.url().should('include', '/cadastrar_setores/');

        // Acessa a página de cadastro de setores
        cy.visit('/cadastrar_setores/');

        // Não preenche o campo de número de setores e tenta salvar
        cy.contains('Salvar').click();

        // Valida a mensagem de erro
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Todos os campos são obrigatórios');
        });

        // Gera campos para setores sem preencher o número de setores
        cy.contains('Gerar Campos para Setores').click();
        cy.get('#canteirosSetor1').should('not.exist');
    });

    // Cenário 3: Validação de formato incorreto no número de canteiros
    it('Deve exibir erro ao inserir valores inválidos nos canteiros', () => {
         // Acessa a página de registro
         cy.visit('/');
         cy.get('.button').click();
         cy.get('.register-link > a').click();
 
         // Preenche os campos de registro do usuário
         cy.get('#nome').type('Luffy');
         cy.get('#celular').type('987654321');
         cy.get('#email').type('reidospiratas3@gmail.com');
         cy.get('#confirmar_email').type('reidospiratas3@gmail.com');
         cy.get('#password').type('carne');
         cy.get('#confirmar_senha').type('carne');
         cy.get('.submit').click();
 
         // Valida o redirecionamento após registro
         cy.url().should('include', '/cadastrar_setores/');

        // Acessa a página de cadastro de setores
        cy.visit('/cadastrar_setores/');

        // Preenche o número de setores
        cy.get('#numSetores').type('2');

        // Gera os campos para setores
        cy.contains('Gerar Campos para Setores').click();

        // Preenche os campos de canteiros com valores inválidos
        cy.get('#canteirosSetor1').type('-5'); // Valor negativo
        cy.get('#canteirosSetor2').type('abc'); // Texto inválido

        // Clica no botão de salvar
        cy.contains('Salvar').click();

        // Valida a mensagem de erro
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Os valores de canteiros devem ser números positivos');
        });

        // Verifica se o redirecionamento não ocorreu
        cy.url().should('not.include', '/proxima_etapa');
    });
});
