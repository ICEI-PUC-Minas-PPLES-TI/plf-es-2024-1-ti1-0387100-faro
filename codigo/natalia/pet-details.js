document.addEventListener('DOMContentLoaded', function() {
    // Obtém o nome do pet da URL
    var urlParams = new URLSearchParams(window.location.search);
    var nomePet = urlParams.get('pet');

    // Recupera os detalhes do pet do LocalStorage usando o nome do pet como chave
    var dadosPets = JSON.parse(localStorage.getItem('dadosPets'));
    var detalhesPet = dadosPets.find(function(pet) {
        return pet.nome === nomePet;
    });

    // Verifica se os detalhes do pet foram encontrados
    if (detalhesPet) {
        // Se os detalhes do pet existirem, faça algo com eles
        var contentDiv = document.getElementById('content');
        var card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${detalhesPet.foto}" alt="${detalhesPet.nome}">
            <div class="info">
                <h3>${detalhesPet.nome}</h3>
                <p><strong>Localização:</strong> ${detalhesPet.localizacao}</p>
                <p><strong>Telefone:</strong> ${detalhesPet.telefone}</p>
                <p><strong>Responsável:</strong> ${detalhesPet.responsavel}</p>
                <p><strong>Descrição:</strong> ${detalhesPet.descricao}</p>
            </div>
        `;
        contentDiv.appendChild(card);
    } else {
        // Se não houver detalhes do pet correspondentes ao nome fornecido na URL
        var contentDiv = document.getElementById('content');
        contentDiv.innerHTML = '<p>Não foi possível encontrar os detalhes do pet.</p>';
    }
});
