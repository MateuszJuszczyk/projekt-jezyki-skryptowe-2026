// Konfiguracja - zmień na URL z Render.com po deployu
const API_URL = "https://projekt-jezyki-skryptowe-2026.onrender.com"; 

// Funkcja główna: Wyszukiwanie ofert
async function handleSearch() {
    const city = document.getElementById('city-select').value;
    const dateFrom = document.getElementById('main-date-from').value;
    const dateTo = document.getElementById('main-date-to').value;

    if (!dateFrom || !dateTo) {
        alert("Wybierz daty, byczku!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/offers?city=${city}`);
        const offers = await response.json();
        
        renderOffers(offers, dateFrom, dateTo);
    } catch (error) {
        console.error("Błąd pobierania ofert:", error);
        alert("Serwer nie odpowiada. Sprawdź czy go odpaliłeś!");
    }
}

// Funkcja renderująca karty ofert w stylu Booking
function renderOffers(offers, dateFrom, dateTo) {
    const container = document.getElementById('offers-container');
    container.innerHTML = '';

    if (offers.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:20px;">Brak ofert w tym mieście. Spróbuj Gdańsk!</p>';
        return;
    }

    offers.forEach(offer => {
        const card = `
            <div class="offer-card">
                <img src="${offer.image_url || 'https://via.placeholder.com/240'}" class="offer-image" alt="nocleg">
                <div class="offer-details">
                    <div class="offer-header">
                        <div>
                            <h2 class="offer-title">${offer.name}</h2>
                            <span class="map-link" onclick="window.open('${offer.map_url}', '_blank')">Pokaż na mapie</span>
                        </div>
                        <div class="price-tag">PLN ${offer.price_per_night}</div>
                    </div>
                    <p style="font-size: 14px; color: #444; margin-top:15px;">${offer.description}</p>
                    <div style="margin-top:auto; text-align:right;">
                        <p style="font-size: 12px; color: #666;">Cena za cały pobyt</p>
                        <button onclick="openBookingModal(${offer.id}, '${dateFrom}', '${dateTo}')">Zobacz dostępność</button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// Obsługa Modala (Okna rezerwacji)
function openBookingModal(offerId, dateFrom, dateTo) {
    const modal = document.getElementById('booking-modal');
    const overlay = document.getElementById('modal-overlay');

    // Ustawiamy daty z wyszukiwarki do formularza rezerwacji
    document.getElementById('date-from').value = dateFrom;
    document.getElementById('date-to').value = dateTo;

    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');

    // Przypisujemy akcję do przycisku zatwierdzenia
    document.getElementById('confirm-booking-btn').onclick = () => submitBooking(offerId);
}

function closeModal() {
    document.getElementById('booking-modal').classList.add('hidden');
    document.getElementById('modal-overlay').classList.add('hidden');
}

// Wysyłanie rezerwacji do API (POST)
async function submitBooking(offerId) {
    const bookingData = {
        offer_id: offerId,
        client_name: document.getElementById('user-name').value,
        check_in: document.getElementById('date-from').value,
        check_out: document.getElementById('date-to').value
    };

    if (!bookingData.client_name) {
        alert("Podaj imię i nazwisko!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        if (response.ok) {
            alert("Zajebiście! Zarezerwowano.");
            closeModal();
        } else {
            alert("Coś poszło nie tak przy zapisie.");
        }
    } catch (error) {
        console.error("Błąd rezerwacji:", error);
    }
}