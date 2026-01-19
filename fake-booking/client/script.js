// KONFIGURACJA
// Jak wrzucisz na Render, zmień to na np. "https://twoja-apka.onrender.com"
const API_URL = "http://localhost:3000"; 

// --- 1. INICJALIZACJA (Uruchamia się po załadowaniu strony) ---
document.addEventListener('DOMContentLoaded', () => {
    setupDatePickers();
});

function setupDatePickers() {
    // Pobierz dzisiejszą datę w formacie YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    const dateFrom = document.getElementById('main-date-from');
    const dateTo = document.getElementById('main-date-to');

    if (dateFrom && dateTo) {
        // Blokujemy daty przeszłe
        dateFrom.setAttribute('min', today);
        dateTo.setAttribute('min', today);

        // Kiedy user wybierze datę przyjazdu, blokujemy dni wcześniejsze w dacie wyjazdu
        dateFrom.addEventListener('change', function() {
            dateTo.setAttribute('min', this.value);
            
            // Jeśli data wyjazdu była wcześniejsza, czyścimy ją
            if (dateTo.value && dateTo.value < this.value) {
                dateTo.value = '';
            }
        });
    }
}

// --- 2. WYSZUKIWANIE OFERT (GET) ---
async function handleSearch() {
    const city = document.getElementById('city-select').value;
    const dateFrom = document.getElementById('main-date-from').value;
    const dateTo = document.getElementById('main-date-to').value;

    // Prosta walidacja
    if (!city) {
        showToast("Wybierz miasto, byczku!");
        return;
    }
    if (!dateFrom || !dateTo) {
        showToast("Wybierz termin wyjazdu!");
        return;
    }

    try {
        // Fetch do backendu
        const response = await fetch(`${API_URL}/api/offers?city=${city}`);
        
        if (!response.ok) throw new Error("Błąd serwera");
        
        const offers = await response.json();
        renderOffers(offers, dateFrom, dateTo);

    } catch (error) {
        console.error("Błąd:", error);
        showToast("Nie udało się pobrać ofert. Sprawdź serwer.");
    }
}

// --- 3. RENDEROWANIE KART ---
function renderOffers(offers, dateFrom, dateTo) {
    const container = document.getElementById('offers-container');
    container.innerHTML = ''; // Czyścimy stare wyniki

    if (offers.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:40px; width:100%;"><h3>Brak ofert w tym mieście :(</h3><p>Spróbuj wybrać inne miasto.</p></div>';
        return;
    }

    offers.forEach(offer => {
        // Obliczamy liczbę nocy (prosta matematyka na datach)
        const d1 = new Date(dateFrom);
        const d2 = new Date(dateTo);
        const diffTime = Math.abs(d2 - d1);
        const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; 
        const totalPrice = nights * offer.price_per_night;

        const card = `
            <div class="offer-card">
                <img src="${offer.image_url || 'https://via.placeholder.com/240'}" class="offer-image" alt="${offer.name}">
                <div class="offer-details">
                    <div class="offer-header">
                        <div>
                            <h2 class="offer-title">${offer.name}</h2>
                            <span class="map-link" onclick="window.open('${offer.map_url}', '_blank')">
                                <i class="fa-solid fa-location-dot"></i> Pokaż na mapie
                            </span>
                        </div>
                        <div class="price-tag">
                            <div>${offer.price_per_night} PLN <small>/noc</small></div>
                        </div>
                    </div>
                    
                    <p style="font-size: 14px; color: #444; margin-top:15px; flex-grow:1;">${offer.description}</p>
                    
                    <div style="margin-top:auto; text-align:right; border-top: 1px solid #eee; padding-top:10px;">
                        <p style="font-size: 13px; color: #666; margin:0;">Cena za ${nights} noce:</p>
                        <p style="font-size: 18px; font-weight:bold; margin: 0 0 10px 0;">${totalPrice} PLN</p>
                        <button class="search-btn" style="padding: 10px 20px;" 
                            onclick="openBookingModal(${offer.id}, '${dateFrom}', '${dateTo}', ${totalPrice})">
                            Zobacz dostępność <i class="fa-solid fa-angle-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// --- 4. MODAL I REZERWACJA ---
let currentOfferId = null; // Zmienna pomocnicza

function openBookingModal(offerId, dateFrom, dateTo, price) {
    currentOfferId = offerId;
    
    // Ustawiamy wartości w formularzu modala
    document.getElementById('date-from').value = dateFrom;
    document.getElementById('date-to').value = dateTo;
    
    // Wyświetlamy cenę (jeśli masz taki element w HTML, jak w moim poprzednim kodzie)
    const priceSpan = document.getElementById('modal-price');
    if (priceSpan) priceSpan.innerText = price + " PLN";

    // Pokazujemy modal
    document.getElementById('booking-modal').classList.remove('hidden');
    document.getElementById('modal-overlay').classList.remove('hidden');

    // Przypisujemy akcję do przycisku
    const btn = document.getElementById('confirm-booking-btn');
    btn.onclick = submitBooking; // Resetujemy stary onclick
}

function closeModal() {
    document.getElementById('booking-modal').classList.add('hidden');
    document.getElementById('modal-overlay').classList.add('hidden');
    currentOfferId = null;
}

// --- 5. WYSYŁANIE REZERWACJI (POST) ---
async function submitBooking() {
    const userName = document.getElementById('user-name').value;
    const dateFrom = document.getElementById('date-from').value;
    const dateTo = document.getElementById('date-to').value;

    if (!userName) {
        showToast("Podaj imię i nazwisko!");
        return;
    }

    const bookingData = {
        offer_id: currentOfferId,
        client_name: userName,
        check_in: dateFrom,
        check_out: dateTo
    };

    try {
        const response = await fetch(`${API_URL}/api/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        if (response.ok) {
            closeModal();
            document.getElementById('user-name').value = ''; // Czyścimy pole
            showToast("Sukces! Zarezerwowano pobyt.");
        } else {
            showToast("Błąd! Coś poszło nie tak.");
        }
    } catch (error) {
        console.error("Błąd rezerwacji:", error);
        showToast("Błąd połączenia z serwerem.");
    }
}

// --- 6. POWIADOMIENIA (TOAST) ---
function showToast(message) {
    // Tworzymy element toasta dynamicznie (jeśli go nie ma w HTML) 
    // lub używamy istniejącego (jeśli dodałeś go do HTML wg poprzedniej instrukcji)
    let toast = document.getElementById('toast');
    
    // Jeśli nie ma go w HTML, stwórzmy go "w locie" (zabezpieczenie)
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast hidden';
        toast.innerHTML = '<i class="fa-solid fa-info-circle"></i> <span id="toast-message"></span>';
        document.body.appendChild(toast);
    }

    const msgSpan = toast.querySelector('#toast-message') || document.getElementById('toast-message');
    msgSpan.innerText = message;
    
    // Animacja wejścia
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Animacja wyjścia
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 300);
    }, 4000);
}