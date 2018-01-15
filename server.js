var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();


// Dependencies
var path = require("path");


// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;

/*
mongoose.connect("mongodb://localhost/hugh-scraper", {
  useMongoClient: true
});
*/

// heroku
mongoose.connect("mongodb://heroku_dqs126r3:gtghhunrqqg00evv1f79jlq80l@ds245277.mlab.com:45277/heroku_dqs126r3",{
  useMongoClient: true
});


// Routes
app.get("/saved", function(req, res){
  res.sendFile(path.join(__dirname, "./public/saved.html"));
});

// A GET route for scraping the echojs website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("http://www.echojs.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    var articles =[];

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
      
      /*
      articles.push({
          title: title,
          link: link
      });

      console.log(articles);
      
      */

      // Create a new Article using the `result` object built from scraping
      db.Article
        .create(result)
        .then(function(dbArticle) {
          // If we were able to successfully scrape and save an Article, send a message to the client
          res.send("Scrape Complete");
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
    });

  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article
    .find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article
    .findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Route for getting all Notes from the db
app.get("/notes", function(req, res) {
  // Grab every document in the Articles collection
  db.Note
    .find({})
    .then(function(dbNote) {
      // If we were able to successfully find Notes, send them back to the client
      res.json(dbNote);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.get("/notes/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Note
    .find({ article_id: req.params.id })
    .then(function(dbNotes) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbNotes);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/notes/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note
    .create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Note.create({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});



// Route for getting all Articles from the web and not db
app.get("/newArticles", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("http://www.echojs.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    var articles =[];

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
      
      articles.push(result);

      console.log(articles);
      //res.json(response);
      
    });

    res.json(articles);

  });
});


// Route for saving an Article
app.post("/scrapeArticle", function(req, res) {
  // Create a new note and pass the req.body to the entry
  console.log(req.body);
  db.Article
    .create(req.body)
    .then(function(dbNote) {
      // If we were able to successfully scrape and save an Note, send a message to the client
      res.send("Note Saved");
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Delete Article
app.post("/deleteArticle", function(req, res) {
  console.log(req.body);
  db.Article.remove(req.body).then(function(dbArticle) {_id:req.id});
});


// Delete Note
app.post("/deleteNote", function(req, res) {
  console.log(req.body);
  db.Note.remove(req.body).then(function(dbNote) {_id:req.id});
});