document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var petData = [
        {
            id: "123456",
            nome: "Rex",
            raca: "Labrador Retriever",
            foto_url: "./assets/lost_and_found/rex.jpg",
            consultas_medicas: [
                {
                    data: "2023-05-10",
                    local: "Clínica Veterinária ABC",
                    endereco: "Rua das Flores, 123, São Paulo, SP"
                },
                {
                    data: "2023-08-15",
                    local: "Hospital Veterinário XYZ",
                    endereco: "Avenida dos Animais, 456, Rio de Janeiro, RJ"
                },
                {
                    data: "2023-11-20",
                    local: "Clínica Pet Saúde",
                    endereco: "Rua dos Bichos, 789, Belo Horizonte, MG"
                }
            ]
        },
        {
            id: "789012",
            nome: "Bella",
            raca: "Golden Retriever",
            foto_url: "./assets/lost_and_found/bella.jpg",
            consultas_medicas: [
                {
                    data: "2023-06-05",
                    local: "Veterinária Animal Feliz",
                    endereco: "Avenida dos Pássaros, 321, Curitiba, PR"
                },
                {
                    data: "2023-09-10",
                    local: "Hospital PetCare",
                    endereco: "Rua das Árvores, 654, Porto Alegre, RS"
                },
                {
                    data: "2023-12-15",
                    local: "Clínica Vida de Pet",
                    endereco: "Rua dos Amigos, 987, Florianópolis, SC"
                }
            ]
        }
    ];

    var events = [];
    petData.forEach(function(pet) {
        pet.consultas_medicas.forEach(function(consulta) {
            events.push({
                title: pet.nome,
                start: consulta.data,
                extendedProps: {
                    foto_url: pet.foto_url,
                    local: consulta.local,
                    endereco: consulta.endereco
                }
            });
        });
    });

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: events,
        eventContent: function(arg) {
            var fotoUrl = arg.event.extendedProps.foto_url;
            var img = document.createElement('img');
            img.src = fotoUrl;
            img.classList.add('pet-photo');
            var arrayOfDomNodes = [ img ];
            return { domNodes: arrayOfDomNodes };
        }
    });

    calendar.render();
});
