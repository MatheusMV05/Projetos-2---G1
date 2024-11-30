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

Cypress.Commands.add('registrar_demanda', () => {
    cy.get('#nome').type('demanda')
    cy.get('#tipo').select('venda')
    cy.get('#quantidade').type('10')
    cy.get('.row > :nth-child(6)').type('100')
    cy.get('#prazo').type('3200-02-16')
    cy.get(':nth-child(2) > .card-body > .row > .d-flex > .btn').click()
});

Cypress.Commands.add('registrar_demanda2', () => {
    cy.get('#nome').type('demanda2')
    cy.get('#tipo').select('compra')
    cy.get('#quantidade').type('40')
    cy.get('.row > :nth-child(6)').type('150')
    cy.get('#prazo').type('3210-02-19')
    cy.get(':nth-child(2) > .card-body > .row > .d-flex > .btn').click()
});

Cypress.Commands.add('registrar_demanda3', () => {
    cy.get('#nome').type('demanda3')
    cy.get('#tipo').select('compra')
    cy.get('#quantidade').type('80')
    cy.get('.row > :nth-child(6)').type('150')
    cy.get('#prazo').type('1999-12-19')
    cy.get(':nth-child(2) > .card-body > .row > .d-flex > .btn').click()
});

Cypress.Commands.add('registrar_demanda4', () => {
    cy.get('#nome').type('demanda4')
    cy.get('#tipo').select('venda')
    cy.get('#quantidade').type('78')
    cy.get('.row > :nth-child(6)').type('280')
    cy.get('#prazo').type('2012-01-01')
    cy.get(':nth-child(2) > .card-body > .row > .d-flex > .btn').click()
});

// Capturar a data atual e adicionar dois dias
const dataFutura = new Date();
dataFutura.setDate(dataFutura.getDate() + 2);

// Formatar a data no padrão 'YYYY-MM-DD' (usado em campos de input do tipo date)
const ano = dataFutura.getFullYear();
const mes = String(dataFutura.getMonth() + 1).padStart(2, '0'); // Adicionar zero à esquerda
const dia = String(dataFutura.getDate()).padStart(2, '0');
const dataFormatada = `${ano}-${mes}-${dia}`;


describe('demandas', () => {
    it('registrar uma nova demanda', () => {
        //steps do cenario1
        cy.cadastro();
        cy.setores()
        cy.add_plantas()
        cy.wait(1000)
        cy.get('#menu-abrir').click()
        cy.get(':nth-child(1) > a').click()
        cy.registrar_demanda()
        cy.contains('venda').should('be.visible')
        cy.contains('10').should('be.visible')
        cy.contains('100.00').should('be.visible')
        cy.get('.btn-warning').should('be.visible').and('not.be.disabled')
        cy.get(':nth-child(2) > .btn').should('be.visible').and('not.be.disabled')
        cy.get(':nth-child(7) > :nth-child(3) > .btn').should('be.visible').and('not.be.disabled')

    })

    it('editar demanda', () => {
        //steps do cenario2
        cy.cadastro()
        cy.setores()
        cy.add_plantas()
        cy.wait(1000)
        cy.get('#menu-abrir').click()
        cy.get(':nth-child(1) > a').click()
        cy.registrar_demanda()
        cy.get('.btn-warning').click()
        cy.get('#preco').clear().type('300')
        cy.get(':nth-child(2) > .card-body > .row > .d-flex > .btn').click()
        cy.get('tbody > tr > :nth-child(4)').should('have.text', '300.00')

    })
    
    it('filtrar demandas', () => {
        //steps do cenario3
        cy.cadastro()
        cy.setores()
        cy.add_plantas()
        cy.wait(1000)
        cy.get('#menu-abrir').click()
        cy.get(':nth-child(1) > a').click()
        cy.registrar_demanda()
        cy.registrar_demanda2()
        cy.registrar_demanda3()
        cy.registrar_demanda4()
        cy.get('#tipo_filtro').select('compra')
        cy.get(':nth-child(3) > .card-body > .row > .col-md-2 > .btn').click()
        cy.get('tbody > :nth-child(1) > :nth-child(2)').should('have.text', 'compra')
        cy.get('tbody > :nth-child(2) > :nth-child(2)').should('have.text', 'compra')

    })
    
    it('excluir demanda', () => {
        //steps do cenario4
        cy.cadastro()
        cy.setores()
        cy.add_plantas()
        cy.wait(1000)
        cy.get('#menu-abrir').click()
        cy.get(':nth-child(1) > a').click()
        cy.registrar_demanda()
        cy.get(':nth-child(1) > :nth-child(7) > :nth-child(3) > .btn').click()
        cy.get('.alert').contains('Demanda comercial excluída com sucesso.');

    })
    

})