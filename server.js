var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.get("/scrape", function(req, res) {
  axios.get("https://old.reddit.com/r/webdev/").then(function(response) {
    var $ = cheerio.load(response.data);

    $("p.title").each(function(i, element) {
      var result = {};
      result.title = $(element).text();

      result.link = $(element)
        .children()
        .attr("href");

      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
  });

  console.log("Scrape Complete");
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
