//import necessary package
const express = require('express');
// Import built-in Node.js package 'path' to resolve path of files that are located on the server
const path = require('path');
const fs = require('fs');
const checkFile = require('./autoCreateFile.js');
// Helper method for generating unique ids
const uuid = require('./helpers/uuid');
// Specify on which port the Express.js server will run
const PORT = process.env.PORT || 3001;
// Initialize an instance of Express.js
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Static middleware pointing to the public folder
app.use(express.static('public'))

const JSON_FILE ='./db/db.json'
//checkFile.isFileExist(JSON_FILE) will determine whether or not data was created, if not it will create db.json
//once the application runs
checkFile.isFileExist(JSON_FILE);
// Create Express.js routes for default '/', '/notes' and '/api/notes' endpoints

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// Get route which sends back the notes.html page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);


app.get("/api/notes", function (req, res) {
    fs.readFile(JSON_FILE, "utf8", (err, data) => {
      var jsonData = JSON.parse(data);
      console.log(jsonData);
      res.json(jsonData);
    });

  });
  


  app.post("/api/notes", (req, res) => {
    console.info(`${req.method} request received to add a review`);
    const { title, text } = req.body;
    //check if req.body exists and has object with property title and text then....
    if (title && text) {
      const newReview = {
        title: title,
        text: text,
        id: uuid(),
      };
      
  
      // Obtain existing reviews
      fs.readFile(JSON_FILE, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedReviews = JSON.parse(data);
  
          // Add a new review
          parsedReviews.push(newReview);
  

          writeNewNoteToJson(JSON_FILE,parsedReviews)
        }
      });
  
      const response = {
        status: 'success',
        body: newReview,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting review');
    }
  });
  


  const writeNewNoteToJson = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (writeErr) =>
  writeErr
    ? console.error(writeErr)
    : console.info('Successfully updated reviews!')
  );

   //Delete route -> reads the db.json file, uses the json objects uniqids to match the object to be deleted, 
   //removes that object from the db.json file, then re-writes the db.json file
app.delete("/api/notes/:id",async(req, res) => {
  let id = req.params.id;
  let parsedData;
  fs.readFile(JSON_FILE, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      parsedData = JSON.parse(data);
      const filterData = parsedData.filter((note) => note.id !== id);
      writeNewNoteToJson(JSON_FILE, filterData);
      console.log(`Deleted note with ${req.params.id}`)
     
    
    }
  });
  res.send(`Deleted note with ${req.params.id}`);
  

});


// Wildcard route to direct users to a 404 page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './public/404.html'))
);


// listen() method is responsible for listening for incoming connections on the specified port 
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);



