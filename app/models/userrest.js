/**
 * Created by ved on 8/2/16.
 */
// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');

// set up a mongoose model and pass it using module.exports
var userSchema = mongoose.Schema({

    UserRest:{
        name: String,
        password: String,
        admin: Boolean
        },
    fb: {
        fbid: String,
        token: String, // we will save the token that facebook provides to the user
        name: String, // look at the passport user profile to see how names are returned
        email: String
    }
});

var eventSchema = mongoose.Schema({

    Event:{
        eventName:String,
        eventType:String,
        description:String,
        eventID:String,
        venue:{
            name:String,
            location:{
                lat:String,
                lon:String,
                address:String
            }
        },
        eventDetails:{
            hosts:{ //this should be an array
                id:String,
                name:String,
                picUri:String
            }
        }
    }
});

module.exports = mongoose.model('UserRest', userSchema);
module.exports = mongoose.model('EventRest',eventSchema);