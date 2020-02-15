var express = require("express");
var mongojs = require("mongojs");
var cheerio = require("cheerio");
var axios = require("axios");

var app = express();

var databaseUrl = "scraper";
var collections = ["scrapedData"];

var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});
app.get("/scrape", function(req, res) {
axios.get("https://old.reddit.com/r/webdev/").then(function(response) {

  var $ = cheerio.load(response.data);

  var results = [];

  $("p.title").each(function(i, element) {

    var title = $(element).text();

    var link = $(element).children().attr("href");

    results.push({
      title: title,
      link: link
    });
    if (title && link) {
        // Insert the data in the scrapedData db
        db.scrapedData.insert({
          title: title,
          link: link
        },
        function(err, inserted) {
          if (err) {
            // Log the error if one is encountered during the query
            console.log(err);
          }
          else {
            // Otherwise, log the inserted data
            console.log(inserted);
          }
        });
      }
  });
});

  console.log("Scrape Complete");
});