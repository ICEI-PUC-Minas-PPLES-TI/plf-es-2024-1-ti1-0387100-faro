let map;
let markers = [];
let infowindow;

function initMap() {
    // Limpar localStorage e marcadores ao inicializar o mapa
    localStorage.clear();
    clearMarkers();
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -19.9167, lng: -43.9345 }, // Centro de Belo Horizonte
        zoom: 12
    });
    infowindow = new google.maps.InfoWindow();
    loadEstablishmentsFromLocalStorage(); 
    console.log('Markers after initMap:', markers); // Adicionado para verificar os marcadores
}

function updateMap(serviceType) {
    clearMarkers();
    let request = {
        location: map.getCenter(),
        radius: '100000', 
        type: 'pet_store', 
        keyword: '' // vazia para buscar todos os resultados
    };

    if (serviceType === 'alimentacao') {
        request.keyword = 'pet food'; 
    } else if (serviceType === 'farmacia') {
        request.type = ['veterinary_care']; 
        request.keyword = 'pet pharmacy'; 
    } else if (serviceType === 'petshop') {
        request.keyword = 'pet store'; 
    } else if (serviceType === 'hoteis') {
        request.keyword = 'pet hotel'; 
    }

    let service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            saveEstablishmentsToLocalStorage(results); // Armazenar dados dos estabelecimentos na localStorage
            results.forEach(place => {
                createMarker(place);
            });
            displayInfo(results); // Mostrar informações na tela
        } else {
            console.error('Error fetching places: ' + status);
        }
    });
}

function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    console.log('Markers after clearMarkers:', markers); // Adicionado para verificar os marcadores
}

function createMarker(place) {
    let marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name,
        placeId: place.place_id
    });
    google.maps.event.addListener(marker, 'click', function() {
        let photoUrl = place.photos && place.photos.length > 0 ? place.photos[0].getUrl() : '';
        let description = place.formatted_address || '';
        let googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat()},${place.geometry.location.lng()}&query_place_id=${place.place_id}`;
        let contentString = `<div>
                                <strong>${place.name}</strong><br>
                                ${photoUrl ? `<img src="${photoUrl}" alt="${place.name}" style="max-width: 100px; max-height: 100px;"><br>` : ''}
                                ${description ? `<p>${description}</p>` : ''}
                                <button class="btn-2" onclick="showInfo('${place.place_id}')">Mais Detalhes</button>
                             </div>`;
        infowindow.setContent(contentString);
        infowindow.open(map, this);
    });
    markers.push(marker);
}

function displayInfo(results) {
    let infoDiv = document.getElementById('info');
    infoDiv.innerHTML = '';
    results.forEach(place => {
        let description = place.formatted_address || '';
        let googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat()},${place.geometry.location.lng()}&query_place_id=${place.place_id}`;
        let contentString = `<div class="card">
                                <div class="card-content">
                                    <h5 class="card-title">${place.name}</h5>
                                    <p class="card-text"><strong>Endereço:</strong> ${place.vicinity || 'N/A'}</p>
                                    <a href="${googleMapsLink}" class="btn" target="_blank">Ver no Google Maps</a>
                                    <button class="btn" onclick="showInfo('${place.place_id}'); scrollToTop();">Mais Detalhes</button>
                                </div>
                            </div>`;
        infoDiv.innerHTML += contentString;
    });
}

function saveEstablishmentsToLocalStorage(establishments) {
    localStorage.setItem('establishments', JSON.stringify(establishments));
}

function loadEstablishmentsFromLocalStorage() {
    const establishments = JSON.parse(localStorage.getItem('establishments'));
    if (establishments) {
        establishments.forEach(place => {
            createMarker(place);
        });
        displayInfo(establishments);
    }
}

function showInfo(place_id) {
    let marker = markers.find(marker => marker.placeId === place_id);
    if (marker) {
        let request = {
            placeId: place_id,
            fields: ['name', 'formatted_address', 'formatted_phone_number', 'website', 'rating', 'reviews', 'photos']
        };
        let service = new google.maps.places.PlacesService(map);
        service.getDetails(request, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                let photoUrl = place.photos && place.photos.length > 0 ? place.photos[0].getUrl({ maxWidth: 300, maxHeight: 300 }) : null;
                let contentString = `<div>
                                        <p><strong>Foto de perfil</strong></p>
                                        ${photoUrl ? `<img src="${photoUrl}" alt="Foto de ${place.name}" style="width:30%;height:30%;">` : '<p>Não possui foto de perfil</p>'}
                                        <p><strong>Nome:</strong> ${place.name || 'N/A'}</p>
                                        <p><strong>Endereço:</strong> ${place.formatted_address || 'N/A'}</p>
                                        <p><strong>Telefone:</strong> ${place.formatted_phone_number || 'N/A'}</p>
                                        <p><strong>Website:</strong> <a href="${place.website || '#'}" target="_blank">${place.website || 'N/A'}</a></p>
                                        <p><strong>Classificação:</strong> ${place.rating || 'N/A'}</p>
                                        <p><strong>Avaliações:</strong></p>
                                        <ul>
                                        ${place.reviews ? place.reviews.map(review => `<li>${review.text}</li>`).join('') : '<li>Nenhuma avaliação disponível.</li>'}
                                        </ul>
                                    </div>`;
                infowindow.setContent(contentString);
                infowindow.open(map, marker);

                document.getElementById('map').scrollIntoView({ behavior: 'smooth' });
            } else {
                console.error('Error fetching place details: ' + status);
            }
        });
    } else {
        console.error('Marker not found for place ID: ' + place_id);
    }
}

function searchCity() {
    const city = document.querySelector('.search-input').value;

    // Cria uma solicitação para buscar a cidade usando a API de Geocodificação do Google
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: city }, (results, status) => {
        if (status === 'OK') {
            const location = results[0].geometry.location;
            map.setCenter(location);
            updateMap();
        } else {
            console.error('Erro ao buscar cidade:', status);
        }
    });
}

document.querySelector('.search-button').addEventListener('click', searchCity);

window.onload = initMap;
