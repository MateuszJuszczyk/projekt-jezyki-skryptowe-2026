-- 1. Tworzymy tabelę ofert
CREATE TABLE offers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  description TEXT,
  price_per_night DECIMAL NOT NULL,
  image_url TEXT,
  map_url TEXT
);

-- 2. Tworzymy tabelę rezerwacji
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  offer_id INTEGER REFERENCES offers(id),
  client_name VARCHAR(255) NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Dodajemy przykładowe dane
INSERT INTO offers (name, city, description, price_per_night, image_url, map_url)
VALUES 
('Apartament Widokowy', 'Gdańsk', 'Piękny widok na Motławę.', 250, 'https://placehold.co/600x400', 'https://www.google.com/maps/embed?...'),
('Chatka w lesie', 'Zakopane', 'Cisza, spokój i góry.', 350, 'https://placehold.co/600x400', 'https://www.google.com/maps/embed?...'),
('Mieszkanie w Centrum', 'Warszawa', 'Blisko metra i kawiarni.', 200, 'https://placehold.co/600x400', 'https://www.google.com/maps/embed?...');