describe('Checkout - Finalização da Compra', () => {
  
  // Ignora erros não capturados de scripts de terceiros (Shopify, pixels, etc.)
  Cypress.on('uncaught:exception', () => false);

  beforeEach(() => {
    cy.visit('https://sauce-demo.myshopify.com/');
    cy.get('a[href*="/products/grey-jacket"]').first().click({ force: true });

    cy.get('#add').click();

    // O contador no topo deve mudar para (1)
    cy.get('#cart-target-desktop, #cart-target-mobile')
      .contains('(1)')
      .should('be.visible');
    // Visita a página do carrinho e prossegue para o checkout
    cy.visit('https://sauce-demo.myshopify.com/cart');
    
    // Clica no botão de Check Out para ir para a página de checkout
    cy.get('input[name="checkout"]').click();
    
    // Aguarda a página de checkout carregar
    cy.url({ timeout: 15000 }).should('include', '/checkouts/');
    
    // Aguarda o formulário de checkout estar visível
    cy.get('#checkout-main', { timeout: 15000 }).should('be.visible');
  });

  it('Cenário: Finalizar compra com dados válidos', () => {
    // Preenche o e-mail (campo obrigatório de contato)
    cy.get('#email').type('teste5234@teste.com');

    // Preenche os dados de entrega (Delivery)
    // Último nome (obrigatório)
    cy.get('._7ozb2ub > [name="lastName"]').type('Silva');
    
    // CEP (obrigatório)
    cy.get('._7ozb2ub > [name="postalCode"]').type('60000-000');
    
    // Rua (obrigatório)
    
    // Número do edifício (obrigatório)
    
    // Bairro (obrigatório)
    
    // Cidade (obrigatório)
    cy.get('._7ozb2ub > [name="city"]').type('Fortaleza');
    
    // Estado (select - obrigatório)

    // Aguarda o cálculo do frete
    cy.wait(3000);

    // Preenche os dados do cartão de crédito
    // Os campos de cartão estão dentro de iframes (Shopify PCI)
    // Número do cartão - usa "1" para simular transação aprovada
    cy.get('iframe[name^="card-fields-number"]')
      .its('0.contentDocument.body')
      .should('not.be.empty')
      .then(cy.wrap)
      .find('input[name="number"]')
      .type('1');

    // Data de expiração (qualquer data futura)
    cy.get('iframe[name^="card-fields-expiry"]')
      .its('0.contentDocument.body')
      .should('not.be.empty')
      .then(cy.wrap)
      .find('input[name="expiry"]')
      .type('12/30');

    // Código de segurança (qualquer 3 dígitos)
    cy.get('iframe[name^="card-fields-verification_value"]')
      .its('0.contentDocument.body')
      .should('not.be.empty')
      .then(cy.wrap)
      .find('input[name="verification_value"]')
      .type('123');

    // Nome no cartão
    cy.get('iframe[name^="card-fields-name"]')
      .its('0.contentDocument.body')
      .should('not.be.empty')
      .then(cy.wrap)
      .find('input[name="name"]')
      .type('João Silva');

    // Clica no botão "Pay now" para finalizar o pedido
    cy.get('#checkout-pay-button').click();

    // Aguarda o processamento do pagamento e a confirmação
    cy.url({ timeout: 20000 }).should('include', '/thank_you');
    
    // Verifica se a confirmação do pedido é exibida
    cy.contains('Thank you', { timeout: 15000 }).should('be.visible');
  });

  it('Cenário: Tentar finalizar compra sem preencher dados obrigatórios', () => {
    // Não preenche nenhum campo obrigatório
    // Tenta clicar diretamente no botão "Pay now"
    cy.get('#checkout-pay-button').click();

    // O sistema não deve concluir a compra
    // A URL não deve mudar para a página de confirmação
    cy.url().should('not.include', '/thank_you');

    // Verifica se as mensagens de erro são exibidas nos campos obrigatórios
    // Último nome (obrigatório)
    cy.contains('Enter a last name').should('be.visible');
    
    // CEP (obrigatório)
    cy.contains('Enter a ZIP / postal code').should('be.visible');
    
    // Rua (obrigatório)
    cy.contains('Enter a street name').should('be.visible');
    
    // Número do edifício (obrigatório)
    cy.contains('Enter a building number').should('be.visible');
    
    // Bairro (obrigatório)
    cy.contains('Enter a neighborhood').should('be.visible');
    
    // Cidade (obrigatório)
    cy.contains('Enter a city').should('be.visible');
    
    // Estado (obrigatório)
    cy.contains('Select a state / province').should('be.visible');

    // Também verifica os erros nos campos do cartão de crédito
    cy.contains('Enter a card number').should('be.visible');
    cy.contains('Enter a valid expiration date').should('be.visible');
    cy.contains('Enter the CVV or security code on your card').should('be.visible');
    cy.contains('Enter your name exactly as it’s written on your card').should('be.visible');
  });
});