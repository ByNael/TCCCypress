describe('Fluxo completo - Cadastro, Login e Transferência | BugBank', () => {
  const criarUsuario = (identificador) => ({
    nome: `Usuario E2E ${identificador}`,
    email: `teste.e2e.${identificador}.${Date.now()}@email.com`,
    senha: 'Teste@12345',
    numeroConta: '',
    digitoConta: '',
  });

  let usuarioOrigem;
  let usuarioDestino;

  const formularioCadastro = () =>
    cy.get('form').filter(':has(input[name="passwordConfirmation"])');

  const formularioLogin = () =>
    cy.get('form').filter(
      ':has(input[name="password"]):not(:has(input[name="passwordConfirmation"]))'
    );

  const formularioTransferencia = () =>
    cy.get('form').filter(':has(input[name="accountNumber"])');

  function cadastrarUsuario(usuario) {
    cy.visit('https://bugbank.netlify.app/');

    cy.contains('button', 'Registrar', { timeout: 15000 })
      .should('be.visible')
      .click();

    formularioCadastro()
      .should('have.length', 1)
      .and('be.visible')
      .within(() => {
        cy.get('input[name="email"]').type(usuario.email);
        cy.get('input[name="name"]').type(usuario.nome);
        cy.get('input[name="password"]').type(usuario.senha);
        cy.get('input[name="passwordConfirmation"]').type(usuario.senha);

        // Cria a conta com saldo inicial para permitir a transferência.
        cy.get('#toggleAddBalance')
          .click({ force: true });

        cy.contains('button', 'Cadastrar')
          .should('be.enabled')
          .click();
      });

    cy.get('#modalText', { timeout: 15000 })
      .should('be.visible')
      .invoke('text')
      .then((textoModal) => {
        const conta = textoModal.match(
          /A conta\s+(\d+)-(\d+)\s+foi criada com sucesso/i
        );

        expect(conta, `Confirmação do cadastro: ${textoModal}`).to.not.be.null;

        usuario.numeroConta = conta[1];
        usuario.digitoConta = conta[2];
      });

    cy.get('#btnCloseModal')
      .should('be.visible')
      .click();
  }

  function realizarLogin(usuario) {
    formularioLogin()
      .should('be.visible')
      .within(() => {
        cy.get('input[name="email"]').clear().type(usuario.email);
        cy.get('input[name="password"]').clear().type(usuario.senha);

        cy.contains('button', 'Acessar')
          .should('be.enabled')
          .click();
      });

    cy.get('#textName', { timeout: 15000 })
      .should('be.visible')
      .and('contain.text', usuario.nome);
  }

  function acessarTransferencia() {
    cy.get('#btn-TRANSFERÊNCIA', { timeout: 15000 })
      .should('be.visible')
      .click();

    formularioTransferencia()
      .should('have.length', 1)
      .and('be.visible');
  }

  function preencherTransferencia(usuarioDestino, valor, descricao) {
    formularioTransferencia().within(() => {
      cy.get('input[name="accountNumber"]')
        .should('be.visible')
        .clear()
        .type(usuarioDestino.numeroConta);

      cy.get('input[name="digit"]')
        .should('be.visible')
        .clear()
        .type(usuarioDestino.digitoConta);

      cy.get('input[name="transferValue"]')
        .should('be.visible')
        .clear()
        .type(String(valor));

      cy.get('input[name="description"]')
        .should('be.visible')
        .clear()
        .type(descricao);

      cy.contains('button', 'Transferir agora')
        .should('be.enabled')
        .click();
    });
  }

  function fecharModal() {
    cy.get('#btnCloseModal')
      .click();
  }

  beforeEach(() => {
    usuarioOrigem = criarUsuario('origem');
    usuarioDestino = criarUsuario('destino');
  });

  it('Deve criar duas contas, fazer login na origem e transferir para a conta de destino', () => {
    // 1. Cria a conta de destino com saldo inicial.
    cadastrarUsuario(usuarioDestino);

    // 2. Cria a conta de origem com saldo inicial.
    cadastrarUsuario(usuarioOrigem);

    // 3. Faz login na conta de origem.
    realizarLogin(usuarioOrigem);

    // 4. Acessa a área de transferência.
    acessarTransferencia();

    // 5. Transfere para a conta de destino, usando número e dígito
    // capturados do modal de cadastro dessa segunda conta.
    preencherTransferencia(
      usuarioDestino,
      10,
      'Transferência E2E entre contas'
    );

    cy.get('#modalText', { timeout: 15000 })
      .should('be.visible')
      .and('contain.text', 'Transferencia realizada com sucesso');
  });

  it('Deve exibir erro ao tentar transferir um valor superior ao saldo', () => {
    cadastrarUsuario(usuarioDestino);
    cadastrarUsuario(usuarioOrigem);
    realizarLogin(usuarioOrigem);
    acessarTransferencia();

    preencherTransferencia(
      usuarioDestino,
      999999,
      'Teste de saldo insuficiente'
    );

    cy.get('#modalText', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Você não tem saldo suficiente para essa transação');

    fecharModal();
  });

  it('Deve exibir erro ao tentar transferir para uma conta inexistente', () => {
    cadastrarUsuario(usuarioDestino);
    cadastrarUsuario(usuarioOrigem);
    realizarLogin(usuarioOrigem);
    acessarTransferencia();

    preencherTransferencia(
      { numeroConta: '999999', digitoConta: '1' },
      10,
      'Teste de conta inexistente'
    );

    cy.get('#modalText', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Conta inválida ou inexistente');

    fecharModal();
  });
});