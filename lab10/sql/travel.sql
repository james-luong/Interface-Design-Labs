-- ============================================================
-- Lab 10: Travel Destinations - MySQL Setup Script
-- COS30043 Interface Design and Development
-- ============================================================
-- LOCAL:   mysql -u root -p < sql/travel.sql
-- MERCURY: mysql -u s104070337 -p's104070337_db' -h feenix-mariadb.swin.edu.au < sql/travel.sql
-- ============================================================

-- Local database (XAMPP). On Mercury the DB already exists, skip these two lines.
CREATE DATABASE IF NOT EXISTS lab10_travel;
USE lab10_travel;

CREATE TABLE IF NOT EXISTS destinations (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)   NOT NULL,
    country     VARCHAR(100)   NOT NULL,
    category    VARCHAR(50)    NOT NULL,
    description TEXT,
    rating      DECIMAL(2,1)   NOT NULL DEFAULT 0.0
);

-- Seed data from travel.csv
INSERT INTO destinations (name, country, category, description, rating) VALUES
('Bondi Beach',       'Australia',   'Ocean',    'Popular beach in Sydney known for surfing and coastal walks.',        4.8),
('Mount Fuji',        'Japan',       'Mountain', 'Iconic volcano and Japans highest mountain.',                       4.9),
('Great Barrier Reef','Australia',   'Ocean',    'Worlds largest coral reef system with diverse marine life.',        4.9),
('Swiss Alps',        'Switzerland', 'Mountain', 'Famous mountain range known for skiing and alpine scenery.',          4.8),
('Paris',             'France',      'City',     'Historic city known for the Eiffel Tower and rich culture.',          4.7),
('Maldives',          'Maldives',    'Beach',    'Tropical island destination with clear waters and coral reefs.',      4.9),
('New York',          'USA',         'City',     'Major global city famous for landmarks and entertainment.',           4.7),
('Banff National Park','Canada',     'Mountain', 'Beautiful park with lakes, mountains and wildlife.',                  4.8),
('Phuket',            'Thailand',    'Beach',    'Island destination known for beaches and nightlife.',                 4.6),
('Santorini',         'Greece',      'Beach',    'Famous for white houses and blue domes.',                            4.8),
('Rome',              'Italy',       'City',     'Historic city with ancient monuments and rich culture.',              4.7),
('Himalayas',         'Nepal',       'Mountain', 'Home to the highest mountains in the world.',                        4.9),
('Barcelona',         'Spain',       'City',     'City known for unique architecture and culture.',                    4.7),
('Waikiki Beach',     'USA',         'Beach',    'Famous beach in Hawaii with clear water and resorts.',               4.8),
('Blue Mountains',    'Australia',   'Mountain', 'Mountain region near Sydney known for dramatic scenery.',            4.7);
