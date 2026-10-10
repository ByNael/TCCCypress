describe('Criação de Publicação', () => {
  beforeEach(() => {
    // Realiza o login antes de cada teste para garantir que o usuário está autenticado
    cy.visit('https://social-connect-donheshanthaka.netlify.app/');
    cy.get('input[name="email"]').type('test@gmail.com');
    cy.get('input[name="password"]').type('password@123');
    cy.get('button[type="submit"]').click();
    // Aguarda a página inicial carregar
    cy.contains('Upcoming Events', { timeout: 20000 }).should('be.visible');
  });

it('Criar uma nova publicação', () => {
    const postContent = 'teste texto para publicação';

    cy.get('input[placeholder="Share your memory with a caption..."]')
      .type(postContent);

    // Clica em "Image" para revelar a área de upload
    cy.contains('Image').click();
    cy.contains('Add Image Here').should('be.visible');

    // Usa um arquivo real do diretório de fixtures
    cy.get('input[type="file"]').selectFile('cypress/fixtures/imagem-teste.png', {
      force: true
    });

    // Valida os dados para confirmação
    cy.get('input[placeholder="Share your memory with a caption..."]')
      .should('have.value', postContent);

    // O nome exibido será o do arquivo do fixture
    cy.contains('imagem-teste.png').should('be.visible');
  });

  it('Publicar conteúdo criado', () => {
    const postContent = 'teste texto para publicação';

    cy.get('input[placeholder="Share your memory with a caption..."]')
      .type(postContent);

    cy.contains('Image').click();
    cy.contains('Add Image Here').should('be.visible');

    cy.get('input[type="file"]').selectFile('cypress/fixtures/imagem-teste.png', {
      force: true
    });

    // Clica em POST
    cy.contains('button', 'POST').click();

    // Verifica a publicação no feed
    cy.contains(postContent).should('be.visible');
    cy.get('img[alt="post"]').should('have.length.greaterThan', 0);
  });
});