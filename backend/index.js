import express from 'express';


// ******** APP SETUP **********
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});

app.get("/api", (req, res) => {
    console.log("Received Request");
})