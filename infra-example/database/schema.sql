CREATE TABLE
    IF NOT EXISTS purchases (
        id SERIAL PRIMARY KEY,
        purchase_name VARCHAR(255) NOT NULL,
        value DECIMAL(10, 2) NOT NULL,
        purchase_date DATE NOT NULL
    );

INSERT INTO
    purchases (purchase_name, value, purchase_date)
VALUES
    ('Computador', 5000.00, '2024-06-01'),
    ('Celular', 2500.50, '2024-06-15'),
    ('Fone', 299.99, '2024-06-20');