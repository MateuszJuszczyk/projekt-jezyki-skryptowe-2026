async function handleSearch() {
    const city = document.getElementById('city-select').value;
    const res = await fetch(`/api/offers?city=${city}`);
    const offers = await res.json();
    
    const container = document.getElementById('offers-container');
    container.innerHTML = ''; // czyścimy poprzednie wyniki

    offers.forEach(offer => {
        container.innerHTML += `
            <div class="card">
                <img src="${offer.image_url}" width="200">
                <h2>${offer.name}</h2>
                <p>${offer.description}</p>
                <p>Cena: ${offer.price_per_night} PLN</p>
                <button onclick="showBookingForm(${offer.id})">Rezerwuj</button>
            </div>
        `;
    });
}

function showBookingForm(offerId) {
    document.getElementById('booking-modal').style.display = 'block';
    document.getElementById('confirm-booking-btn').onclick = () => submitBooking(offerId);
}

async function submitBooking(offerId) {
    const bookingData = {
        offer_id: offerId,
        client_name: document.getElementById('user-name').value,
        check_in: document.getElementById('date-from').value,
        check_out: document.getElementById('date-to').value
    };

    const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
    });

    if (res.ok) alert('Zarezerwowano pomyślnie!');
}