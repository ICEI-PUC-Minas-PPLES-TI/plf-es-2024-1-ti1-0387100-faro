document.addEventListener("DOMContentLoaded", function () {
  (function () {
    const html = document.documentElement;
    const buttonMobile = document.getElementById("button-mobile");
    const menuMobile = document.getElementById("menu");
    const outside = "data-outside";
    const events = ["click", "touchstart"]; // Eventos que queremos ouvir

    function toggleMenu() {
      menuMobile.classList.toggle("ativa");
      buttonMobile.classList.toggle("button-mobile-posicao");
      buttonMobile.classList.toggle("fechar");

      if (menuMobile.classList.contains("ativa")) {
        setTimeout(() => {
          events.forEach((event) => {
            html.addEventListener(event, handleOutsideClick);
          });
        });
      } else {
        events.forEach((event) => {
          html.removeEventListener(event, handleOutsideClick);
        });
      }
    }

    function handleOutsideClick(event) {
      if (
        !menuMobile.contains(event.target) &&
        !buttonMobile.contains(event.target)
      ) {
        menuMobile.classList.remove("ativa");
        buttonMobile.classList.remove("button-mobile-posicao");
        buttonMobile.classList.remove("fechar");

        events.forEach((event) => {
          html.removeEventListener(event, handleOutsideClick);
        });
      }
    }

    function handleResize() {
      if (window.innerWidth > 768) {
        // Ajuste para o breakpoint desejado
        menuMobile.classList.remove("ativa");
        buttonMobile.classList.remove("button-mobile-posicao");
        buttonMobile.classList.remove("fechar");

        events.forEach((event) => {
          html.removeEventListener(event, handleOutsideClick);
        });
      }
    }

    buttonMobile.addEventListener("click", toggleMenu);
    window.addEventListener("resize", handleResize); // Adiciona evento para redimensionamento da janela
  })();

  /* farum */

  (function () {
    // Função para criar o carrossel
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

        items[currentItem].scrollIntoView({
          inline: "center",
          behavior: "smooth",
          block: "nearest",
        });
        // Adicionando estilo no current-item:
        items[currentItem].classList.add("current-item");
      });
    });

    // URL do JSON
    const url_BASE = "./data/sliderFarum.json";

    // Função para carregar os slides do JSON e preencher o carrossel
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

    // Função para preencher o carrossel com os slides
    function acrescentarSlides(slides) {
      const carrossel = document.querySelector(".farum-carrosel");
      carrossel.innerHTML = ""; // Limpar qualquer conteúdo existente

      slides.forEach((slide, index) => {
        const div = document.createElement("div");
        div.classList.add("farum-card", "item");
        if (index === 0) {
          div.classList.add("current-item");
        }

        div.innerHTML = `
      <div class="farum-card-foto">
        <img src="${slide.imagem}" alt="${slide.titulo}">
      </div>
      <div class="farum-card-texto">
        <h3>${slide.titulo}</h3>
        <p>${slide.descricao}</p>
      </div>
    `;

        carrossel.appendChild(div);
      });

      totalItems = slides.length; // Atualizar o total de itens
    }

    // Chama a função para carregar os slides ao iniciar
    carregarSlides();
  })();

  /* faq */
  (function () {
    // Garantir que o elemento "listaFaq" existe
    const lista = document.getElementById("listaFaq");
    if (!lista) {
      console.error('Elemento "listaFaq" não encontrado!');
      return;
    }

    const url_BASE = "./data/perguntasFarum.json";
    const numero_inicial_perguntas = 8; // ao acessar o sistema a lista vai mostrar só 8 perguntas puxadas do json

    async function carregarDados() {
      //carregando a lista de perguntas pelos dados do json, nessa função também fiz a estruturação do html com base no json
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
      // função para adicionar o evento de clique para abrir e fechar as perguntas que forem filtradas
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

  (function () {
    // Perguntas frequentes abrir/fechar
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

  (function () {
    // filtrando perguntas de acordo com o que o usuário colocar no input de busca
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

      // fecha todas as respostas abertas a medida que filtro
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
