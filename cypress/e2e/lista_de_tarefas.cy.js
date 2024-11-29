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

describe('História da Lista de Tarefas', () => {
    
    // Cenário 1: Registro bem-sucedido da lista de tarefas
    it('Deve registrar corretamente a lista de tarefas quando todos os campos são preenchidos', () => {
        // Realiza cadastro de usuário
        cy.cadastro();

        // Valida o redirecionamento após registro

        // Acessa a página de criação da lista de tarefas
        cy.visit('/cadastrar_setores/');

        // Preenche o número de tarefas
        cy.get('#numSetores').type('2');

        // Gera os campos para a lista de tarefas
        cy.contains('Gerar Campos para Setores').click();

        // Preenche os campos de descrição das tarefas
        cy.get('#canteirosSetor1').type('10');
        cy.get('#canteirosSetor2').type('15');

        // Clica no botão de salvar
        cy.contains('Salvar').click();

        // Valida o redirecionamento para a próxima etapa
    });

    // Cenário 2: Falha no registro por campo não preenchido
    it('Deve exibir erro ao não preencher todos os campos obrigatórios para a lista de tarefas', () => {
        // Realiza cadastro de usuário
        cy.cadastro();

        // Valida o redirecionamento após registro
     

        // Acessa a página de criação da lista de tarefas
        cy.visit('/cadastrar_setores/');

        // Não preenche o campo de número de tarefas e tenta salvar
        cy.contains('Salvar').click();

        // Valida a mensagem de erro
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Todos os campos são obrigatórios');
        });

        // Gera campos para tarefas sem preencher o número de tarefas
        cy.contains('Gerar Campos para Setores').click();
        cy.get('#canteirosSetor1').should('not.exist');
    });

    // Cenário 3: Validação de formato incorreto na descrição das tarefas
    it('Deve exibir erro ao inserir valores inválidos nos detalhes das tarefas', () => {
        // Realiza cadastro de usuário
        cy.cadastro();

        // Valida o redirecionamento após registro

        // Acessa a página de criação da lista de tarefas
        cy.visit('/cadastrar_setores/');

        // Preenche o número de tarefas
        cy.get('#numSetores').type('2');

        // Gera os campos para a lista de tarefas
        cy.contains('Gerar Campos para Setores').click();

        // Preenche os campos de descrição das tarefas com valores inválidos
        cy.get('#canteirosSetor1').type('-5'); // Valor negativo
        cy.get('#canteirosSetor2').type('abc'); // Texto inválido

        // Clica no botão de salvar
        cy.contains('Salvar').click();

        // Valida a mensagem de erro
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Os valores das tarefas devem ser positivos e válidos');
        });

        // Verifica se o redirecionamento não ocorreu
    });
});
