describe('Login de usuário - Social Connect', () => {
  const usuario = {
    email: 'test@gmail.com',
    senha: 'password@123',
  };

  const formularioLogin = () => cy.get('form').should('be.visible');

  beforeEach(() => {
    cy.visit('https://social-connect-donheshanthaka.netlify.app/');
    formularioLogin();
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
  });

  it('Realizar login com credenciais válidas', () => {
    formularioLogin().within(() => {
      cy.get('input[name="email"]')
        .should('be.visible')
        .type(usuario.email);

      cy.get('input[name="password"]')
        .should('be.visible')
        .type(usuario.senha);

      cy.contains('button', /^LOGIN$/)
        .should('be.visible')
        .and('be.enabled')
        .click();
    });

    // Aguarda a autenticação e o carregamento da página inicial.
    cy.get('input[name="email"]').should('not.exist');

    // Confirma que a tela de login foi substituída pelo conteúdo da aplicação.
    cy.get('body').should('be.visible').and(($body) => {
      expect($body.find('input[name="password"]')).to.have.length(0);
    });
  });

  it('Realizar login com senha vazia e apresentar a mensagem required', () => {
    formularioLogin().within(() => {
      cy.get('input[name="email"]')
        .should('be.visible')
        .type(usuario.email);

      cy.get('input[name="password"]')
        .should('be.visible')
        .and('have.value', '');

      cy.contains('button', /^LOGIN$/)
        .should('be.visible')
        .and('be.enabled')
        .click();

      // A validação deve indicar que a senha é obrigatória.
      cy.contains('required')
        .should('be.visible');

      // O usuário deve permanecer na tela de login.
      cy.get('input[name="email"]')
        .should('be.visible')
        .and('have.value', usuario.email);

      cy.get('input[name="password"]')
        .should('be.visible')
        .and('have.value', '');
    });
  });
});