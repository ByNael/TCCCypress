describe('Login de usuário - BugBank', () => {
  const email = `teste.${Date.now()}@email.com`;
  const nome = 'Usuário Teste';
  const senha = 'Senha@123';
  const senhaInvalida = 'senhaInvalida123'

  const formularioLogin = () => cy.get('.card__login form');

  beforeEach(() => {
    cy.visit('https://bugbank.netlify.app/');

    formularioLogin()
      .should('be.visible')
      .within(() => {
        cy.get('input[name="email"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
        cy.contains('button', 'Acessar').should('be.visible');
      });
  });

  it('Realizar login com credenciais válidas', () => {
    cy.contains('button', 'Registrar')
      .should('be.visible')
      .click();

    cy.get('form')
      .filter(':has(input[name="passwordConfirmation"])')
      .within(() => {
        cy.get('input[name="email"]').eq(0).type(email);
        cy.get('input[name="name"]').type(nome);
        cy.get('input[name="password"]').eq(0).type(senha);
        cy.get('input[name="passwordConfirmation"]').type(senha);

        cy.contains('button', 'Cadastrar')
          .should('be.visible')
          .click();
      });

    cy.get('#btnCloseModal').click()
    formularioLogin().within(() => {
      cy.get('input[name="email"]').eq(0).clear().type(email);
      cy.get('input[name="password"]').eq(0).clear().type(senha);
      cy.contains('button', 'Acessar').click();
    });

    cy.get('#textName', { timeout: 15000 })
      .should('be.visible')
      .and('contain.text', 'Olá');

    cy.contains('bem vindo ao BugBank :)', { timeout: 15000 })
      .should('be.visible');

    cy.get('#textAccountNumber')
      .should('be.visible')
      .and('contain.text', 'Conta digital:');

    cy.get('#btnExit').should('be.visible');
  });

  it('Realizar login com senha inválida', () => {
    formularioLogin().within(() => {
      cy.get('input[name="email"]').eq(0).clear().type(email);
      cy.get('input[name="password"]').eq(0).clear().type(senhaInvalida);
      cy.contains('button', 'Acessar').click();
    });

    cy.contains(
      'Usuário ou senha inválido. Tente novamente ou verifique suas informações!',
      { timeout: 10000 }
    ).should('be.visible');

    cy.get('#textName').should('not.exist');
  });
});