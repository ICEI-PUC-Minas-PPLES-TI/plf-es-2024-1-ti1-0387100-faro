document.addEventListener('DOMContentLoaded', function() {
    var petData = [
        {
            id: "123456",
            nome: "Rex",
            raca: "Labrador Retriever",
            foto: "./assets/lost_and_found/rex.jpg", // Adicionando a URL da imagem
            consultas_medicas: [
                {
                    data: "2024-05-10",
                    local: "Clínica Veterinária ABC",
                    endereco: "Rua das Flores, 123, São Paulo, SP"
                },
                {
                    data: "2024-06-15",
                    local: "Hospital Veterinário XYZ",
                    endereco: "Avenida dos Animais, 456, Rio de Janeiro, RJ"
                },
                {
                    data: "2024-06-20",
                    local: "Clínica Pet Saúde",
                    endereco: "Rua dos Bichos, 789, Belo Horizonte, MG"
                }
            ]
        },
        {
            id: "789012",
            nome: "Bella",
            raca: "Golden Retriever",
            foto: "./assets/lost_and_found/bella.jpg",
            consultas_medicas: [
                {
                    data: "2024-06-05",
                    local: "Veterinária Animal Feliz",
                    endereco: "Avenida dos Pássaros, 321, Curitiba, PR"
                },
                {
                    data: "2024-06-10",
                    local: "Hospital PetCare",
                    endereco: "Rua das Árvores, 654, Porto Alegre, RS"
                },
                {
                    data: "2024-06-15",
                    local: "Clínica Vida de Pet",
                    endereco: "Rua dos Amigos, 987, Florianópolis, SC"
                }
            ]
        }
    ];

    function generateCalendar(year, month) {
        const calendarEl = document.getElementById('calendar');
        calendarEl.innerHTML = '';

        const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

        // Adicionar cabeçalhos dos dias da semana
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.innerText = day;
            calendarEl.appendChild(dayHeader);
        });

        const firstDay = new Date(year, month).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Criar dias vazios antes do primeiro dia do mês
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'day';
            calendarEl.appendChild(emptyCell);
        }

        // Criar os dias do mês
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayCell = document.createElement('div');
            dayCell.className = 'day';
            dayCell.innerText = day;

            // Verificar se há uma consulta agendada para este dia
            const petWithConsultation = petData.find(pet => {
                return pet.consultas_medicas.some(consulta => consulta.data === dateStr);
            });

            // Se houver uma consulta, associar a imagem do pet a este dia
            if (petWithConsultation) {
                const petImage = document.createElement('img');
                petImage.src = petWithConsultation.foto;
                petImage.alt = petWithConsultation.nome;
                dayCell.appendChild(petImage);
            }

            calendarEl.appendChild(dayCell);
        }
    }

    function renderConsultationsList() {
        const consultationsListEl = document.getElementById('consultations-list');
        consultationsListEl.innerHTML = '';

        petData.forEach(pet => {
            const petContainer = document.createElement('div');
            petContainer.className = 'pet-container';

            const petImage = document.createElement('img');
            petImage.src = pet.foto;
            petImage.alt = pet.nome;
            petImage.className = 'pet-image';
            petContainer.appendChild(petImage);

            const petName = document.createElement('div');
            petName.innerText = pet.nome;
            petName.className = 'pet-name';
            petContainer.appendChild(petName);

            const consultations = document.createElement('ul');
            consultations.className = 'consultations-list';

            pet.consultas_medicas.forEach(consulta => {
                const consultaItem = document.createElement('li');
                consultaItem.innerHTML = `<strong>Data:</strong> ${consulta.data}<br>
                                          <strong>Local:</strong> ${consulta.local}<br>
                                          <strong>Endereço:</strong> ${consulta.endereco}`;
                consultations.appendChild(consultaItem);
            });

            petContainer.appendChild(consultations);

            const separator = document.createElement('hr');
            petContainer.appendChild(separator);

            consultationsListEl.appendChild(petContainer);
        });
    }

    const today = new Date();
    generateCalendar(today.getFullYear(), today.getMonth());
    renderConsultationsList();
});
