CREATE TABLE IF NOT EXISTS auto (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(255),
    model VARCHAR(255),
    state_number VARCHAR(100),
    vin_code VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS rent (
    id SERIAL PRIMARY KEY,
    auto_id INTEGER,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NUll ,
    created_date TIMESTAMP DEFAULT now(),
    price INTEGER,
    FOREIGN KEY (auto_id) REFERENCES auto (id)
);


