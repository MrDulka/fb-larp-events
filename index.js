var express = require('express');
var fs = require('fs');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render("index");
});

app.get('/fbevents.js', function (req, res){
  var script = fs.readFileSync("fbevents.js", "utf8");
  res.end(script);
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
