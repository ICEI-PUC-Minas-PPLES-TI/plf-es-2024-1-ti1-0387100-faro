document.addEventListener("DOMContentLoaded", function () {
  // variaveis globais
  const modal = document.querySelector(".cartao-cadastro-modal");
  const cadastrar = document.querySelector(".cartao-content .abrirModal");
  const sairModal = document.querySelector(".fecharModal");

  const tempCompromisso = {
    data: "11/06/2024",
    modalidade: "checkup",
    horario: "09h",
    pet: "Nino",
    local: "Puc-Vet",
  };

  //funcoes

  function mostrarModal() {
    modal.classList.add("active");
  }

  function fecharModal() {
    limparEntradas();
    modal.classList.remove("active");
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

  // interacao do crud
  const limparEntradas = () => {
    const entradas = document.querySelectorAll(".modal-input");
    entradas.forEach((entrada) => (entrada.value = ""));
  };

  validezEntradas = () => {
    return document.getElementById("formulario").reportValidity();
  };

  const adicionarCompromisso = () => {
    if (validezEntradas()) {
      const compromisso = {
        nomePet: document.getElementById("nomePet").value,
        modalidade: document.getElementById("modalidade").value,
        data: document.getElementById("data").value,
        hora: document.getElementById("hora").value,
        local: document.getElementById("local").value,
      };
      criarCompromisso(compromisso);
      fecharModal();
    }
  };

  const criarLinha = (compromisso, index) => {
    const novaLinha = document.createElement("div");
    novaLinha.classList.add("cartao-agendado");
    novaLinha.innerHTML = `
    <p>${compromisso.data}</p>
    <p>${compromisso.hora}</p>
    <p>${compromisso.modalidade}</p>
    <span>${compromisso.nomePet}</span>
    <div class="acao">
    <button type="button" id="editar-${index}">editar</button>

    <button type="button" id="deletar-${index}">deletar</button>
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
    mostrarModal();
  };

  const editarCompromisso = (index) => {
    const compromisso = lerCompromisso()[index];
    preencherInput(compromisso);
  };

  const editarDeletar = (event) => {
    if (event.target.type == "button") {
      const [action, index] = event.target.id.split("-");
      if (action == "editar") {
        editarCompromisso(index);
      } else {
        console.log("deletando");
      }
    }
  };

  atualizarAgenda();
  //eventos

  cadastrar.addEventListener("click", mostrarModal);
  sairModal.addEventListener("click", fecharModal);

  document
    .getElementById("cadastrarCompromisso")
    .addEventListener("click", adicionarCompromisso);

  document
    .querySelector("#estrutura-agenda")
    .addEventListener("click", editarDeletar);
});
