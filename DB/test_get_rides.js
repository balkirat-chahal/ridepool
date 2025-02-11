const mysql = require('mysql');

// Create a mock MySQL connection
const db = mysql.createConnection({
  host: 'your-database-host',
  user: 'your-database-username',
  password: 'your-database-password',
  database: 'your-database-name'
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
  
  // Edmonton and Calgary coordinates
  const fromCoords = [-113.4909, 53.5444]; // Edmonton (lng, lat)
  const toCoords = [-114.0719, 51.0447];   // Calgary (lng, lat)
  
  const from = "Edmonton";
  const to = "Calgary";
  const date = "2025-02-10"; // Example date
  
  // SQL query to fetch closest rides using Euclidean distance
  const query = `
    SELECT *, 
      (SQRT(POW(from_lat - ?, 2) + POW(from_lng - ?, 2)) + 
       SQRT(POW(to_lat - ?, 2) + POW(to_lng - ?, 2))) AS total_distance
    FROM Rides
    WHERE from_city = ? AND to_city = ? AND date = ?
    ORDER BY total_distance ASC
  `;
  
  // Running the query
  db.query(query, 
    [fromCoords[1], fromCoords[0], toCoords[1], toCoords[0], from, to, date], 
    (err, results) => {
      if (err) {
        console.error("Error fetching rides:", err);
        return;
      }
      console.log("Fetched ride results:", results);
      db.end();
    }
  );
});
