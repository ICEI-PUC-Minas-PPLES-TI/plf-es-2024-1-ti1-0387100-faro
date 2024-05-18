document.addEventListener("DOMContentLoaded", function() {
  // Dados dos pets em formato JSON
  var dadosPets = [
    {
        "nome": "Fido",
        "localizacao": "Curitiba/PR",
        "foto": "assets/lost_and_found/fido.jpg",
        "telefone": "123-456-7890",
        "responsavel": "João da Silva",
        "descricao": "Fido sumiu hoje de manhã por volta das 08:00 quando saiu correndo pelo portão. Por favor, entre em contato se o viu...",
        "categoria": "perdido"
    },
    {
        "nome": "Rex",
        "localizacao": "Rio de Janeiro/RJ",
        "foto": "assets/lost_and_found/rex.jpg",
        "telefone": "987-654-3210",
        "responsavel": "Ana Souza",
        "descricao": "Rex é um cãozinho muito brincalhão e está desaparecido desde ontem à tarde. Ele é muito dócil e pode estar assustado.",
        "categoria": "perdido"
    },
    {
        "nome": "Bolinha",
        "localizacao": "Salvador/BA",
        "foto": "assets/lost_and_found/bolinha.jpg",
        "telefone": "987-654-3210",
        "responsavel": "Maria Souza",
        "descricao": "Bolinha é uma gatinha muito carinhosa e adora brincar com bolinhas de papel. Ela foi encontrada no parque ontem à noite.",
        "categoria": "perdido"
    },
    {
        "nome": "Toby",
        "localizacao": "Fortaleza/CE",
        "foto": "assets/lost_and_found/toby.jpg",
        "telefone": "987-654-3210",
        "responsavel": "Carlos Silva",
        "descricao": "Toby é um cãozinho muito amigável que foi encontrado perdido perto do supermercado. Ele é muito brincalhão e adora passear.",
        "categoria": "perdido"
    },
    {
        "nome": "Mel",
        "localizacao": "Porto Alegre/RS",
        "foto": "assets/lost_and_found/mel.jpg",
        "telefone": "987-654-3210",
        "responsavel": "Carlos Silva",
        "descricao": "Mel é uma cadelinha muito meiga e está disponível para adoção. Ela é vacinada e castrada.",
        "categoria": "doacao"
    },
    {
        "nome": "Sophie",
        "localizacao": "Recife/PE",
        "foto": "assets/lost_and_found/sophie.jpg",
        "telefone": "987-654-3210",
        "responsavel": "Maria Souza",
        "descricao": "Sophie é uma gatinha filhote encontrada abandonada na rua. Ela é muito brincalhona e está procurando um lar amoroso.",
        "categoria": "doacao"
    },
    {
        "nome": "Bella",
        "localizacao": "Belém/PA",
        "foto": "assets/lost_and_found/bella.jpg",
        "telefone": "987-654-3210",
        "responsavel": "Pedro Almeida",
        "descricao": "Bella é uma cadelinha encontrada em um parque. Ela é muito dócil e adora brincar com outros cachorros.",
        "categoria": "doacao"
    },
    {
        "nome": "Mia",
        "localizacao": "Manaus/AM",
        "foto": "assets/lost_and_found/mia.jpg",
        "telefone": "987-654-3210",
        "responsavel": "Joana Silva",
        "descricao": "Mia é uma gatinha que está procurando um lar. Ela é muito brincalhona e adora receber carinho.",
        "categoria": "doacao"
    },
    {
        "nome": "Lara",
        "localizacao": "João Pessoa/PB",
        "foto": "assets/lost_and_found/lara.jpg",
        "telefone": "987-654-3210",
        "responsavel": "Maria Souza",
        "descricao": "Foi achada perto do campinho, com bastante medo mas muito dócil! Tem uma pequena mancha branca no meio da barriga!",
        "categoria": "achado"
    },
    {
        "nome": "Snow",
        "localizacao": "Vitória/ES",
        "foto": "assets/lost_and_found/snow.jpg",
        "telefone": "987-654-3210",
        "responsavel": "Pedro Almeida",
        "descricao": "Snow é um cãozinho muito amigável encontrado no parque. Ele tem uma pelagem branca e adora brincar com outros cachorros.",
        "categoria": "achado"
    },
    {
        "nome": "Luna",
        "localizacao": "Porto Velho/RO",
        "foto": "assets/lost_and_found/luna.jpg",
        "telefone": "987-654-3210",
        "responsavel": "Joana Silva",
        "descricao": "Luna é uma gatinha dócil encontrada escondida em um arbusto. Ela tem olhos azuis e uma marca na cauda.",
        "categoria": "achado"
    },
    {
        "nome": "Simba",
        "localizacao": "Florianópolis/SC",
        "foto": "assets/lost_and_found/simba.jpg",
        "telefone": "987-654-3210",
        "responsavel": "Mariana Oliveira",
        "descricao": "Simba é um gatinho muito travesso encontrado na floresta. Ele tem uma juba bonita e é muito brincalhão.",
        "categoria": "achado"
    }
];

  // Armazena os dados no LocalStorage
  localStorage.setItem('dadosPets', JSON.stringify(dadosPets));

  // Recupera os dados dos pets do LocalStorage
var dadosPets = JSON.parse(localStorage.getItem('dadosPets'));

if (dadosPets) {
    var perdidosDiv = document.getElementById('perdidos');
    var achadosDiv = document.getElementById('achados');
    var doacaoDiv = document.getElementById('doacao');

    // Itera sobre os dados dos pets
    dadosPets.forEach(function(pet) {
        // Cria um card para o pet
        var card = document.createElement('div');
        card.classList.add('card');

        // Cria um elemento de imagem
        var img = document.createElement('img');
        img.src = pet.foto;
        img.alt = pet.nome;
        card.appendChild(img);

        // Cria um elemento de título
        var title = document.createElement('h3');
        title.textContent = pet.nome;
        card.appendChild(title);

        // Cria um elemento de localização
        var location = document.createElement('p');
        location.textContent = pet.localizacao;
        card.appendChild(location);

        // Adiciona um evento de clique ao card
        card.addEventListener('click', function() {
            handleCardClick(pet.nome);
        });

        // Decide em qual categoria adicionar o card
        if (pet.categoria === 'perdido') {
            card.classList.add('perdido');
            perdidosDiv.appendChild(card);
        } else if (pet.categoria === 'achado') {
            card.classList.add('achado');
            achadosDiv.appendChild(card);
        } else if (pet.categoria === 'doacao') {
            card.classList.add('doacao');
            doacaoDiv.appendChild(card);
        }
    });
}

// Função para lidar com o clique em um card
function handleCardClick(nomePet) {
    // Redireciona para uma nova página com os detalhes do pet
    window.location.href = 'pet-details.html?pet=' + encodeURIComponent(nomePet);
}


});
