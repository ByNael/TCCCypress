// cypress/e2e/login.cy.js

describe('Funcionalidade: Login de usuário', () => {

  beforeEach(() => {
    // Visita a página de login antes de cada cenário
    cy.visit('https://www.saucedemo.com/');
  });

  it('Cenário: Realizar login com credenciais válidas', () => {
    // Dado que o usuário está na página de login
    // (Garantido pelo beforeEach)

    // Quando informa um username cadastrado
    cy.get('[data-test="username"]').type('standard_user');

    // E informa a senha correspondente
    cy.get('[data-test="password"]').type('secret_sauce');

    // E realiza o login
    cy.get('[data-test="login-button"]').click();

    // Então o sistema deve autenticar o usuário
    // E deve redirecioná-lo para a página inicial
    // E deve apresentar o conteúdo da home de produtos
    cy.url().should('include', '/inventory.html');
    cy.get('.title').should('have.text', 'Products');
    // Verifica se o container de produtos está visível para garantir o carregamento
    cy.get('.inventory_list').should('be.visible');
  });

  it('Cenário: Realizar login com credenciais inválidas (senha em branco)', () => {
    // Dado que o usuário está na página de login
    // (Garantido pelo beforeEach)

    // Quando informa um username cadastrado
    cy.get('[data-test="username"]').type('standard_user');

    // E realiza o login (sem preencher a senha)
    cy.get('[data-test="login-button"]').click();

    // Então o sistema não deve autenticar o usuário
    // E deve apresentar uma mensagem de erro no input de password com o texto "Password is required"
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain.text', 'Epic sadface: Password is required');
    
    // Garante que permaneceu na página de login
    cy.url().should('not.include', '/inventory.html');
  });

});