describe('Login', () => {
  beforeEach(() => {
    // Acessa a página inicial do BugBank
    cy.visit('https://bugbank.netlify.app/');
  });

  it('Realizar login com credenciais válidas', () => {
    // Pré-condição: Criar um usuário para garantir que as credenciais existam
    // Como o banco é em memória local, precisamos registrar antes de logar
    cy.contains('Registrar').click();
    
    const email = `user${Date.now()}@teste.com`;
    const nome = 'Usuario Teste';
    const senha = '123456';

    cy.get('input[name="email"]').eq(1).type(email);
    cy.get('input[name="name"]').type(nome);
    cy.get('input[name="password"]').eq(1).type(senha);
    cy.get('input[name="passwordConfirmation"]').type(senha);
    
    // Clica em Cadastrar
    cy.contains('Cadastrar').click();

    // Aguarda o modal de sucesso (que possui o botão Fechar) e clica para voltar ao login
    // O BugBank geralmente exibe um modal com o texto "foi criada com sucesso"
    cy.contains('Fechar').click();

    // Agora realiza o login com as credenciais criadas
    cy.get('input[name="email"]').eq(0).type(email);
    cy.get('input[name="password"]').eq(0).type(senha);
    cy.contains('Acessar').click();

    // Valida se foi redirecionado para a área principal (verificando o texto de saldo ou boas-vindas)
    // O BugBank exibe "Saldo disponível" na tela inicial logada
    cy.contains('Saldo em conta', { timeout: 10000 }).should('be.visible');
  });

  it('Realizar login com senha inválida', () => {
    // Pré-condição: Criar um usuário
    cy.contains('Registrar').click();
    
    const email = `user${Date.now()}@teste.com`;
    const nome = 'Usuario Teste';
    const senha = '123456';

    cy.get('input[name="email"]').eq(1).type(email);
    cy.get('input[name="name"]').type(nome);
    cy.get('input[name="password"]').eq(1).type(senha);
    cy.get('input[name="passwordConfirmation"]').type(senha);
    cy.contains('Cadastrar').click();
    cy.contains('Fechar').click();

    // Tenta logar com senha incorreta
    cy.get('input[name="email"]').eq(0).type(email);
    cy.get('input[name="password"]').eq(0).type('senha_errada');
    cy.contains('Acessar').click();

    // Valida a mensagem de erro no modal
    cy.contains('Usuário ou senha inválido. Tente novamente ou verifique suas informações!', { timeout: 10000 })
      .should('be.visible');
  });
});