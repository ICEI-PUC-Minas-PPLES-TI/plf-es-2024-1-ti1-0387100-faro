(function () {
  const html = document.documentElement;
  const buttonMobile = document.getElementById("button-mobile");
  const menuMobile = document.getElementById("menu");
  const outside = "data-outside";
  const events = ["click", "touchstart"]; // eventos que quero quando chamar events

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
      // condicao para nao dar bug quando o usuario tiver com o mobile aberto e maximizar a tela, antes o mobile ficava bugado e tentando aparecer
      menuMobile.classList.remove("ativa");
      buttonMobile.classList.remove("button-mobile-posicao");
      buttonMobile.classList.remove("fechar");

      events.forEach((event) => {
        html.removeEventListener(event, handleOutsideClick);
      });
    }
  }

  // adicionando os eventos
  buttonMobile.addEventListener("click", toggleMenu);
  window.addEventListener("resize", handleResize);
})();
