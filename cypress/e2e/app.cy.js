describe('App', () => {
  it('loads the main page', () => {
    cy.visit('/')
    cy.contains('Get started').should('be.visible')
    cy.contains('Count is 0').should('be.visible')
  })
})
