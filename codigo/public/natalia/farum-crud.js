document.addEventListener("DOMContentLoaded", function () {
  const formArtigo = document.getElementById("formArtigo");

  formArtigo.addEventListener("submit", function (event) {
    event.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao-artigo").value;
    const conteudo = document.getElementById("conteudo-artigo").value;

    if (!titulo || !descricao || !conteudo) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const novoArtigo = {
      id: new Date().getTime(),
      titulo: titulo,
      descricao: descricao,
      conteudo: conteudo,
    };

    // Salvar artigo no Local Storage
    salvarArtigo(novoArtigo);

    // Limpar campos do formulário
    limparCampos();

    // Atualizar carrossel com artigos salvos
    adicionarArtigoAoCarrossel(novoArtigo);

    // Fechar modal após salvar
    fecharModal();
  });

  function salvarArtigo(artigo) {
    let artigos = JSON.parse(localStorage.getItem("artigos")) || [];
    artigos.push(artigo);
    localStorage.setItem("artigos", JSON.stringify(artigos));
  }

  function adicionarArtigoAoCarrossel(artigo) {
    const carrossel = document.querySelector(".farum-carrosel");

    // Criar o elemento do slide
    const button = document.createElement("button");
    button.classList.add("farum-card", "item");
    button.innerHTML = `
      <div class="farum-card-foto">
        <img src="caminho_para_imagem" alt="${artigo.titulo}">
      </div>
      <div class="farum-card-texto">
        <h3>${artigo.titulo}</h3>
        <p>${artigo.descricao}</p>
      </div>
    `;

    button.addEventListener("click", abrirModal);
    carrossel.appendChild(button);

    // Atualizar currentItem e totalItems
    const controles = document.querySelectorAll(".controle");
    const currentItem = controles.length > 0 ? controles.length - 1 : 0;
    const totalItems = currentItem + 1;
    controles.forEach((controle) => controle.classList.remove("current-item"));
    button.classList.add("current-item");

    // Atualizar event listeners para controles
    controles.forEach((controle) => {
      controle.removeEventListener("click", controleListener);
      controle.addEventListener("click", controleListener);
    });

    function controleListener() {
      const setaEsquerda = controle.classList.contains("farum-seta-anterior");
      currentItem = setaEsquerda ? currentItem - 1 : currentItem + 1;
      currentItem = (currentItem + totalItems) % totalItems;
      atualizarCarrossel();
    }

    atualizarCarrossel();
  }

  function limparCampos() {
    document.getElementById("titulo").value = "";
    document.getElementById("descricao-artigo").value = "";
    document.getElementById("conteudo-artigo").value = "";
  }

  function fecharModal() {
    const body = document.body;
    document.querySelector(".farum-modal").classList.remove("ativa");
    document.querySelector(".fundo-opaco").classList.remove("ativa");
    body.classList.remove("modal-aberto");
  }
});
