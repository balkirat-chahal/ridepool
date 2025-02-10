import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ******** DB CONNECTION **********
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Change if using a different user
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

const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});

app.get("/api", (req, res) => {
    console.log("Received Request");
    res.send("Received Request");
});

// ******** API ENDPOINTS **********
app.get("/api/rides", (req, res) => {
    res.json({ message: "GET /api/rides - Dummy Response" });
});

app.get("/api/requests", (req, res) => {
    res.json({ message: "GET /api/requests - Dummy Response" });
});

app.post("/api/rides/new", (req, res) => {
    console.log("Received ride data:", req.body);
    res.json({ message: "POST /api/rides/new - Dummy Response", received: req.body });
});

app.post("/api/requests/new", (req, res) => {
    console.log("Request Data Received:", req.body);
    res.json({ message: "Request posted successfully", data: req.body });
});

app.get("/api/rides/:id", (req, res) => {
    res.json({ message: `GET /api/rides/${req.params.id} - Dummy Response` });
});

app.get("/api/requests/:id", (req, res) => {
    res.json({ message: `GET /api/requests/${req.params.id} - Dummy Response` });
});
