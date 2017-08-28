var express = require('express');
var fs = require('fs');
var storeEvents = require('./store-events.js');
var getEvents = require('./get-events.js');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render("index");
});

app.get('/clientscript.js', function (req, res){
  var script = fs.readFileSync("clientscript.js", "utf8");
  res.end(script);
});


//not really working well yet
app.get('/events', function (req, res) {
  getEvents().then(function(events){
    res.write(JSON.stringify(events));

    console.log(events.length);
    res.end();
  });

});

//not really working yet
app.get('/save', function (req, res){
  storeEvents();
  res.end("Events stored");
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
