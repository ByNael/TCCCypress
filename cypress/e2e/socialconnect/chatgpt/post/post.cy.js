describe('Publicação no feed - Social Connect', () => {
  const usuario = {
    email: 'test@gmail.com',
    senha: 'password@123',
  };

  const publicacao = {
    texto: `Teste E2E de publicação ${Date.now()}`,
    imagem: 'cypress/fixtures/imagem-teste.png',
  };

  beforeEach(() => {
    cy.visit('https://social-connect-donheshanthaka.netlify.app/');
    cy.get('body').should('be.visible');
  });

  it('Criar uma nova publicação com texto e imagem', () => {
    // Login
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

    cy.get('input[placeholder="Share your memory with a caption..."]')
      .should('be.visible')
      .type(publicacao.texto);

    cy.get('.css-172bykr > .MuiBox-root').click();

    cy.get('input[type="file"]', { timeout: 10000 })
      .should('exist')
      .selectFile(publicacao.imagem, { force: true });

    cy.contains('button', 'POST')
      .should('be.visible')
      .and('not.be.disabled');
  });

  it('Publicar conteúdo criado e verificar a publicação no feed', () => {
    // Login
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

    cy.get('input[placeholder="Share your memory with a caption..."]')
      .should('be.visible')
      .type(publicacao.texto);

    
    cy.get('.css-172bykr > .MuiBox-root').click();

    cy.get('input[type="file"]', { timeout: 15000 })
    .should('exist')
    .selectFile('cypress/fixtures/imagem-teste.png', { force: true });

    cy.contains('button', 'POST')
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    cy.contains(publicacao.texto, { timeout: 15000 })
      .should('be.visible');

    cy.get('img[alt="post"]', { timeout: 15000 })
      .should('exist')
      .and('be.visible');
  });
});