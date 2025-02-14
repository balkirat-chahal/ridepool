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

// Get Rides API
// Get Rides API
app.get("/api/rides", async (req, res) => {
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
           (ST_Distance_Sphere(POINT(Rides.from_lng, Rides.from_lat), POINT(?, ?)) + 
            ST_Distance_Sphere(POINT(Rides.to_lng, Rides.to_lat), POINT(?, ?))) AS total_distance
    FROM Rides
    LEFT JOIN Users ON Rides.driverID = Users.ID
    WHERE LOWER(Rides.from_city) = LOWER(?) 
      AND LOWER(Rides.to_city) = LOWER(?) 
      AND Rides.date = ?
    ORDER BY total_distance ASC
    `;

    db.query(
        query,
        [fromCoords.lng, fromCoords.lat, toCoords.lng, toCoords.lat, fromCoords.city, toCoords.city, date],
        (err, results) => {
            if (err) {
                console.error("Error fetching rides:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.json(results);
        }
    );
});

// Get Requests API
app.get("/api/requests", async (req, res) => {
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
           (ST_Distance_Sphere(POINT(Requests.from_lng, Requests.from_lat), POINT(?, ?)) + 
            ST_Distance_Sphere(POINT(Requests.to_lng, Requests.to_lat), POINT(?, ?))) AS total_distance
    FROM Requests
    LEFT JOIN Users ON Requests.userID = Users.ID
    WHERE LOWER(Requests.from_city) = LOWER(?) 
      AND LOWER(Requests.to_city) = LOWER(?) 
      AND Requests.date = ?
    ORDER BY total_distance ASC
    `;

    db.query(
        query,
        [fromCoords.lng, fromCoords.lat, toCoords.lng, toCoords.lat, fromCoords.city, toCoords.city, date],
        (err, results) => {
            if (err) {
                console.error("Error fetching requests:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.json(results);
        }
    );
});


app.post("/api/rides/new", async (req, res) => {
    console.log("Received ride data:", req.body);
    const { from, to, datetime, price, seats } = req.body;
    
    if (!from || !to || !datetime || !price || !seats) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const fromCoords = await geocode(from);
    const toCoords = await geocode(to);
    
    if (!fromCoords.city || !toCoords.city) {
        return res.status(500).json({ error: "Failed to fetch city details" });
    }

    const [date, time] = datetime.split("T");

    const query = `INSERT INTO Rides (from_street, from_city, from_province, from_lat, from_lng, to_street, to_city, to_province, to_lat, to_lng, date, time, price, seats, status) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(query, [
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

app.post("/api/requests/new", async (req, res) => {
    console.log("Request Data Received:", req.body);
    const { from, to, datetime, price } = req.body;
    
    if (!from || !to || !datetime || !price) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const fromCoords = await geocode(from);
    const toCoords = await geocode(to);
    
    if (!fromCoords.city || !toCoords.city) {
        return res.status(500).json({ error: "Failed to fetch city details" });
    }

    const [date, time] = datetime.split("T");

    const query = `INSERT INTO Requests (from_street, from_city, from_province, from_lat, from_lng, to_street, to_city, to_province, to_lat, to_lng, date, time, price) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(query, [
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



app.get("/api/rides/:id", (req, res) => {
    res.json({ message: `GET /api/rides/${req.params.id} - Dummy Response` });
});

app.get("/api/requests/:id", (req, res) => {
    res.json({ message: `GET /api/requests/${req.params.id} - Dummy Response` });
});
