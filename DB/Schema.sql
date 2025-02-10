CREATE TABLE Users (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    DOB DATE,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
);

CREATE TABLE Vehicles (
    VID INT AUTO_INCREMENT PRIMARY KEY,
    make VARCHAR(50),
    model VARCHAR(50),
    year INT,
    ownerID INT,
    FOREIGN KEY (ownerID) REFERENCES Users(ID) ON DELETE CASCADE
);

CREATE TABLE Rides (
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

CREATE TABLE Bookings (
    rideID INT,
    riderID INT,
    PRIMARY KEY (rideID, riderID),
    FOREIGN KEY (rideID) REFERENCES Rides(TID) ON DELETE CASCADE,
    FOREIGN KEY (riderID) REFERENCES Users(ID) ON DELETE CASCADE
);

CREATE TABLE Requests (
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
