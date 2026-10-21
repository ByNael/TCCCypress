describe('Login de usuário - Swag Labs', () => {
  const usuarioValido = {
    username: 'standard_user',
    password: 'secret_sauce',
  };

  const usuarioSenhaInvalida = {
    username: 'standard_user',
    password: 'senha_invalida',
  };

  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/');
    cy.get('[data-test="login-container"]').should('be.visible');
    cy.get('form[aria-label="Login"]').should('be.visible');
  });

  it('Realizar login com credenciais válidas', () => {
    cy.get('[data-test="username"]')
      .should('be.visible')
      .type(usuarioValido.username);

    cy.get('[data-test="password"]')
      .should('be.visible')
      .type(usuarioValido.password);

    cy.get('[data-test="login-button"]')
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    cy.url().should('include', '/inventory.html');

    cy.get('[data-test="inventory-container"]')
      .should('be.visible');

    cy.get('[data-test="inventory-list"]')
      .should('be.visible')
      .find('[data-test="inventory-item"]')
      .should('have.length.greaterThan', 0);
  });

  it('Realizar login com credenciais inválidas', () => {
    cy.get('[data-test="username"]')
      .should('be.visible')
      .type(usuarioSenhaInvalida.username);

    cy.get('[data-test="login-button"]')
      .should('be.visible')
      .click();

    cy.get('[data-test="password"]')
      .should('be.visible');

    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain.text', 'Password is required');

    cy.url().should('not.include', '/inventory.html');
  });
});