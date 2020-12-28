// Dependencies
// =============================================================
const express = require("express")
const nodemon = require("nodemon")

const path = require('path')
const fs = require("fs")

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
// =============================================================
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/api/notes", function (req, res) {

    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        return res.json(JSON.parse(data))
    })

});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
