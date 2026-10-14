describe('Cadastro de usuário - BugBank', () => {
  const email = `teste.${Date.now()}@email.com`;
  const nome = 'Usuário Teste';
  const senha = 'Senha@123';

  beforeEach(() => {
    cy.visit('https://bugbank.netlify.app/');

    cy.contains('button', 'Registrar')
      .should('be.visible')
      .click();

    cy.get('form')
      .filter(':has(button[type="submit"])').eq(1)
      .should('be.visible')
      .within(() => {
        cy.contains('a', 'Voltar ao login').should('be.visible');
        cy.get('input[name="email"]').eq(0).should('be.visible');
        cy.get('input[name="name"]').should('be.visible');
        cy.get('input[name="password"]').eq(0).should('be.visible');
        cy.get('input[name="passwordConfirmation"]').should('be.visible');
      });
  });

  it('Cadastrar novo usuário com dados válidos', () => {
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

    cy.get('#modalText', { timeout: 10000 })
      .should('be.visible')
      .invoke('text')
      .should('match', /^A conta \d+-\d+ foi criada com sucesso$/);

    cy.get('#btnCloseModal')
      .should('be.visible')
      .and('contain.text', 'Fechar');
  });

  it('Tentar cadastrar usuário com senhas diferentes', () => {
    const emailDiferente = `teste.${Date.now()}.invalido@email.com`;

    cy.get('form')
      .filter(':has(input[name="passwordConfirmation"])')
      .within(() => {
        cy.get('input[name="email"]').type(emailDiferente);
        cy.get('input[name="name"]').type(nome);
        cy.get('input[name="password"]').type(senha);
        cy.get('input[name="passwordConfirmation"]').type('Senha@456');

        cy.contains('button', 'Cadastrar')
          .should('be.visible')
          .click();
      });

    cy.contains('As senhas não são iguais', { timeout: 10000 })
      .should('be.visible');
  });
});