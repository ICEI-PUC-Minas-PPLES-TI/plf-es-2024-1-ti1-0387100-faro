document.addEventListener("DOMContentLoaded", function () {
  /* farum */

  (function () {
    const controles = document.querySelectorAll(".controle");
    let currentItem = 0;
    const items = document.querySelectorAll(".farum-carrosel .item");
    const totalItems = items.length;

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

        items.forEach((item) => item.classList.remove("current-item"));

        items[currentItem].scrollIntoView({
          inline: "center",
          behavior: "smooth",
          block: "nearest",
        });
        //adicionando estilo no current-item:
        items[currentItem].classList.add("current-item");
      });
    });
  })();

  (function () {
    // Garantir que o elemento "listaFaq" existe
    const lista = document.getElementById("listaFaq");
    if (!lista) {
      console.error('Elemento "listaFaq" não encontrado!');
      return;
    }

    const URL_BASE = "/data/perguntasFarum.json";
    const NUMERO_INICIAL_PERGUNTAS = 8; // Número de perguntas a serem exibidas inicialmente

    async function carregarDados() {
      try {
        const resposta = await fetch(URL_BASE);

        if (!resposta.ok) {
          throw new Error("Não foi possível carregar os dados!");
        }
        const novasPerguntas = await resposta.json();
        popularLista(novasPerguntas);
        adicionarEventosPerguntas(); // Adicionada a chamada para adicionar eventos de clique
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

        const id = `pergunta${i + 1}`; // Gerar um ID único para cada pergunta

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

        if (i >= NUMERO_INICIAL_PERGUNTAS) {
          dl.style.display = "none";
        }

        lista.appendChild(dl);
      }
      console.log("Lista populada com sucesso!");
    }

    function adicionarEventosPerguntas() {
      // Nova função para adicionar eventos de clique aos botões
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
    // Filtrando perguntas
    const inputPerguntas = document.getElementById("pesquisaInput");
    const listaPerguntas = document.getElementById("listaFaq");
    const contateNos = document.querySelector(".contato");

    inputPerguntas.addEventListener("keyup", () => {
      let expressao = inputPerguntas.value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      if (expressao.length < 2 && expressao.length > 0) {
        return;
      }

      // Fechar todas as respostas abertas
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

      if (!resultadosEncontrados) {
        contateNos.style.display = "flex";
        inputPerguntas.style.marginBottom = "3rem";
      } else {
        contateNos.style.display = "none";
        inputPerguntas.style.marginBottom = "0rem";
      }
    });
  })();
});
