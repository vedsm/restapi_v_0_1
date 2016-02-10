/**
 * Created by ved on 10/2/16.
 */
var UserRest            = require('../app/models/userrest');
var EventRest           =require('../app/models/userrest');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
module.exports = function(app) {

    app.get('/', function(req, res) {
        res.send('Hello! The API is at http://localhost: port /api');
    });

    app.get('/createevent', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('createevent.ejs', { message: 'createeventMessage' });
    });

    app.get('/fbsignup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: 'signupMessage' });
    });

    app.post('/createfbuser', function(req, res) {
        console.log(req.body.email);
        UserRest.findOne({'fb.email': req.body.email}, function(err, user) {

            if (err) throw err;

            if (!user) {
                //console.log(req);
                // create a sample user
                var nick = new UserRest();
                nick.fb.fbid= req.body.fbid;
                nick.fb.token= req.body.token;
                nick.fb.name= req.body.name;
                nick.fb.email= req.body.email;

                // save the sample user
                nick.save(function(err) {
                    if (err) throw err;

                    console.log('UserRest saved successfully');
                    //res.json({ success: true });
                });
                res.json({ success: true, message: 'User successfully created' });
            } else{
                res.json({
                    success: false,
                    message: 'user with id already exists '
                });
            }

        });
    });


    // TODO: route to authenticate and login a user (POST http://localhost:8080/signin)
    app.get('/fblogin', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: 'loginMessage' });
    });


    app.post('/fblogin', function(req, res) {

        // find the user
        UserRest.findOne({
            'fb.email': req.body.email
        }, function(err, user) {

            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'Authentication failed. User with email not found.' });
            } else if (user) {

                // check if password matches
                if (user.fb.name != req.body.name) {
                    res.json({ success: false, message: 'Authentication failed. Wrong name.' });
                } else {

                    // if user is found and name is right
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
    app.use(function(req, res, next) {

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


    //creating an event
    app.post('/createevent', function(req, res) {
        console.log(req.body.email);
        EventRest.findOne({'Event.eventName': req.body.eventName}, function(err, event) {

            if (err) throw err;

            if (!event) {
                //console.log(req);
                // create a sample event
                var nick = new EventRest();
                nick.Event.eventName= req.body.eventName;
                nick.Event.eventType= req.body.eventType;
                nick.Event.description= req.body.description;
                nick.Event.eventID= req.body.eventID;
                nick.Event.venue.name=req.body.venue_name;

                // save the sample event
                nick.save(function(err) {
                    if (err) throw err;

                    console.log('EventRest saved successfully');
                    //res.json({ success: true });
                });
                res.json({ success: true, message: 'Event successfully created' });
            } else{
                res.json({
                    success: false,
                    message: 'Event with name already exists '
                });
            }

        });
    });


};