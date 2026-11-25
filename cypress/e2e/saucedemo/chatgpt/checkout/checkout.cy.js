describe('Checkout - Swag Labs', () => {
  const usuario = {
    username: 'standard_user',
    password: 'secret_sauce',
  };

  const cliente = {
    primeiroNome: 'João',
    sobrenome: 'Silva',
    codigoPostal: '12345-678',
  };

  const produto = 'Sauce Labs Backpack';

  const fazerLogin = () => {
    cy.visit('https://www.saucedemo.com/');

    cy.get('[data-test="username"]')
      .should('be.visible')
      .type(usuario.username);

    cy.get('[data-test="password"]')
      .should('be.visible')
      .type(usuario.password);

    cy.get('[data-test="login-button"]').click();

    cy.url().should('include', '/inventory.html');
    cy.get('[data-test="inventory-container"]').should('be.visible');
  };

  const adicionarProdutoEAbrirCheckout = () => {
    cy.contains('[data-test="inventory-item"]', produto)
      .should('be.visible')
      .within(() => {
        cy.get('button[data-test^="add-to-cart-"]')
          .should('be.visible')
          .click();
      });

    cy.get('[data-test="shopping-cart-link"]').click();

    cy.url().should('include', '/cart.html');
    cy.get('[data-test="cart-list"]').should('be.visible');

    cy.contains('[data-test="inventory-item-name"]', produto)
      .should('be.visible');

    cy.get('[data-test="checkout"]').click();

    cy.url().should('include', '/checkout-step-one.html');
    cy.get('[data-test="checkout-info-container"]').should('be.visible');
  };

  beforeEach(() => {
    fazerLogin();
  });

  it('Cenário 01: realizar checkout com sucesso', () => {
    adicionarProdutoEAbrirCheckout();

    cy.get('[data-test="firstName"]')
      .should('be.visible')
      .type(cliente.primeiroNome);

    cy.get('[data-test="lastName"]')
      .should('be.visible')
      .type(cliente.sobrenome);

    cy.get('[data-test="postalCode"]')
      .should('be.visible')
      .type(cliente.codigoPostal);

    cy.get('[data-test="continue"]').click();

    cy.url().should('include', '/checkout-step-two.html');

    cy.get('[data-test="title"]')
      .should('be.visible')
      .and('contain.text', 'Checkout: Overview');

    cy.get('[data-test="cart-list"]').should('be.visible');

    cy.contains('[data-test="inventory-item-name"]', produto)
      .should('be.visible');

    cy.get('[data-test="subtotal-label"]')
      .should('be.visible')
      .and('contain.text', 'Item total:');

    cy.get('[data-test="tax-label"]').should('be.visible');
    cy.get('[data-test="total-label"]').should('be.visible');

    cy.get('[data-test="total-label"]').should(($total) => {
      expect($total.text()).to.match(/Total:\s*\$\d+\.\d{2}/);
    });

    cy.get('[data-test="finish"]')
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    cy.url().should('include', '/checkout-complete.html');

    cy.get('[data-test="title"]')
      .should('be.visible')
      .and('contain.text', 'Checkout: Complete!');

    cy.contains('h2', 'Thank you for your order!')
      .should('be.visible');

    cy.get('[data-test="complete-header"]')
      .should('be.visible')
      .and('contain.text', 'Thank you for your order!');

    cy.get('[data-test="shopping-cart-badge"]').should('not.exist');
  });

  it('Cenário 02: validar campo obrigatório de código postal', () => {
    adicionarProdutoEAbrirCheckout();

    cy.get('[data-test="firstName"]')
      .should('be.visible')
      .type('Maria');

    cy.get('[data-test="lastName"]')
      .should('be.visible')
      .type('Souza');

    cy.get('[data-test="postalCode"]')
      .should('be.visible')
      .and('have.value', '');

    cy.get('[data-test="continue"]').click();

    cy.url().should('include', '/checkout-step-one.html');

    cy.get('[data-test="checkout-info-container"]')
      .should('be.visible');

    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain.text', 'Postal Code is required');

    cy.get('[data-test="postalCode"]')
      .should('be.visible')
      .and('have.value', '');
  });
});