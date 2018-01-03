var express = require('express');
var bodyParser = require('body-parser')
var app = express();

var omegaDoorlock = require('./omega_doorlock');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
  var state = omegaDoorlock.getDoorlockState(req.query.lockid);
  res.send({state:state, battery:100});
});

app.post('/', function (req, res) {
  console.log("Received request to lock door: " + req.body.lockid);

  omegaDoorlock.changeDoorlockState(parseInt(req.body.lockid));

  res.setHeader('Cache-Control', 'no-cache');
  res.send("Done!");
});


app.listen(3000, function(){
  console.log('omega_doorlock listening on port 3000!');
  omegaDoorlock.init();
});

process.on('SIGINT', function () {
  console.log("Cleaning up pins...");
  omegaDoorlock.closePins()
  process.exit();
});
