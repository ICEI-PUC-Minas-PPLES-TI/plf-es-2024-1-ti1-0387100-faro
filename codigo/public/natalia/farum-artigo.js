document.addEventListener("DOMContentLoaded", function () {
  const artigoContainer = document.getElementById("artigo-container");

  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");

  if (idParam !== null && !isNaN(idParam)) {
    const artigoId = parseInt(idParam);

    fetch("data/sliderFarum.json")
      .then((response) => response.json())
      .then((data) => {
        const artigo = data.find((item) => item.id === artigoId);

        if (!artigo) {
          console.error(`Artigo com ID ${artigoId} não encontrado.`);
          return;
        }

        const {
          titulo,
          imagem,
          introducao,
          conteudo,
          conclusao,
          "tempo de leitura": tempoDeLeitura,
          "data de publicação": dataDePublicacao,
        } = artigo;

        // Formatar data para formato brasileiro (dd/mm/aaaa)
        const dataFormatada = new Date(dataDePublicacao).toLocaleDateString(
          "pt-BR",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }
        );

        // Limpar conteúdo existente no artigoContainer
        artigoContainer.innerHTML = "";

        // Criar elementos HTML para exibir o artigo dinamicamente
        const artigoElement = document.createElement("div");
        artigoElement.classList.add("farum-artigo");

        artigoElement.innerHTML = `
          <h3 class="artigo-titulo">${titulo}</h3>
          <div class="informacoes-artigo">
            <span class="data-artigo" title="Publicado em">
              <img src="./assets/img/calendar.png" alt="Data de publicação">
              ${dataFormatada}
            </span>
            <span class="tempo-artigo" title="Tempo de leitura">
              <img src="./assets/img/clock.png" alt="Tempo de leitura">
              ${tempoDeLeitura}
            </span>
          </div>
          <div class="farum-artigo-img">
            <img src="${imagem}" alt="${titulo}">
          </div>
          <p class="artigo-introducao">${introducao}</p>
        `;

        // Adicionar os parágrafos de conteúdo
        conteudo.forEach((item) => {
          artigoElement.innerHTML += `
            <h4 class="artigo-subtitulo">${item.subtitulo}</h4>
            <p class="artigo-texto">${item.paragrafo.join("<br>")}</p>
          `;
        });

        // Adicionar a conclusão do artigo
        artigoElement.innerHTML += `
          <h4 class="artigo-subtitulo">Conclusão</h4>
          <p class="artigo-texto">${conclusao}</p>
        `;

        // Adicionar artigoElement ao artigoContainer
        artigoContainer.appendChild(artigoElement);
      })
      .catch((error) => {
        console.error("Erro ao carregar dados do artigo:", error);
      });
  } else {
    console.error("O parâmetro 'id' na URL não é um número válido.");
    // Aqui você pode adicionar lógica para lidar com o erro, como redirecionar o usuário ou exibir uma mensagem de erro na página
  }
});
