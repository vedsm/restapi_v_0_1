/**
 * Created by ved on 10/2/16.
 */
var UserRest            = require('../app/models/userrest');
module.exports = function(app) {

    app.get('/', function(req, res) {
        res.send('Hello! The API is at http://localhost: port /api');
    });

    app.post('/createfbuser', function(req, res) {
        console.log(req.query);
        UserRest.findOne({'fb.email': req.query.email}, function(err, user) {

            if (err) throw err;

            if (!user) {
                console.log(req);
                // create a sample user
                var nick = new UserRest();
                nick.fb.fbid= req.query.fbid;
                nick.fb.token= req.query.token;
                nick.fb.name= req.query.name;
                nick.fb.email= req.query.email;

                // save the sample user
                nick.save(function(err) {
                    if (err) throw err;

                    console.log('UserRest saved successfully');
                    //res.json({ success: true });
                });
                res.json({ success: true, message: 'User successfully created' });
            } {
                res.json({
                    success: false,
                    message: 'user with id already exists '
                });
            }

        });
    });

};
