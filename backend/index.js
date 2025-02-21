import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import axios from 'axios';
import bcrypt from 'bcrypt';
import passport from 'passport';
import session from 'express-session';
import LocalStrategy from 'passport-local';
import cors from 'cors';

// Load environment variables
dotenv.config();

// ******** DB CONNECTION **********
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASS,
    database: 'ridepool'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// ******** APP SETUP **********
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});

// ******** PASSPORT CONFIGURATION **********
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    db.query('SELECT * FROM Users WHERE email = ?', [email], async (err, results) => {
        if (err) return done(err);
        if (results.length === 0) return done(null, false, { message: 'User not found' });

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return done(null, false, { message: 'Incorrect password' });

        return done(null, user);
    });
}));

passport.serializeUser((user, done) => done(null, user.ID));
passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM Users WHERE ID = ?', [id], (err, results) => {
        if (err) return done(err);
        return done(null, results[0]);
    });
});




// ******** MAP BOX ********
const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY; // Store this in your .env file

// Function to get coordinates from Mapbox API
const getCoordinates = async (location) => {
    console.log("Getting Coordinates from MAP BOX");
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        location
    )}.json?access_token=${MAPBOX_API_KEY}&limit=1&autocomplete=true&proximity=ip`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (!data.features.length) throw new Error("Location not found");

        const [lng, lat] = data.features[0].center;

        // Extract city name (fallback to the input if not found)
        let cityName = data.features[0].text; // Default to main feature name
        if (data.features[0].context) {
            for (const ctx of data.features[0].context) {
                console.log(ctx.id, ctx.text);
                if (ctx.id.startsWith("place")) {
                    cityName = ctx.text;
                    break;
                }
            }
        }
        console.log({lat, lng, cityName});
        return { lat, lng, city: cityName };
    } catch (error) {
        console.error("Error fetching coordinates:", error.message);
        return null;
    }
};

// Function to geocode
const geocode = async (location) => {
    console.log("Getting Coordinates from MAPBOX");
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${MAPBOX_API_KEY}&limit=1&autocomplete=true&proximity=ip`;
    
    try {
        const response = await axios.get(url);
        const data = response.data;
        if (data.features.length === 0) return { city: location };

        const feature = data.features[0];
        const [lng, lat] = feature.center;
        let city = null, province = null, street = null;

        feature.context.forEach((c) => {
            console.log(c.text);
            if (c.id.includes("place")) city = c.text;
            if (c.id.includes("region")) province = c.text;
            if (c.id.includes("neighborhood")) street = c.text;
        });

        return { lat, lng, city: city || location, province, street };
    } catch (error) {
        console.error("Error fetching coordinates:", error.message);
        return { city: location };
    }
};


// Function to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
};





// ******** API ROUTES ********

// ******** AUTH ROUTES **********
app.post('/api/signup', async (req, res) => {
    console.log("Signing Up");
    const { email, firstName, lastName, dob, password, make, model, year } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.query('INSERT INTO Users (first_name, last_name, DOB, email, password) VALUES (?, ?, ?, ?, ?)', 
        [firstName, lastName, dob, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const userID = result.insertId;
        db.query('INSERT INTO Vehicles (make, model, year, ownerID) VALUES (?, ?, ?, ?)', 
            [make, model, year, userID], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'User registered successfully' });
        });
    });
});

app.post('/api/login', passport.authenticate('local'), (req, res) => {
    console.log("Logged In");
    res.json({ message: 'Login successful', user: req.user });
});

app.get('/api', (req, res) => {
    console.log('Received Request');
    res.send('Received Request');
});

app.get('/api/authenticate', isAuthenticated, (req, res) => {
    res.send('Authenticated');
});

