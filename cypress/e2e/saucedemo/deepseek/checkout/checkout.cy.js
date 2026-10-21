// cypress/e2e/checkout.cy.js

describe('Funcionalidade: Checkout', () => {

  beforeEach(() => {
    // Realiza o login
    cy.visit('https://www.saucedemo.com/');
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();

    // Garante que está na página de produtos e adiciona um produto
    cy.url().should('include', '/inventory.html');
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // Valida que o item foi adicionado ao carrinho
    cy.get('[data-test="shopping-cart-badge"]').should('have.text', '1');
  });

  it('Cenário 01: realizar checkout com sucesso', () => {
    // Quando eu clico no ícone do carrinho no canto superior direito
    cy.get('[data-test="shopping-cart-link"]').click();

    // E clico no botão Checkout
    cy.url().should('include', '/cart.html');
    cy.get('[data-test="checkout"]').click();

    // E preencho o campo "First Name" com "João"
    cy.get('[data-test="firstName"]').type('João');

    // E preencho o campo "Last Name" com "Silva"
    cy.get('[data-test="lastName"]').type('Silva');

    // E preencho o campo "Zip/Postal Code" com "12345-678"
    cy.get('[data-test="postalCode"]').type('12345-678');

    // E clico no botão "Continue"
    cy.get('[data-test="continue"]').click();

    // Então devo ser direcionado para a página "Checkout: Overview"
    cy.url().should('include', '/checkout-step-two.html');
    cy.get('[data-test="title"]').should('have.text', 'Checkout: Overview');

    // E devo visualizar o valor total da compra
    cy.get('[data-test="total-label"]').should('be.visible').and('contain.text', 'Total:');

    // Quando eu clico no botão "Finish"
    cy.get('[data-test="finish"]').click();

    // Então devo ser direcionado para a página "Checkout: Complete!"
    cy.url().should('include', '/checkout-complete.html');
    cy.get('[data-test="title"]').should('have.text', 'Checkout: Complete!');

    // E devo visualizar a mensagem "Thank you for your order!"
    cy.get('.complete-header').should('have.text', 'Thank you for your order!');

    // E o ícone do carrinho deve estar vazio (sem o contador numérico)
    // O contador é o span com data-test="shopping-cart-badge", que deve não existir
    cy.get('[data-test="shopping-cart-badge"]').should('not.exist');
  });

  it('Cenário 02: validação de campo obrigatório no formulário de checkout', () => {
    // E cliquei no ícone do carrinho e no botão "Checkout"
    cy.get('[data-test="shopping-cart-link"]').click();
    cy.get('[data-test="checkout"]').click();

    // Quando eu preencho o campo "First Name" com "Maria"
    cy.get('[data-test="firstName"]').type('Maria');

    // E preencho o campo "Last Name" com "Souza"
    cy.get('[data-test="lastName"]').type('Souza');

    // E deixo o campo "Zip/Postal Code" em branco
    // (Não é necessário ação, apenas não preencher)

    // E clico no botão "Continue"
    cy.get('[data-test="continue"]').click();

    // Então devo permanecer na página "Checkout: Your Information"
    cy.url().should('include', '/checkout-step-one.html');
    cy.get('[data-test="title"]').should('have.text', 'Checkout: Your Information');

    // E devo visualizar uma mensagem de erro informando que o código postal é obrigatório
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain.text', 'Error: Postal Code is required');

    // E o formulário não deve ser enviado para a próxima etapa
    // A URL já foi validada para garantir que não avançou
  });

});