document.addEventListener("DOMContentLoaded", function () {
  // variáveis globais
  const modal = document.querySelector(".cartao-cadastro-modal");
  const cadastrar = document.querySelector(".cartao-content .abrirModal");
  const sairModal = document.querySelector(".fecharModal");
  const fundoOpaco = document.querySelector(".fundo-opaco");

  const tempCompromisso = {
    data: "11/06/2024",
    modalidade: "checkup",
    horario: "09h",
    pet: "Nino",
    local: "Puc-Vet",
  };

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

  const getLocalStorage = () =>
    JSON.parse(localStorage.getItem("db_compromisso")) ?? [];
  const setLocalStorage = (db_compromisso) =>
    localStorage.setItem("db_compromisso", JSON.stringify(db_compromisso));

  // CRUD
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

  // validezEntradas = () => {
  //   return document.getElementById("formulario").reportValidity();
  // };

  function validarEntradas() {
    const nomePetInput = document.getElementById("nomePet");
    const modalidadeInput = document.getElementById("modalidade");
    const dataInput = document.getElementById("data");
    const horaInput = document.getElementById("hora");
    const localInput = document.getElementById("local");

    const nomePet = nomePetInput.value.trim();
    const modalidade = modalidadeInput.value.trim();
    const data = dataInput.value.trim();
    const hora = horaInput.value.trim();
    const local = localInput.value.trim();

    // Verifica se os campos estão vazios
    if (data === "") {
      dataInput.focus();
      return false;
    }
    if (hora === "") {
      horaInput.focus();
      return false;
    }
    if (nomePet === "") {
      nomePetInput.focus();
      return false;
    }
    if (local === "") {
      localInput.focus();
      return false;
    }
    if (modalidade === "") {
      modalidadeInput.focus();
      return false;
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
        nomePet: document.getElementById("nomePet").value,
        modalidade: document.getElementById("modalidade").value,
        data: document.getElementById("data").value,
        hora: document.getElementById("hora").value,
        local: document.getElementById("local").value,
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
    document.getElementById("data").value = compromisso.data;
    document.getElementById("hora").value = compromisso.hora;
    document.getElementById("modalidade").value = compromisso.modalidade;
    document.getElementById("nomePet").value = compromisso.nomePet;
    document.getElementById("local").value = compromisso.local;
    mostrarModal();
    document.getElementById("nomePet").dataset.index =
      compromisso.index || "new";
  };

  const editarCompromisso = (index) => {
    const compromisso = lerCompromisso()[index];
    // compromisso.index = index;
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

  // eventos
  cadastrar.addEventListener("click", mostrarModal);
  sairModal.addEventListener("click", fecharModal);

  document
    .getElementById("cadastrarCompromisso")
    .addEventListener("click", adicionarCompromisso);
  document
    .querySelector("#estrutura-agenda")
    .addEventListener("click", editarDeletar);

  // Função para normalizar strings
  function normalizarString(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  // Filtro de busca
  document
    .getElementById("inputBusca")
    .addEventListener("input", function (event) {
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
    });

  // Adicionando funcionalidade aos botões
  const modalidadeBotao = document.querySelectorAll(".modalidade-botao button");
  modalidadeBotao.forEach((button) => {
    button.addEventListener("click", function () {
      const modalidadeInput = document.getElementById("modalidade");
      modalidadeInput.value = this.getAttribute("data-modalidade");
    });
  });
});