// Get Rides API
// Get Rides API
app.get("/api/rides", isAuthenticated, async (req, res) => {
    console.log("Request api /api/rides");
    const { from, to, date } = req.query;


    if (!from || !to || !date) {
        return res.status(400).json({ error: "Missing required query parameters for rides" });
    }

    // Get coordinates for from and to locations
    const fromCoords = await getCoordinates(from);
    const toCoords = await getCoordinates(to);

    if (!fromCoords || !toCoords) {
        return res.status(500).json({ error: "Failed to fetch coordinates" });
    }

    // Use extracted city names in SQL query
    const query = `
    SELECT Rides.*, 
           Users.first_name AS driver_first_name,
           Users.last_name AS driver_last_name,
           (ST_Distance_Sphere(POINT(from_lng, from_lat), POINT(?, ?)) + 
            ST_Distance_Sphere(POINT(to_lng, to_lat), POINT(?, ?))) AS total_distance
    FROM Rides
    LEFT JOIN Users ON Rides.driverID = Users.ID
    WHERE LOWER(Rides.from_city) = LOWER(?) 
      AND LOWER(Rides.to_city) = LOWER(?) 
      AND date = ?
    ORDER BY total_distance ASC
    `;

    db.query(
        query,
        [fromCoords.lng, fromCoords.lat, toCoords.lng, toCoords.lat, 
         fromCoords.city, toCoords.city, date],
        (err, results) => {
            // ... existing error handling ...
            console.log(results)
            res.json(results);
        }
    );
});

// Get Requests API
app.get("/api/requests", isAuthenticated, async (req, res) => {
    console.log("Request api /api/requests");
    const { from, to, date } = req.query;

    if (!from || !to || !date) {
        return res.status(400).json({ error: "Missing required query parameters for requests" });
    }

    // Get coordinates for from and to locations
    const fromCoords = await getCoordinates(from);
    const toCoords = await getCoordinates(to);

    if (!fromCoords || !toCoords) {
        return res.status(500).json({ error: "Failed to fetch coordinates" });
    }

    // Use extracted city names in SQL query
    const query = `
    SELECT Requests.*,
           Users.first_name AS requester_first_name,
           Users.last_name AS requester_last_name,
           (ST_Distance_Sphere(POINT(from_lng, from_lat), POINT(?, ?)) + 
            ST_Distance_Sphere(POINT(to_lng, to_lat), POINT(?, ?))) AS total_distance
    FROM Requests
    LEFT JOIN Users ON Requests.userID = Users.ID
    WHERE LOWER(Requests.from_city) = LOWER(?) 
      AND LOWER(Requests.to_city) = LOWER(?) 
      AND date = ?
    ORDER BY total_distance ASC
    `;

    db.query(
        query,
        [fromCoords.lng, fromCoords.lat, toCoords.lng, toCoords.lat, 
         fromCoords.city, toCoords.city, date],
        (err, results) => {
            // ... existing error handling ...
            res.json(results);
        }
    );
});

// My Rides API
app.get("/api/rides/my", isAuthenticated, async (req, res) => {
    console.log("Request api /api/rides/my");
    const query = `
    SELECT Rides.*, 
           Users.first_name AS driver_first_name,
           Users.last_name AS driver_last_name
    FROM Rides
    LEFT JOIN Users ON Rides.driverID = Users.ID
    WHERE Rides.driverID = ?
    `;

    db.query(
        query,
        [req.user.ID],
        (err, results) => {
            // ... existing error handling ...
            res.json(results);
        }
    );
});

// My Requests API
app.get("/api/requests/my", isAuthenticated, async (req, res) => {
    console.log("Request api /api/requests/my");
    const query = `
    SELECT Requests.*,
           Users.first_name AS requester_first_name,
           Users.last_name AS requester_last_name
    FROM Requests
    LEFT JOIN Users ON Requests.userID = Users.ID
    WHERE Requests.userID = ?
    `;

    db.query(
        query,
        [req.user.ID],
        (err, results) => {
            // ... existing error handling ...
            res.json(results);
        }
    );
});

