var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require("method-override");

mongoose.connect('mongodb://oldmanneill:pgh5@ds155278.mlab.com:55278/classpgh');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

var appSchema = new mongoose.Schema({
    title: String,
    classList: [],
    updatedTime: String
});
var Groups = mongoose.model('Groups', appSchema);
var randoList = ["Coral", "Emily", "John", "Emma", "Michael",
    "Greg", "Jennifer", "Zach", "Sarah", "Megan",
    "Aliia", "Ohad", "Brandon", "Sum", "Lenar"
];

var checkDate = new Date().toDateString();                          //finds the date right now.
Groups.count({ updatedTime: checkDate }, function(err, counting) { //checks to see if the last date is the same as today's
    if (err) {                                                      //date. If it is, then show the index. Otherwise
        console.log('error');                                       //update the database date and randomize the classlist, and
    }
    else {                                                          //load up the index.
        if (!counting) {

            randoList.sort(function(a, b) {
                return 0.5 - Math.random();
            });
            var conditions = { title: "Academy Pgh5" },
                update = { classList: randoList, updatedTime: checkDate },
                options = { multi: true };
            Groups.update(conditions, update, options, callback);
        }
        else{
            restfulRoutes();
        }
    }
});


function callback(err, numAffected) {
    if (err) {
        console.log('error in db check');
    }
    else {
        restfulRoutes();
    }
}

function restfulRoutes() {
    app.get('/', function(req, res) {
        res.redirect('/academypgh5');
    });
    app.get('/academypgh5', function(req, res) {

        Groups.find({}, function(err, classroom) {
            if (err) {
                console.log('error');

            }
            else {
                res.render('index', { classroom: classroom });
            }
        });
    });
}
app.listen(process.env.PORT, process.env.IP, function() {
    console.log('server is running');
});
