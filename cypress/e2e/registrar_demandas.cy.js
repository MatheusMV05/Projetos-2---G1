describe('registrar demandas', () => {
    it('registrar uma nova demanda', () => {
        //steps do cenario1
        cy.visit('/');
        cy.get('.button').click()
        cy.get('.register-link > a').click()
        cy.get('#nome').type("luffy")
        cy.get('#celular').type('987654321')
        cy.get('#email').type('reidospiratas@gmail.com')
        cy.get('#confirmar_email').type('reidospiratas@gmail.com')
        cy.get('#password').type('carne')
        cy.get('#confirmar_senha').type('carne')
        cy.get('.submit').click()
        

    })

    /*it('visualizar demandas', () => {
        //steps do cenario2
    })

    it('editar demanda', () => {
        //steps do cenario3
    })
    
    it('filtrar demandas', () => {
        //steps do cenario4
    })
    
    it('excluir demanda', () => {
        //steps do cenario5
    })
    
    it('notificar demanda', () => {
        //steps do cenario6
    })*/

})