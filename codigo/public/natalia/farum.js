document.addEventListener("DOMContentLoaded", function () {
  /* farum */
  // const buttonFecharModal = document.querySelector(".farum-fechar-modal");

  (function () {
    // funcao para criar o carrossel
    const controles = document.querySelectorAll(".controle");
    let currentItem = 0;
    let totalItems = 0;

    controles.forEach((controle) => {
      controle.addEventListener("click", () => {
        const setaEsquerda = controle.classList.contains("farum-seta-anterior");

        if (setaEsquerda) {
          currentItem -= 1;
        } else {
          currentItem += 1;
        }

        if (currentItem >= totalItems) {
          currentItem = 0;
        }

        if (currentItem < 0) {
          currentItem = totalItems - 1;
        }

        console.log("control", setaEsquerda, currentItem);

        const items = document.querySelectorAll(".farum-carrosel .item");
        items.forEach((item) => item.classList.remove("current-item"));

        items[currentItem].scrollIntoView(
          {
            inline: "center",
            behavior: "smooth",
            block: "nearest",
          },
          100
        );

        // bom para adicionar estilo no current-item dps:
        items[currentItem].classList.add("current-item");
      });
    });

    // URL do JSON
    const url_BASE = "./data/sliderFarum.json";

    // funcao para carregar os slides do JSON e preencher o carrossel
    async function carregarSlides() {
      try {
        const resposta = await fetch(url_BASE);

        if (!resposta.ok) {
          throw new Error("Não foi possível carregar os slides!");
        }

        const slides = await resposta.json();
        acrescentarSlides(slides);
      } catch (error) {
        alert("Erro ao carregar os slides.");
      }
    }

    // funcao para preencher o carrossel com os slides
    function acrescentarSlides(slides) {
      const carrossel = document.querySelector(".farum-carrosel");
      carrossel.innerHTML = ""; // Limpar qualquer conteúdo existente

      slides.forEach((slide, index) => {
        // Criar o botão para envolver o slide
        const link = document.createElement("a");
        link.classList.add("farum-card", "item");
        if (index === 0) {
          link.classList.add("current-item");
        }

        link.href = `./farum-artigo.html?id=${slide.id}`;
        link.target = "_blank";

        // Substitua "url-da-pagina" pela URL apropriada
        if (index === 0) {
          link.classList.add("current-item");
        }

        // Criar o conteúdo do slide (foto e texto)
        const slideContent = `
          <div class="farum-card-foto">
            <img src="${slide.imagem}" alt="${slide.titulo}">
          </div>
          <div class="farum-card-texto">
            <h3>${slide.titulo}</h3>
            <p>${slide.descricao}</p>
          </div>
        `;

        // Adicionar o conteúdo do slide ao botão
        link.innerHTML = slideContent;

        //link.addEventListener("click", abrirModal);
        carrossel.appendChild(link);
      });

      totalItems = slides.length; // Atualizar o total de itens, se necessário
    }
    // function avancarSlideAutomaticamente() {
    //   setInterval(() => {
    //     let nextItem = currentItem + 1;
    //     if (nextItem >= totalItems) {
    //       nextItem = 0;
    //     }

    //     const items = document.querySelectorAll(".farum-carrosel .item");
    //     items[nextItem].scrollIntoView({
    //       inline: "center",
    //       behavior: "smooth",
    //       block: "nearest",
    //     });

    //     currentItem = nextItem;
    //     items.forEach((item) => item.classList.remove("current-item"));
    //     items[currentItem].classList.add("current-item");
    //   }, 5000);
    // }

    // function abrirModal() {
    //   const body = document.body;
    //   const abrirArtigo = document.querySelector(".farum-modal");
    //   const fundoOpaco = document.querySelector(".fundo-opaco");

    //   abrirArtigo.classList.add("ativa");
    //   fundoOpaco.classList.add("ativa");
    //   body.classList.add("modal-aberto");
    // }

    // function fecharModal() {
    //   const body = document.body;
    //   const abrirArtigo = document.querySelector(".farum-modal");
    //   const fundoOpaco = document.querySelector(".fundo-opaco");

    //   abrirArtigo.classList.remove("ativa");
    //   fundoOpaco.classList.remove("ativa");
    //   body.classList.remove("modal-aberto");
    // }
    // buttonFecharModal.addEventListener("click", fecharModal);

    // Função para configurar o comportamento do scroll no modal

    // chama a funcao para carregar os slides ao iniciar
    carregarSlides();
    //  avancarSlideAutomaticamente();
  })();

  /* faq */
  (function () {
    // garantir que o elemento "listaFaq" existe
    const lista = document.getElementById("listaFaq");
    if (!lista) {
      console.error('Elemento "listaFaq" não encontrado!');
      return;
    }

    const url_BASE = "./data/perguntasFarum.json";
    const numero_inicial_perguntas = 8; // ao acessar o sistema a lista vai mostrar só 8 perguntas puxadas do json

    async function carregarDados() {
      //carregando a lista de perguntas pelos dados do json, nessa função tambem fiz a estruturação do html com base no json
      try {
        const resposta = await fetch(url_BASE);

        if (!resposta.ok) {
          throw new Error("Não foi possível carregar os dados!");
        }
        const novasPerguntas = await resposta.json();
        popularLista(novasPerguntas);
        adicionarEventosPerguntas();
      } catch (error) {
        alert(error);
      }
    }

    function popularLista(dados) {
      for (let i = 0; i < dados.length; i++) {
        const dl = document.createElement("dl");
        const div = document.createElement("div");
        const dt = document.createElement("dt");
        const button = document.createElement("button");
        const dd = document.createElement("dd");

        const id = `pergunta${i + 1}`; // gerando o id para cada pergunta

        button.className = "ativa";
        button.setAttribute("aria-controls", id);
        button.setAttribute("aria-expanded", "false");
        button.textContent = dados[i].pergunta;

        dd.id = id;
        dd.className = "";
        dd.textContent = dados[i].resposta;

        dt.appendChild(button);
        div.appendChild(dt);
        div.appendChild(dd);
        dl.appendChild(div);

        if (i >= numero_inicial_perguntas) {
          dl.style.display = "none";
        }

        lista.appendChild(dl);
      }
    }

    function adicionarEventosPerguntas() {
      // funcao para adicionar o evento de clique para abrir e fechar as perguntas que forem filtradas
      const perguntas = document.querySelectorAll("#listaFaq button");

      function abrir(event) {
        const pergunta = event.currentTarget;
        const controls = pergunta.getAttribute("aria-controls");
        const resposta = document.getElementById(controls);

        resposta.classList.toggle("ativa");
        const ativa = resposta.classList.contains("ativa");
        pergunta.setAttribute("aria-expanded", ativa);
      }

      function eventosPerguntas(pergunta) {
        pergunta.addEventListener("click", abrir);
      }

      perguntas.forEach(eventosPerguntas);
    }

    window.addEventListener("load", () => {
      carregarDados();
    });
  })();

  // Perguntas frequentes abrir/fechar
  (function () {
    function abrir(event) {
      const pergunta = event.currentTarget;
      const controls = pergunta.getAttribute("aria-controls");
      const resposta = document.getElementById(controls);

      resposta.classList.toggle("ativa");
      const ativa = resposta.classList.contains("ativa");
      pergunta.setAttribute("aria-expanded", ativa);
    }

    function eventosPerguntas(pergunta) {
      pergunta.addEventListener("click", abrir);
    }

    document.addEventListener("DOMContentLoaded", () => {
      const perguntas = document.querySelectorAll("#listaFaq button");
      perguntas.forEach(eventosPerguntas);
    });
  })();

  // filtrando perguntas de acordo com o que o usuário colocar no input de busca
  (function () {
    const inputPerguntas = document.getElementById("pesquisaInput");
    const listaPerguntas = document.getElementById("listaFaq");
    const contateNos = document.querySelector(".contato");

    inputPerguntas.addEventListener("keyup", () => {
      // essa expressão faz com que o retorno desconsidere tanto letra maiuscula e minuscula como acentuacao, foi o jeito que achei de independentemente de o usuario digitar caracteres especiais a funcao vai filtrar a palavra e fazer a comparacao com o localstorage
      let expressao = inputPerguntas.value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      if (expressao.length < 2 && expressao.length > 0) {
        return;
      }

      // fecha todas as respostas abertas a medida que filtra
      const respostas = listaPerguntas.querySelectorAll("dd");
      respostas.forEach((resposta) => {
        resposta.classList.remove("ativa");
        resposta.previousElementSibling
          .querySelector("button")
          .setAttribute("aria-expanded", "false");
      });

      let lista = listaPerguntas.getElementsByTagName("dl");

      let resultadosEncontrados = false;

      for (let posicao in lista) {
        if (true === isNaN(posicao)) {
          continue;
        }
        let conteudoLista = lista[posicao].innerHTML
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();
        if (true === conteudoLista.includes(expressao)) {
          lista[posicao].style.display = "";
          resultadosEncontrados = true;
        } else {
          lista[posicao].style.display = "none";
        }
      }

      // if (!resultadosEncontrados) {
      //   contateNos.style.display = "flex";
      //   inputPerguntas.style.marginBottom = "3rem";
      // } else {
      //   contateNos.style.display = "none";
      //   inputPerguntas.style.marginBottom = "0rem";
      // }
    });
  })();
});
