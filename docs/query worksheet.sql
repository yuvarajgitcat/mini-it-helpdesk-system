CREATE TABLE employees(employee_id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL, 
email VARCHAR(150) UNIQUE NOT NULL, 
department VARCHAR(100) NOT NULL);

ALTER TABLE employees ADD created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

SELECT * FROM employees;

INSERT INTO employees (name, email, department)
VALUES
('Rahul Kumar',
 'rahul@company.com',
 'Engineering');
INSERT INTO employees (name,email,department)
VALUES
('Maya Nair','maya@company.com','IT'),
('Arjun Rao','arjun@company.com','Finance');



 SHOW PORT;
 SHOW USERNAME;


CREATE TABLE assets (

    asset_id SERIAL PRIMARY KEY,

    asset_tag VARCHAR(30) UNIQUE NOT NULL,

    asset_type VARCHAR(50) NOT NULL,

    model VARCHAR(100),

    purchase_date DATE,

    status VARCHAR(30) DEFAULT 'ACTIVE'

);

INSERT INTO assets
(asset_tag,asset_type,model)
VALUES
('LAP-001','Laptop','Dell Latitude 7420');
INSERT INTO assets
(asset_tag,asset_type,model)
VALUES
('MON-014','Monitor','LG 27UK850'),
('PHN-003','Phone','iPhone 14');



 CREATE TABLE tickets (

    ticket_id SERIAL PRIMARY KEY,

    employee_id INTEGER NOT NULL,

    asset_id INTEGER,

    title VARCHAR(200) NOT NULL,

    description TEXT NOT NULL,

    priority VARCHAR(20) DEFAULT 'MEDIUM',

    status VARCHAR(30) DEFAULT 'OPEN',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_employee
        FOREIGN KEY(employee_id)
        REFERENCES employees(employee_id),

    CONSTRAINT fk_asset
        FOREIGN KEY(asset_id)
        REFERENCES assets(asset_id)

);

INSERT INTO tickets
(employee_id,asset_id,title,description,priority)
VALUES
(
2,
2,
'Wi-Fi disconnecting',
'Laptop loses Wi-Fi every 5 minutes',
'HIGH'
);

SELECT * FROM tickets;

CREATE TABLE ticket_history (

    history_id SERIAL PRIMARY KEY,

    ticket_id INTEGER NOT NULL,

    old_status VARCHAR(30),

    new_status VARCHAR(30) NOT NULL,

    changed_by INTEGER,

    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ticket
        FOREIGN KEY(ticket_id)
        REFERENCES tickets(ticket_id)
        ON DELETE CASCADE

);


