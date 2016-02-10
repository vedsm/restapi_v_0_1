/**
 * Created by ved on 10/2/16.
 */
var UserRest            = require('../app/models/userrest');
module.exports = function(app) {

    app.get('/', function(req, res) {
        res.send('Hello! The API is at http://localhost: port /api');
    });

    app.get('/signup', function(req, res) {

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

};
