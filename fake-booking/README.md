# Projekt: System Rezerwacji Noclegów (Klient-Serwer)

## Podział prac

### Osoba A: Frontend (Klient)
* **Struktura HTML5:** Przygotowanie formularza wyszukiwania (3 miasta, daty, liczba osób).
* **Logika JavaScript (Fetch API):**
    * Obsługa żądania `GET` do pobrania ofert.
    * Dynamiczne renderowanie kart ofert (Nazwa, opis, cena, zdjęcie, mapa).
    * Obsługa żądania `POST` do wysyłania formularza rezerwacji.
* **Warstwa wizualna (CSS):** Stylizacja kart ofert, formularzy i stanów aplikacji (np. ukrywanie sekcji po wyszukaniu).
* **Walidacja:** Zapewnienie, że pola oznaczone jako obowiązkowe są wypełnione przed wysyłką.

### Osoba B: Backend (Serwer + DB)
* **Projekt Bazy Danych:** Stworzenie struktury relacyjnej (np. SQLite/MySQL) – tabele `offers` i `bookings`.
* **API (Node.js/Express lub inny):**
    * Endpoint `GET /offers`: filtrowanie danych z bazy na podstawie parametrów z frontendu.
    * Endpoint `POST /bookings`: walidacja danych i zapis rezerwacji do bazy.
* **Dostarczenie danych:** Przygotowanie skryptu `seed` lub `init.sql` z min. 6 gotowymi ofertami (po 2 na miasto).
* **CORS & Integracja:** Konfiguracja serwera tak, aby przyjmował żądania z portu frontendu.

---

## Struktura Repo
```text
/travel-app
├── /client
│   ├── index.html
│   ├── style.css
│   └── script.js
├── /server
│   ├── server.js
│   ├── db_config.js
│   └── init.sql
└── README.md