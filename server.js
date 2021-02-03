// Dependencies
// =============================================================
const express = require("express")

const path = require('path')
const fs = require("fs")

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set static folder
app.use(express.static('public'))

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

// Save new note
app.post("/api/notes", function (req, res) {

    // read the db.json file and add the new note
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }

        // change db data to js object
        const dbNotes = JSON.parse(data)

        // find next id value by finding the max id value in the db.json file
        let nextId = 0;

        dbNotes.forEach(note => {
            if (note.id >= nextId) {
                nextId = parseInt(note.id) + 1;
            }
        });

        // create newNote db object
        const newNote = {
            id: String(nextId),
            title: req.body.title,
            text: req.body.text
        }

        // add new note to db object
        dbNotes.push(newNote)

        // // write to db.json file
        fs.writeFile('db/db.json', JSON.stringify(dbNotes), 'utf8', (err, data) => {
            if (err) {
                console.error(err)
                return
            }

            return res.json(JSON.stringify(newNote))

        })

    })

});

// Delete a note given the ID
app.delete("/api/notes/:id", function (req, res) {

    // ID corresponding to the note (object) that should be deleted
    const idDelete = req.params.id;

    // Read db.json using fs and set to variable
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }

        // change db data to js object
        const dbNotes = JSON.parse(data)

        // find index to remove from dbNotes object
        const index = dbNotes.findIndex((dbNotes) => {
            
            return dbNotes.id === idDelete;
        })

        // remove note based on index
        dbNotes.splice(index, 1)

        // // Save new object to db.json file
        fs.writeFile('db/db.json', JSON.stringify(dbNotes), 'utf8', (err, data) => {
            if (err) {
                console.error(err)
                return
            }

            return res.sendStatus(200)

        })

    })
})

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
