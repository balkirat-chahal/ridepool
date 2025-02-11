const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_new_password', // DB password goes here
    database: 'ridepool',
    multipleStatements: true
});

const insertData = `
INSERT INTO Users (first_name, last_name, DOB, email, password) VALUES
('John', 'Doe', '1990-05-15', 'john.doe@example.com', 'hashedpassword1'),
('Jane', 'Smith', '1995-08-22', 'jane.smith@example.com', 'hashedpassword2'),
('Alice', 'Brown', '1988-12-10', 'alice.brown@example.com', 'hashedpassword3'),
('Bob', 'Miller', '1992-07-30', 'bob.miller@example.com', 'hashedpassword4'),
('Charlie', 'Davis', '1998-02-17', 'charlie.davis@example.com', 'hashedpassword5');

INSERT INTO Vehicles (make, model, year, ownerID) VALUES
('Toyota', 'Camry', 2018, 1),
('Honda', 'Civic', 2020, 2),
('Ford', 'Focus', 2017, 3),
('Chevrolet', 'Malibu', 2019, 4),
('Nissan', 'Altima', 2021, 5);

INSERT INTO Rides (driverID, from_street, from_city, from_province, to_street, to_city, to_province, from_lat, from_lng, to_lat, to_lng, date, time, type, seats, price, status) VALUES
(1, '123 Main St', 'Edmonton', 'AB', '456 Oak St', 'Calgary', 'AB', 53.5461, -113.4938, 51.0447, -114.0719, '2025-02-10', '08:00:00', 'single', 3, 50.00, 'pending'),
(2, '789 Pine St', 'Vancouver', 'BC', '101 Maple St', 'Victoria', 'BC', 49.2827, -123.1207, 48.4284, -123.3656, '2025-02-11', '09:30:00', 'pool', 4, 40.00, 'confirmed'),
(3, '234 Elm St', 'Toronto', 'ON', '567 Cedar St', 'Ottawa', 'ON', 43.6532, -79.3832, 45.4215, -75.6972, '2025-02-12', '07:45:00', 'single', 2, 60.00, 'completed'),
(4, '678 Birch St', 'Montreal', 'QC', '910 Spruce St', 'Quebec City', 'QC', 45.5017, -73.5673, 46.8139, -71.2082, '2025-02-13', '10:15:00', 'pool', 5, 55.00, 'pending'),
(5, '135 Walnut St', 'Halifax', 'NS', '246 Chestnut St', 'Fredericton', 'NB', 44.6488, -63.5752, 45.9636, -66.6431, '2025-02-14', '12:00:00', 'single', 3, 70.00, 'confirmed');

INSERT INTO Requests (userID, from_street, from_city, from_province, to_street, to_city, to_province, from_lat, from_lng, to_lat, to_lng, price, date, time) VALUES
(2, '333 River St', 'Edmonton', 'AB', '777 Sky St', 'Calgary', 'AB', 53.5461, -113.4938, 51.0447, -114.0719, 45.00, '2025-02-10', '08:30:00'),
(3, '999 Hill St', 'Vancouver', 'BC', '111 Ocean St', 'Victoria', 'BC', 49.2827, -123.1207, 48.4284, -123.3656, 35.00, '2025-02-11', '10:00:00'),
(4, '222 Park St', 'Toronto', 'ON', '555 Lake St', 'Ottawa', 'ON', 43.6532, -79.3832, 45.4215, -75.6972, 55.00, '2025-02-12', '08:00:00'),
(5, '888 Forest St', 'Montreal', 'QC', '666 Garden St', 'Quebec City', 'QC', 45.5017, -73.5673, 46.8139, -71.2082, 50.00, '2025-02-13', '11:00:00'),
(1, '444 Meadow St', 'Halifax', 'NS', '777 Sunset St', 'Fredericton', 'NB', 44.6488, -63.5752, 45.9636, -66.6431, 65.00, '2025-02-14', '12:30:00');
`;

connection.query(insertData, (err, results) => {
    if (err) {
        console.error('Error inserting data:', err);
    } else {
        console.log('Sample data inserted successfully');
    }
    connection.end();
});
