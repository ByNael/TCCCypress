// cypress/e2e/cart.cy.js

describe('Funcionalidade: Carrinho de Compras', () => {

  beforeEach(() => {
    // Realiza o login antes de cada cenário
    cy.visit('https://www.saucedemo.com/');
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    
    // Garante que a página de produtos carregou
    cy.url().should('include', '/inventory.html');
    cy.get('[data-test="inventory-list"]').should('be.visible');
  });

  it('Cenário 01: Adicionar produtos e checar carrinho', () => {
    // E adicionou produtos válidos no carrinho clicando no botão "Add to cart"
    // Utilizando seletores data-test específicos para evitar conflitos de XPath idênticos
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    // Valida que o contador do carrinho foi atualizado
    cy.get('[data-test="shopping-cart-link"]').should('contain.text', '2');

    // E clicar no botão de carrinho para checar os produtos adicionados
    cy.get('[data-test="shopping-cart-link"]').click();

    // Então o sistema deve apresentar a página de carrinho com os itens escolhidos listados
    cy.url().should('include', '/cart.html');
    cy.get('[data-test="cart-list"]').should('be.visible');
    
    // Verifica se os itens específicos estão listados
    cy.get('[data-test="inventory-item-name"]').should('have.length', 2);
    cy.contains('[data-test="inventory-item-name"]', 'Sauce Labs Backpack').should('be.visible');
    cy.contains('[data-test="inventory-item-name"]', 'Sauce Labs Bike Light').should('be.visible');
  });

  it('Cenário 02: Remover produtos do carrinho', () => {
    // E adicionou produtos válidos no carrinho
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    // E clicar no botão "Remove" que aparece quando um produto está adicionado no carrinho
    // O botão "Remove" tem o mesmo seletor data-test do "Add to cart", mas muda o texto
    cy.get('[data-test="remove-sauce-labs-backpack"]').click();
    cy.get('[data-test="remove-sauce-labs-bike-light"]').click();

    // Valida que o carrinho está vazio (contador zerado/oculto)
    cy.get('[data-test="shopping-cart-link"]').should('not.contain.text', '1');

    // E clica no botão de carrinho para checar os produtos
    cy.get('[data-test="shopping-cart-link"]').click();

    // Então o sistema deve apresentar a página de carrinho sem itens listados
    cy.url().should('include', '/cart.html');
    cy.get('[data-test="cart-list"]').should('be.visible');
    
    // Verifica que a lista de itens está vazia
    cy.get('[data-test="inventory-item"]').should('not.exist');
  });

});