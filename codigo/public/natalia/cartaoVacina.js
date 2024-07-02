document.addEventListener("DOMContentLoaded", function () {
  // variáveis globais
  const obterValorInput = (id) => document.getElementById(id).value;
  const modal = document.querySelector(".cartao-cadastro-modal");
  const cadastrar = document.querySelector(".cartao-content .abrirModal");
  const sairModal = document.querySelector(".fecharModal");

  const fundoOpaco = document.querySelector(".fundo-opaco");
  const inputFiltro = document.getElementById("inputBusca");

  const modalidadeBotao = document.querySelectorAll(".modalidade-botao button");
  const modalidadeInput = document.getElementById("modalidade");

  //funções

  function mostrarModal() {
    modal.classList.add("active");
    fundoOpaco.classList.add("active");
  }

  function fecharModal() {
    limparEntradas();
    modal.classList.remove("active");
    fundoOpaco.classList.remove("active");
  }

  // CRUD
  const getLocalStorage = () =>
    JSON.parse(localStorage.getItem("db_compromisso")) ?? [];

  const setLocalStorage = (db_compromisso) =>
    localStorage.setItem("db_compromisso", JSON.stringify(db_compromisso));

  const criarCompromisso = (compromisso) => {
    const db_compromisso = getLocalStorage();
    db_compromisso.push(compromisso);
    setLocalStorage(db_compromisso);
  };

  const lerCompromisso = () => getLocalStorage();

  const atualizarCompromisso = (index, compromisso) => {
    const db_compromisso = lerCompromisso();
    db_compromisso[index] = compromisso;
    setLocalStorage(db_compromisso);
  };

  const deletarCompromisso = (index) => {
    const db_compromisso = lerCompromisso();
    db_compromisso.splice(index, 1);
    setLocalStorage(db_compromisso);
  };

  // interação do CRUD
  const limparEntradas = () => {
    const entradas = document.querySelectorAll(".modal-input");
    entradas.forEach((entrada) => (entrada.value = ""));
  };


  function validarEntradas() {
    const campos = [
      { id: "data", nome: "Data" },
      { id: "hora", nome: "Hora" },
      { id: "nomePet", nome: "Nome do Pet" },
      { id: "local", nome: "Local" },
      { id: "modalidade", nome: "Modalidade", maxLength: 15 },
    ];

    for (const campo of campos) {
      const input = document.getElementById(campo.id);
      const valor = input.value.trim();

      if (valor === "") {
        input.focus();
        return false;
      }

      if (campo.maxLength && valor.length > campo.maxLength) {
        input.focus();
        return false;
      }
    }

    return true;
  }

  function formatarDataBrasileira(data) {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  }


  const adicionarCompromisso = (event) => {
    event.preventDefault();
    if (validarEntradas()) {
      const compromisso = {
        nomePet: obterValorInput("nomePet"),
        modalidade: obterValorInput("modalidade"),
        data: obterValorInput("data"),
        hora: obterValorInput("hora"),
        local: obterValorInput("local"),
      };

      const index = document.getElementById("nomePet").dataset.index;
      if (index === "new") {
        criarCompromisso(compromisso);
      } else {
        atualizarCompromisso(index, compromisso);
      }

      atualizarAgenda();
      fecharModal();
    }
  };

  function primeiraLetraMaiuscula(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const criarLinha = (compromisso, index) => {
    const novaLinha = document.createElement("div");
    const exibicaoData = formatarDataBrasileira(compromisso.data);
    novaLinha.classList.add("cartao-agendado");
    novaLinha.innerHTML = `
    <p>${exibicaoData}</p>
    <p>${compromisso.hora}</p>
    <p>${primeiraLetraMaiuscula(compromisso.modalidade)}</p>
    <span>${primeiraLetraMaiuscula(compromisso.nomePet)}</span>
    <span>${primeiraLetraMaiuscula(compromisso.local)}</span>
    <div class="acao">
    <button type="button" id="editar-${index}">
    <img src="./assets/img/editing.png" alt="editar">
    </button>
    <button type="button" id="deletar-${index}">
    <img src="./assets/img/delete.png" alt="deletar">
    </button>
    </div>
    `;
    document.getElementById("estrutura-agenda").appendChild(novaLinha);
  };

  const limparAgenda = () => {
    const linhas = document.querySelectorAll(".cartao-agendado");
    linhas.forEach((linha) => linha.parentNode.removeChild(linha));
  };

  const atualizarAgenda = () => {
    const db_compromisso = lerCompromisso();
    limparAgenda();
    db_compromisso.forEach(criarLinha);
  };


  const preencherInput = (compromisso) => {
    const campos = [
      { id: "data", valor: compromisso.data },
      { id: "hora", valor: compromisso.hora },
      { id: "modalidade", valor: compromisso.modalidade },
      { id: "nomePet", valor: compromisso.nomePet },
      { id: "local", valor: compromisso.local },
    ];

    campos.forEach((campo) => {
      document.getElementById(campo.id).value = campo.valor;
    });

    mostrarModal();
    document.getElementById("nomePet").dataset.index =
      compromisso.index || "new";
  };

  const editarCompromisso = (index) => {
    const compromisso = lerCompromisso()[index];
    compromisso.index = index;
    preencherInput(compromisso);
  };

  const editarDeletar = (event) => {
    let target = event.target;

    if (target.tagName === "IMG") {
      target = target.parentElement;
    }

    if (target.tagName === "BUTTON") {
      const [action, index] = target.id.split("-");
      if (action === "editar") {
        editarCompromisso(index);
      } else if (action === "deletar") {
        const resposta = confirm(`Deseja realmente excluir esse compromisso?`);
        if (resposta) {
          deletarCompromisso(index);
          atualizarAgenda();
        }
      }
    } else if (target.id === "cadastrarCompromisso") {
      adicionarCompromisso();
    }
  };

  atualizarAgenda();

  function normalizarString(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function filtrarBusca(event) {
    const procurarTermo = normalizarString(event.target.value);
    const db_compromisso = getLocalStorage();
    const compromissosFiltrados = db_compromisso.filter((compromisso) => {
      const termoContemDoisNumeros =
        (procurarTermo.match(/\d/g) || []).length >= 2;
      return (
        normalizarString(compromisso.modalidade).includes(procurarTermo) ||
        normalizarString(compromisso.nomePet).includes(procurarTermo) ||
        normalizarString(compromisso.local).includes(procurarTermo) ||
        (termoContemDoisNumeros &&
          (compromisso.data.includes(procurarTermo) ||
            compromisso.hora.includes(procurarTermo)))
      );
    });
    limparAgenda();
    compromissosFiltrados.forEach(criarLinha);
  }

  function adicionarEventoModalidade(modalidadeBotao, modalidadeInput) {
    modalidadeBotao.forEach((button) => {
      button.addEventListener("click", function () {
        modalidadeInput.value = this.getAttribute("data-modalidade");
      });
    });
  }

  // eventos
  inputFiltro.addEventListener("input", filtrarBusca);
  cadastrar.addEventListener("click", mostrarModal);
  sairModal.addEventListener("click", fecharModal);
  adicionarEventoModalidade(modalidadeBotao, modalidadeInput);

  document
    .getElementById("cadastrarCompromisso")
    .addEventListener("click", adicionarCompromisso);
  document
    .querySelector("#estrutura-agenda")
    .addEventListener("click", editarDeletar);
});
