/**
 * Created by ved on 12/2/16.
 */

var cheerio     = require('cheerio');
var request     = require('request');
var fs          = require('fs');

module.exports = function(app) {
// Web scraper

    app.get('/scrape', function (req, res) {
        // The URL we will scrape from - in our example Lord of the Rings.
        url = 'http://www.imdb.com/title/tt0120737/';

        // The structure of our request call
        // The first parameter is our URL
        // The callback function takes 3 parameters, an error, response status code and the html
        request(url, function (error, response, html) {

            // First we'll check to make sure no errors occurred when making the request
            if (!error) {
                // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
                var $ = cheerio.load(html);

                // Finally, we'll define the variables we're going to capture
                var title, release, rating;
                var json = {title: "", release: "", rating: ""};

                // We'll use the unique header class as a starting point.
                $('.long').filter(function () {
                    // Let's store the data we filter into a variable so we can easily see what's going on.
                    var data = $(this);

                    // In examining the DOM we notice that the title rests within the first child element of the header tag.
                    // Utilizing jQuery we can easily navigate and get the text by writing the following code:
                    title = data.text();
                    release = data.children().last().children().text();

                    // Once we have our title, we'll store it to the our json object.
                    json.title = title;
                    json.release = release;
                    console.log(title + " " + release);

                })

                $('.ratingValue').filter(function () {
                    var data = $(this);
                    rating = data.children().first().children().text();
                    json.rating = rating;
                    console.log(rating);
                })
            }
            fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
                console.log('File successfully written! - Check your project directory for the output.json file')
            })

            res.send('Check your console!')

        })
    })
};