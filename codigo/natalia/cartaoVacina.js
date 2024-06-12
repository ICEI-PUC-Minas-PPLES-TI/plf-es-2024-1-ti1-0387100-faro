// variaveis globais
const modal = document.querySelector(".cartao-cadastro-modal");
const cadastrar = document.querySelector(".cartao-content button");
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

//eventos

cadastrar.addEventListener("click", mostrarModal);
sairModal.addEventListener("click", fecharModal);
