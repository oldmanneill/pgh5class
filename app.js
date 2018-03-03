var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require("method-override");

mongoose.connect('mongodb://localhost/random_groups');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

var appSchema = new mongoose.Schema({
    title: String,
    body: String,
    created: { type: Date, default: Date.now },
    updatedTime: String
});
var Groups = mongoose.model('Groups', appSchema);

var checkDate = new Date().toDateString();
console.log('check '+ checkDate);
Groups.count({updatedTime : checkDate}, function(err, counting){//checks to see if the last date is the same as today's
    if (err){                                                   //date. If it is, then show the index. Otherwise
        console.log('error');                                   //update the database date and randomize the classlist, and
    }else{                                                      //load up the index.
    console.log('Count is ' + counting);
    }
});

/*var conditions = { title: "Academy Pgh5" },
    update = { updatedTime: checkDate },
    options = { multi: true };

Groups.update(conditions, update, options, callback);

function callback(err, numAffected) {
    if (err) {}
    else {};
}
*/

//restful routes
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
//new route
app.get('/academypgh5/new', function(req, res) {
    res.render('new');
});
//create route
app.post("/academypgh5", function(req, res) {
    Groups.create(req.body.classroom, function(err, newGroups) {
        if (err) {
            res.render("new");
        }
        else {
            res.redirect("/academypgh5");
        }

    });
});
//show route
app.get("/academypgh5/:id", function(req, res) {
    Groups.findById(req.params.id, function(err, foundGroups) {
        if (err) {
            res.redirect("/academypgh5");
        }
        else {
            res.render("show", { classroom: foundGroups });
        }
    });

});
//edit route
app.get("/academypgh5/:id/edit", function(req, res) {
    Groups.findById(req.params.id, function(err, foundGroups) {
        if (err) {
            res.redirect("/academypgh5");
        }
        else {
            res.render("edit", { classroom: foundGroups });
        }
    });
});
//update route
app.put("/academypgh5/:id", function(req, res) {
    Groups.findByIdAndUpdate(req.params.id, req.body.classroom, function(err, updatedGroups) {
        if (err) {
            res.redirect("/academypgh5");
        }
        else {
            res.redirect('/academypgh5/' + req.params.id);
        }
    });
});

//delete route
app.delete('/academypgh5/:id', function(req, res) {
    Groups.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/academypgh5");
        }
        else {
            res.redirect("/academypgh5");
        }
    });
});
app.listen(process.env.PORT, process.env.IP, function() {
    console.log('server is running');
});
