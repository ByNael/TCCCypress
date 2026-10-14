describe('Gerenciamento do Carrinho - Sauce Demo', () => {
  
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  const produto = {
    nome: 'Grey jacket',
    nomeCompletoCarrinho: 'Grey jacket - Grey jacket',
    preco: '£55.00',
    idVariante: '611945025',
    idProduto: 'grey-jacket'
  };

  beforeEach(() => {
    cy.visit('https://sauce-demo.myshopify.com/');
  });

  it('Cenário: Adicionar produto disponível ao carrinho', () => {
    cy.get('a[href*="/products/grey-jacket"]').first().click({ force: true });

    cy.get('#add').click();

    // O contador no topo deve mudar para (1)
    cy.get('#cart-target-desktop, #cart-target-mobile')
      .contains('(1)')
      .should('be.visible');
  });

  it('Cenário: Visualizar produto adicionado ao carrinho', () => {
    // Pré-condição: Adicionar produto
    cy.get('a[href*="/products/grey-jacket"]').first().click({ force: true });
    cy.get('#add').click();

    cy.wait(5000)
    // Fecha o drawer se estiver aberto (para não interferir)
    cy.get('body').then(($body) => {
      if ($body.find('#drawer').length && $body.find('#drawer').is(':visible')) {
        // Clica fora ou no toggle para fechar, se necessário
        cy.get('.toggle-drawer').click({ force: true });
      }
    });

    // Acessa a página completa do carrinho via link "My Cart" do header
    // O link correto está no header com a classe .cart-target ou o href="/cart"
    cy.get('a.cart-target[href="/cart"]')
      .first()
      .click({ force: true });

    // Valida que chegou na página do carrinho
    cy.url({ timeout: 10000 }).should('include', '/cart');
    cy.get('#cart').should('be.visible');
    
    // Valida o produto
    cy.get('#cart .row').contains(produto.nomeCompletoCarrinho).should('be.visible');

    // Valida a quantidade
    cy.get(`input[name="updates[]"][id="updates_${produto.idVariante}"]`)
      .should('be.visible')
      .and('have.value', '1');

    // Valida o preço
    cy.get('#cart .row').contains(produto.preco).should('be.visible');
    
    // Valida o total
    cy.get('.cart.total').contains(`Total ${produto.preco}`).should('be.visible');
  });

  it('Cenário: Remover produto do carrinho', () => {
    // Pré-condição: Adicionar produto
    cy.get('a[href*="/products/grey-jacket"]').first().click({ force: true });
    cy.get('#add').click();
    
    cy.wait(5000)
    // Acessa a página do carrinho
    cy.get('a.cart-target[href="/cart"]')
      .first()
      .click({ force: true });
    
    cy.url({ timeout: 10000 }).should('include', '/cart');

    // Remove o produto
    cy.get('#cart .row')
      .find(`a[href*="quantity=0"]`)
      .first()
      .click({ force: true });

    // Valida que o produto foi removido
    cy.get('#cart').should('not.contain', produto.nomeCompletoCarrinho);
    
    // Valida mensagem de carrinho vazio
    cy.contains('It appears that your cart is currently empty!').should('be.visible');
  });
});