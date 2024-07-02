function leDados() {
    
    const strDados = localStorage.getItem('db');

    if (strDados) {
        return JSON.parse(strDados);
    } else {
        return { Dados: [] };
    }
}

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

    const novoDado = {
        nome: document.getElementById('nome').value,
        genero: document.getElementById('genero').value,
        especie: document.getElementById('especie').value,
        datadenascimento: document.getElementById('datadenascimento').value,
        raca: document.getElementById('raca').value,
        cidade: document.getElementById('cidade').value,
        objetivo: document.getElementById('objetivo').value,
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

function editarDado(index) {
    const objDados = leDados();
    const pet = objDados.Dados[index];

    document.getElementById('nome').value = pet.nome;
    document.getElementById('genero').value = pet.genero;
    document.getElementById('especie').value = pet.especie;
    document.getElementById('datadenascimento').value = pet.datadenascimento;
    document.getElementById('raca').value = pet.raca;
    document.getElementById('cidade').value = pet.cidade;
    document.getElementById('objetivo').value = pet.objetivo;

    document.getElementById('salvar').dataset.index = index;
}

function excluirDado(index) {
    const objDados = leDados();
    objDados.Dados.splice(index, 1);
    salvaDados(objDados);
    imprimeDados();
}

document.querySelector('form').addEventListener('submit', incluirDados);
window.onload = () => imprimeDados();