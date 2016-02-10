/**
 * Created by Ved on 8/2/16.
 * Modified by Manasvi on 11/2/16.
 */
// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var flash       = require('connect-flash');
var fs          = require('fs');
var request     = require('request');
var cheerio     = require('cheerio');
var app         = express();


var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var UserRest   = require('./app/models/userrest'); // get our mongoose model

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 9000; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('view engine', 'ejs'); // set up ejs for templating
app.use(flash()); // use connect-flash for flash messages stored in session
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));


require('./app/routes.js')(app);


// =======================
// routes ================
// =======================
// basic route

app.post('/setup', function(req, res) {
    console.log(req);
    // create a sample user
    var nick = new UserRest({
        name: req.query.name,
        password: req.query.password,
        admin: true
    });

    // save the sample user
    nick.save(function(err) {
        if (err) throw err;

        console.log('UserRest saved successfully');
        res.json({ success: true });
    });
});

// API ROUTES -------------------
// we'll get to these in a second

// get an instance of the router for api routes
var apiRoutes = express.Router();

// TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)
// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {

    // find the user
    UserRest.findOne({
        name: req.body.name
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresInMinutes: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }

        }

    });
});

// TODO: route middleware to verify a token
apiRoutes.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});


// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
    UserRest.find({}, function(err, usersrest) {
        res.json(usersrest);
    });
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

// Web scraper
app.get('/scrape', function(req, res) {
    // The URL we will scrape from - in our example Lord of the Rings.
    url = 'http://www.imdb.com/title/tt0120737/';

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html
    request(url, function(error, response, html) {

        // First we'll check to make sure no errors occurred when making the request
        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
            var $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture
            var title, release, rating;
            var json = { title : "", release : "", rating : "" };

            // We'll use the unique header class as a starting point.
            $('.long').filter(function() {
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

            $('.ratingValue').filter(function() {
                var data = $(this);
                rating = data.children().first().children().text();
                json.rating = rating;
                console.log(rating);
            })      
        }
        fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err) {
            console.log('File successfully written! - Check your project directory for the output.json file')
        })

        res.send('Check your console!')

    })        
})

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
exports = module.exports = app;