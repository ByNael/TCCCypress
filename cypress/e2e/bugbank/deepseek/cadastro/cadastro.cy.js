describe('Cadastro de usuário', () => {
  beforeEach(() => {
    // Acessa a página inicial do BugBank
    cy.visit('https://bugbank.netlify.app/');
    // Clica no botão "Registrar" para acessar o formulário de cadastro
    cy.contains('Registrar').click();
  });

  it('Cadastrar novo usuário com dados válidos', () => {
    const email = `user${Date.now()}@teste.com`;
    const nome = 'Usuario Teste';
    const senha = '123456';

    // Preenche o formulário de cadastro
    // Utiliza o atributo 'name' para garantir que o seletor seja único, já que existem múltiplos inputs na página (login e cadastro)
    cy.get('input[name="email"]').eq(1).type(email);
    cy.get('input[name="name"]').type(nome);
    cy.get('input[name="password"]').eq(1).type(senha);
    cy.get('input[name="passwordConfirmation"]').type(senha);

    // Solicita a criação da conta
    cy.contains('Cadastrar').click();

    // Valida a mensagem de sucesso no modal
    // O texto contém números dinâmicos (número da conta), então usamos uma expressão regular ou verificação parcial
    cy.contains('A conta', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'foi criada com sucesso');
    
    // Opcional: Fechar o modal para garantir que o teste finalize limpo
    cy.contains('Fechar').click();
  });

  it('Tentar cadastrar usuário com senhas diferentes', () => {
    const email = `user${Date.now()}@teste.com`;
    const nome = 'Usuario Teste';
    const senha = '123456';
    const senhaDiferente = '654321';

    // Preenche o formulário com senhas divergentes
    cy.get('input[name="email"]').eq(1).type(email);
    cy.get('input[name="name"]').type(nome);
    cy.get('input[name="password"]').eq(1).type(senha);
    cy.get('input[name="passwordConfirmation"]').type(senhaDiferente);

    // Solicita a criação da conta
    cy.contains('Cadastrar').click();

    // Valida a mensagem de erro
    // O texto esperado é "As senhas não são iguais"
    cy.contains('As senhas não são iguais', { timeout: 10000 }).should('be.visible');
  });
});