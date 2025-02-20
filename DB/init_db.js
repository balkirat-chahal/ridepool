const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', //DB password goes here
    database: 'ridepool',
    multipleStatements: true // Enables execution of multiple SQL statements
});

const createTables = `
CREATE TABLE IF NOT EXISTS Users (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    DOB DATE,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Vehicles (
    VID INT AUTO_INCREMENT PRIMARY KEY,
    make VARCHAR(50),
    model VARCHAR(50),
    year INT,
    ownerID INT,
    FOREIGN KEY (ownerID) REFERENCES Users(ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Rides (
    TID INT AUTO_INCREMENT PRIMARY KEY,
    driverID INT,
    from_street VARCHAR(100),
    from_city VARCHAR(50),
    from_province VARCHAR(50),
    to_street VARCHAR(100),
    to_city VARCHAR(50),
    to_province VARCHAR(50),
    from_lat DECIMAL(9,6),
    from_lng DECIMAL(9,6),
    to_lat DECIMAL(9,6),
    to_lng DECIMAL(9,6),
    date DATE,
    time TIME,
    type ENUM('single', 'pool'),
    seats INT CHECK (seats > 0),
    price DECIMAL(10,2),
    status ENUM('pending', 'confirmed', 'completed', 'canceled'),
    FOREIGN KEY (driverID) REFERENCES Users(ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Bookings (
    rideID INT,
    riderID INT,
    status ENUM('pending', 'confirmed', 'completed') NOT NULL DEFAULT 'pending',
    PRIMARY KEY (rideID, riderID),
    FOREIGN KEY (rideID) REFERENCES Rides(TID) ON DELETE CASCADE,
    FOREIGN KEY (riderID) REFERENCES Users(ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS RequestBookings (
    driverID INT,
    requestID INT,
    status ENUM('pending', 'confirmed', 'completed') NOT NULL DEFAULT 'pending',
    PRIMARY KEY (driverID, requestID),
    FOREIGN KEY (driverID) REFERENCES Users(ID) ON DELETE CASCADE,
    FOREIGN KEY (requestID) REFERENCES Requests(RID) ON DELETE CASCADE
);



CREATE TABLE IF NOT EXISTS Requests (
    RID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    from_street VARCHAR(100),
    from_city VARCHAR(50),
    from_province VARCHAR(50),
    to_street VARCHAR(100),
    to_city VARCHAR(50),
    to_province VARCHAR(50),
    from_lat DECIMAL(9,6),
    from_lng DECIMAL(9,6),
    to_lat DECIMAL(9,6),   
    to_lng DECIMAL(9,6),    
    price DECIMAL(10,2),
    date DATE,
    time TIME,
    FOREIGN KEY (userID) REFERENCES Users(ID) ON DELETE CASCADE
);
`;

connection.query(createTables, (err, results) => {
    if (err) {
        console.error('Error creating tables:', err);
    } else {
        console.log('Tables created successfully');
    }
    connection.end();
});
