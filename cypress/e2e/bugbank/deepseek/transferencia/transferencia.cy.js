describe('Transferência Bancária', () => {
  // Função auxiliar para criar uma conta e retornar os dados de acesso
  const criarConta = (comSaldo = false) => {
    cy.visit('https://bugbank.netlify.app/');
    cy.contains('Registrar').click();

    const timestamp = Date.now();
    const email = `user${timestamp}@teste.com`;
    const nome = `User ${timestamp}`;
    const senha = '123456';

    cy.get('input[name="email"]').eq(1).type(email);
    cy.get('input[name="name"]').type(nome);
    cy.get('input[name="password"]').eq(1).type(senha);
    cy.get('input[name="passwordConfirmation"]').type(senha);

    if (comSaldo) {
      // Ativa o toggle "Criar conta com saldo ?"
      cy.get('#toggleAddBalance').click();
    }

    cy.contains('Cadastrar').click();

    // Captura o número da conta e o dígito a partir da mensagem de sucesso
    // O ID do texto no modal é "modalText"
    return cy.get('#modalText')
      .invoke('text')
      .then((text) => {
        const match = text.match(/A conta (\d+)-(\d+)/);
        const accountNumber = match[1];
        const digit = match[2];

        cy.get('#btnCloseModal').click();
        
        // IMPORTANTE: Usar cy.wrap para retornar um valor que o Cypress entende como parte da cadeia assíncrona
        return cy.wrap({ email, senha, accountNumber, digit });
      });
  };

  // Realiza login na conta informada
  const realizarLogin = (email, senha) => {
    cy.get('input[name="email"]').eq(0).type(email);
    cy.get('input[name="password"]').eq(0).type(senha);
    cy.contains('Acessar').click();
    // Aguarda carregar a home validando o texto de saldo
    cy.contains('Saldo em conta', { timeout: 5000 }).should('be.visible');
  };

  it('Realizar transferência com dados válidos', () => {
    // 1. Criar conta de destino
    criarConta(false).then((contaDestino) => {
      
      // 2. Criar conta de origem COM SALDO
      criarConta(true).then((contaOrigem) => {
        
        // 3. Realizar login na conta de origem
        realizarLogin(contaOrigem.email, contaOrigem.senha);

        // 4. Acessar tela de transferência
        cy.get('a[id="btn-TRANSFERÊNCIA"]').click();

        // 5. Preencher dados da transferência
        cy.get('input[name="accountNumber"]').type(contaDestino.accountNumber);
        cy.get('input[name="digit"]').type(contaDestino.digit);
        cy.get('input[name="transferValue"]').type('100');
        cy.get('input[name="description"]').type('Teste de transferência válida');

        // 6. Confirmar transferência
        cy.contains('Transferir agora').click();

        // 7. Validar mensagem de sucesso
        cy.contains('Transferência realizada com sucesso', { timeout: 10000 }).should('be.visible'); //A aplicação tem um erro de digitação na palavra "Transferência" que ocasiona na falha do cenário
        cy.contains('Fechar').click();
      });
    });
  });

  it('Tentar realizar transferência sem saldo suficiente', () => {
    // 1. Criar conta de destino
    criarConta(false).then((contaDestino) => {
      
      // 2. Criar conta de origem SEM SALDO (comSaldo = false)
      criarConta(false).then((contaOrigem) => {
        
        // 3. Realizar login na conta de origem
        realizarLogin(contaOrigem.email, contaOrigem.senha);

        // 4. Acessar tela de transferência
        cy.get('a[id="btn-TRANSFERÊNCIA"]').click();

        // 5. Preencher dados com valor superior ao saldo (saldo é 0)
        cy.get('input[name="accountNumber"]').type(contaDestino.accountNumber);
        cy.get('input[name="digit"]').type(contaDestino.digit);
        cy.get('input[name="transferValue"]').type('1000');
        cy.get('input[name="description"]').type('Teste sem saldo');

        // 6. Confirmar transferência
        cy.contains('Transferir agora').click();

        // 7. Validar mensagem de erro
        cy.contains('Você não tem saldo suficiente para essa transação', { timeout: 10000 }).should('be.visible');
        cy.contains('Fechar').click();
      });
    });
  });
});