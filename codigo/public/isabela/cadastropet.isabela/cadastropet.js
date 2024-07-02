// Função para ler os dados do localStorage
function leDados() {
    const strDados = localStorage.getItem('db');
    if (strDados) {
        return JSON.parse(strDados);
    } else {
        return { Dados: [] };
    }
}

// Função para salvar os dados no localStorage
function salvaDados(dados) {
    localStorage.setItem('db', JSON.stringify(dados));
}

function imprimeDados() {
    const objDados = leDados();
    const tbody = document.querySelector('#petTable tbody');
    tbody.innerHTML = '';

    objDados.Dados.forEach((pet, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${pet.nome}</td>
            <td>${pet.genero}</td>
            <td>${pet.especie}</td>
            <td>${pet.datadenascimento}</td>
            <td>${pet.raca}</td>
            <td>${pet.cidade}</td>
            <td>${pet.objetivo}</td>
            <td><img src="${pet.foto}" alt="${pet.nome}" class="pet-foto"></td>
            <td>
                <button class="edit-btn" onclick="editarDado(${index})">Editar</button>
                <button class="delete-btn" onclick="excluirDado(${index})">Excluir</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

function incluirDados(event) {
    event.preventDefault();
    const objDados = leDados();

    // Cria um novo objeto com os valores dos campos do formulário
    const novoDado = {
        nome: document.getElementById('nome').value,
        genero: document.getElementById('genero').value,
        especie: document.getElementById('especie').value,
        datadenascimento: document.getElementById('datadenascimento').value,
        raca: document.getElementById('raca').value,
        cidade: document.getElementById('cidade').value,
        objetivo: document.getElementById('objetivo').value,
        foto: document.getElementById('foto').files[0] ? URL.createObjectURL(document.getElementById('foto').files[0]) : ''
    };

    const index = document.getElementById('salvar').dataset.index;
    if (index === undefined || index === '') {
        objDados.Dados.push(novoDado);
    } else {
        objDados.Dados[index] = novoDado;
        document.getElementById('salvar').dataset.index = '';
    }

    salvaDados(objDados);
    imprimeDados();
    document.querySelector('form').reset();
}


// Função para excluir um dado do localStorage
function excluirDado(index) {
    const objDados = leDados();
    objDados.Dados.splice(index, 1);
    salvaDados(objDados);
    imprimeDados();
}

// Função para editar um dado do localStorage
function editarDado(index) {
    const objDados = leDados();
    const dado = objDados.Dados[index];

    document.getElementById('nome').value = dado.nome;
    document.getElementById('genero').value = dado.genero;
    document.getElementById('especie').value = dado.especie;
    document.getElementById('datadenascimento').value = dado.datadenascimento;
    document.getElementById('raca').value = dado.raca;
    document.getElementById('cidade').value = dado.cidade;
    document.getElementById('objetivo').value = dado.objetivo;
    // A foto não pode ser preenchida diretamente no input

    document.getElementById('salvar').dataset.index = index;
}

document.getElementById('PetForm').addEventListener('submit', incluirDados);

// Imprime os dados ao carregar a página
imprimeDados();