// Confirm a ride booking (driver confirms)
app.post("/api/rides/confirm", isAuthenticated, async (req, res) => {
    console.log("Request api /api/rides/confirm");

    const [rideID, riderID] = req.body.id.split("-");

    const query = `
        UPDATE Bookings
        SET status = 'confirmed'
        WHERE rideID = ? AND riderID = ?
    `;

    db.query(query, [rideID, riderID], (err, result) => {
        if (err) {
            console.error("Error confirming ride booking:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.json({ message: "Ride booking confirmed" });
    });
});

// Confirm a request booking (user confirms)
app.post("/api/requests/confirm", isAuthenticated, async (req, res) => {
    console.log("Request api /api/requests/confirm");

    const [requestID, driverID] = req.body.id.split("-");

    const query = `
        UPDATE RequestBookings
        SET status = 'confirmed'
        WHERE driverID = ? AND requestID = ?
    `;

    db.query(query, [driverID, requestID], (err, result) => {
        if (err) {
            console.error("Error confirming request booking:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Request booking not found" });
        }
        res.json({ message: "Request booking confirmed" });
    });
});



app.post("/api/rides/new", isAuthenticated, async (req, res) => {
    console.log("Received ride data:", req.body);
    const { from, to, datetime, price, seats } = req.body;
    const driverID = req.user.ID; // Get user ID from authenticated request
    
    if (!from || !to || !datetime || !price || !seats || !driverID) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const fromCoords = await geocode(from);
    const toCoords = await geocode(to);
    
    if (!fromCoords.city || !toCoords.city) {
        return res.status(500).json({ error: "Failed to fetch city details" });
    }

    const [date, time] = datetime.split("T");

    const query = `INSERT INTO Rides (driverID, from_street, from_city, from_province, from_lat, from_lng, to_street, to_city, to_province, to_lat, to_lng, date, time, price, seats, status) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(query, [
        driverID,
        fromCoords.street || null, fromCoords.city, fromCoords.province || null, fromCoords.lat || null, fromCoords.lng || null,
        toCoords.street || null, toCoords.city, toCoords.province || null, toCoords.lat || null, toCoords.lng || null,
        date, time.replace(".000Z", ""), price, seats, "pending"
    ], (err) => {
        if (err) {
            console.error("Error inserting ride:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Ride posted successfully" });
    });
});

app.post("/api/requests/new", isAuthenticated, async (req, res) => {
    console.log("Request Data Received:", req.body);
    const { from, to, datetime, price } = req.body;
    const userID = req.user.ID; // Get user ID from authenticated request
    
    if (!from || !to || !datetime || !price || !userID) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const fromCoords = await geocode(from);
    const toCoords = await geocode(to);
    
    if (!fromCoords.city || !toCoords.city) {
        return res.status(500).json({ error: "Failed to fetch city details" });
    }

    const [date, time] = datetime.split("T");

    const query = `INSERT INTO Requests (userID, from_street, from_city, from_province, from_lat, from_lng, to_street, to_city, to_province, to_lat, to_lng, date, time, price) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(query, [
        userID,
        fromCoords.street || null, fromCoords.city, fromCoords.province || null, fromCoords.lat || null, fromCoords.lng || null,
        toCoords.street || null, toCoords.city, toCoords.province || null, toCoords.lat || null, toCoords.lng || null,
        date, time.replace(".000Z", ""), price
    ], (err) => {
        if (err) {
            console.error("Error inserting request:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Request posted successfully" });
    });
});


app.get("/api/rides/:id", isAuthenticated, (req, res) => {
    const rideId = req.params.id;

    const query = `
        SELECT R.*, U.first_name, U.last_name, U.email, V.make, V.model, V.year 
        FROM Rides R
        JOIN Users U ON R.driverID = U.ID
        JOIN Vehicles V ON U.ID = V.ownerID
        WHERE R.TID = ?
    `;

    db.query(query, [rideId], (err, rideResults) => {
        if (err) {
            console.error("Error fetching ride details:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (rideResults.length === 0) {
            return res.status(404).json({ message: "Ride not found" });
        }

        const rideData = rideResults[0];

        const responseData = {
            ride: {
                from: `${rideData.from_street}, ${rideData.from_city}, ${rideData.from_province}`,
                to: `${rideData.to_street}, ${rideData.to_city}, ${rideData.to_province}`,
                date: rideData.date,
                time: rideData.time,
                type: rideData.type,
                seats: rideData.seats,
                price: rideData.price,
                status: rideData.status,
                coordinates: {
                    from: { lat: rideData.from_lat, lng: rideData.from_lng },
                    to: { lat: rideData.to_lat, lng: rideData.to_lng }
                }
            },
            driver: {
                name: `${rideData.first_name} ${rideData.last_name}`,
                email: rideData.email
            },
            vehicle: {
                make: rideData.make,
                model: rideData.model,
                year: rideData.year
            }
        };

        res.json(responseData);
    });
});


app.get("/api/requests/:id", isAuthenticated, (req, res) => {
    const requestId = req.params.id;

    const query = `
        SELECT R.*, U.first_name, U.last_name, U.email 
        FROM Requests R
        JOIN Users U ON R.userID = U.ID
        WHERE R.RID = ?
    `;

    db.query(query, [requestId], (err, requestResults) => {
        if (err) {
            console.error("Error fetching request details:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (requestResults.length === 0) {
            return res.status(404).json({ message: "Request not found" });
        }

        const requestData = requestResults[0];

        const responseData = {
            request: {
                from: `${requestData.from_street}, ${requestData.from_city}, ${requestData.from_province}`,
                to: `${requestData.to_street}, ${requestData.to_city}, ${requestData.to_province}`,
                date: requestData.date,
                time: requestData.time,
                price: requestData.price,
                coordinates: {
                    from: { lat: requestData.from_lat, lng: requestData.from_lng },
                    to: { lat: requestData.to_lat, lng: requestData.to_lng }
                }
            },
            user: {
                name: `${requestData.first_name} ${requestData.last_name}`,
                email: requestData.email
            }
        };

        res.json(responseData);
    });
});

app.get("/api/ridebookings", isAuthenticated, (req, res) => {
    const driverID = req.user.ID;
    const query = `
        SELECT 
    CONCAT(r.TID, '-', u.ID) AS id,
    r.TID AS rideID,
    u.ID AS riderID,
    CONCAT(u.first_name, ' ', u.last_name) AS username,
    r.date AS fromDate,
    r.time AS fromTime,
    r.from_city AS fromCity,
    r.date AS toDate, 
    r.time AS toTime,
    r.to_city AS toCity,
    r.price,
    r.seats AS seatsLeft,
    b.status
FROM Bookings b
JOIN Rides r ON b.rideID = r.TID
JOIN Users u ON b.riderID = u.ID
WHERE r.driverID = ?;
    `;
    
    db.query(query, [driverID], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
        // Respond with the ride bookings for rides you are driving
        res.status(200).json({ bookings: results });
    });
});


app.post("/api/ridebookings/new", isAuthenticated, (req, res) => {
    const { rideID } = req.body;
    const riderID = req.user.ID;

    if (!rideID) {
        return res.status(400).json({ message: "Ride ID is required" });
    }

    // Check for existing booking
    const checkQuery = `
        SELECT * FROM Bookings 
        WHERE rideID = ? AND riderID = ?
    `;

    db.query(checkQuery, [rideID, riderID], (checkErr, checkResults) => {
        if (checkErr) {
            console.error("Database error:", checkErr);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (checkResults.length > 0) {
            return res.status(409).json({ message: "You already booked this ride" });
        }

        // Create new booking
        const insertQuery = `
            INSERT INTO Bookings (rideID, riderID, status)
            VALUES (?, ?, 'pending')
        `;

        db.query(insertQuery, [rideID, riderID], (insertErr, insertResults) => {
            if (insertErr) {
                console.error("Database error:", insertErr);
                return res.status(500).json({ message: "Internal server error" });
            }

            res.status(201).json({ 
                message: "Booking created successfully",
                booking: {
                    rideID,
                    riderID,
                    status: 'pending'
                }
            });
        });
    });
});


app.get("/api/requestbookings", isAuthenticated, (req, res) => {
    const userID = req.user.ID;
    const query = `
        SELECT 
    CONCAT(req.RID, '-', u.ID) AS id,
    u.ID AS driverID,
    CONCAT(u.first_name, ' ', u.last_name) AS username,
    req.from_city AS fromCity,
    req.to_city AS toCity,
    req.date,
    req.time,
    req.price,
    1 AS riders,  
    rb.status
FROM RequestBookings rb
JOIN Requests req ON rb.requestID = req.RID
JOIN Users u ON rb.driverID = u.ID
WHERE req.userID = ?;
    `;
    
    db.query(query, [userID], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
        // Respond with the driver offers on your requests
        res.status(200).json({ requestBookings: results });
    });
});


app.post("/api/requestbookings/new", isAuthenticated, (req, res) => {
    const { requestID } = req.body;
    const driverID = req.user.ID;

    if (!requestID) {
        return res.status(400).json({ message: "Request ID is required" });
    }

    // Check for existing offer
    const checkQuery = `
        SELECT * FROM RequestBookings 
        WHERE driverID = ? AND requestID = ?
    `;

    db.query(checkQuery, [driverID, requestID], (checkErr, checkResults) => {
        if (checkErr) {
            console.error("Database error:", checkErr);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (checkResults.length > 0) {
            return res.status(409).json({ message: "You have already made an offer for this request" });
        }

        // Create new offer
        const insertQuery = `
            INSERT INTO RequestBookings (driverID, requestID, status)
            VALUES (?, ?, 'pending')
        `;

        db.query(insertQuery, [driverID, requestID], (insertErr, insertResults) => {
            if (insertErr) {
                console.error("Database error:", insertErr);
                return res.status(500).json({ message: "Internal server error" });
            }

            res.status(201).json({ 
                message: "Offer created successfully",
                offer: {
                    driverID,
                    requestID,
                    status: 'pending'
                }
            });
        });
    });
});

app.get("/api/bookings", isAuthenticated, (req, res) => {
    const currentUserId = req.user.ID;
  
    // Query for all the rides/requests where the current user is driving
    const drivingQuery = `
      SELECT 
        CONCAT(r.TID, '-', u.ID) AS id,
        'ride' AS bookingType,
        r.TID AS bookingId,
        u.ID AS otherUserID,
        CONCAT(u.first_name, ' ', u.last_name) AS otherUsername,
        r.from_city AS fromCity,
        r.from_province AS fromProvince,
        r.from_lat,
        r.from_lng,
        r.to_city AS toCity,
        r.to_province AS toProvince,
        r.to_lat,
        r.to_lng,
        r.date,
        r.time,
        r.price,
        r.seats AS seatsLeft,
        b.status AS bookingStatus
      FROM Bookings b
      JOIN Rides r ON b.rideID = r.TID
      JOIN Users u ON b.riderID = u.ID
      WHERE r.driverID = ? AND b.status = 'confirmed'
      UNION ALL
      SELECT 
        CONCAT(req.RID, '-', u.ID) AS id,
        'request' AS bookingType,
        req.RID AS bookingId,
        u.ID AS otherUserID,
        CONCAT(u.first_name, ' ', u.last_name) AS otherUsername,
        req.from_city AS fromCity,
        req.from_province AS fromProvince,
        req.from_lat,
        req.from_lng,
        req.to_city AS toCity,
        req.to_province AS toProvince,
        req.to_lat,
        req.to_lng,
        req.date,
        req.time,
        req.price,
        NULL AS seatsLeft,
        rb.status AS bookingStatus
      FROM RequestBookings rb
      JOIN Requests req ON rb.requestID = req.RID
      JOIN Users u ON req.userID = u.ID
      WHERE rb.driverID = ? AND rb.status = 'confirmed'
    `;
  
    // Query for all the rides/requests where the current user is riding
    const ridingQuery = `
      SELECT 
        CONCAT(r.TID, '-', u.ID) AS id,
        'ride' AS bookingType,
        r.TID AS bookingId,
        u.ID AS otherUserID,
        CONCAT(u.first_name, ' ', u.last_name) AS otherUsername,
        r.from_city AS fromCity,
        r.from_province AS fromProvince,
        r.from_lat,
        r.from_lng,
        r.to_city AS toCity,
        r.to_province AS toProvince,
        r.to_lat,
        r.to_lng,
        r.date,
        r.time,
        r.price,
        r.seats AS seatsLeft,
        b.status AS bookingStatus
      FROM Bookings b
      JOIN Rides r ON b.rideID = r.TID
      JOIN Users u ON r.driverID = u.ID
      WHERE b.riderID = ? AND b.status = 'confirmed'
      UNION ALL
      SELECT 
        CONCAT(req.RID, '-', u.ID) AS id,
        'request' AS bookingType,
        req.RID AS bookingId,
        u.ID AS otherUserID,
        CONCAT(u.first_name, ' ', u.last_name) AS otherUsername,
        req.from_city AS fromCity,
        req.from_province AS fromProvince,
        req.from_lat,
        req.from_lng,
        req.to_city AS toCity,
        req.to_province AS toProvince,
        req.to_lat,
        req.to_lng,
        req.date,
        req.time,
        req.price,
        NULL AS seatsLeft,
        rb.status AS bookingStatus
      FROM RequestBookings rb
      JOIN Requests req ON rb.requestID = req.RID
      JOIN Users u ON rb.driverID = u.ID
      WHERE req.userID = ? AND rb.status = 'confirmed'
    `;
  
    // Execute the driving query first
    db.query(drivingQuery, [currentUserId, currentUserId], (err, drivingResults) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      // Then execute the riding query
      db.query(ridingQuery, [currentUserId, currentUserId], (err, ridingResults) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        // Send the combined response with separate driving and riding arrays.
        res.status(200).json({ driving: drivingResults, riding: ridingResults });
      });
    });
  });
  