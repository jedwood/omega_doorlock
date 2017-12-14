var express = require('express');
var app = express();

var omegaDoorlock = require('./omega_doorlock');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/getDoorlockState/:doorIndex', function (req, res) {

  var state = omegaDoorlock.getDoorlockState(req.params.doorIndex);
  res.send(state);
});

app.post('/doorlockCommand/:doorIndex', function (req, res) {
  //req.params.doorIndex
  console.log("Received request to change the state of the doorlock door: " + req.params.doorIndex);

  omegaDoorlock.changeDoorlockState(parseInt(req.params.doorIndex));

  res.setHeader('Cache-Control', 'no-cache');
  res.send("Done!");
});

app.get('/getAllDetails', function (req, res)
{
  var obj = omegaDoorlock.getAllDoorlockStates()

  console.log("Responding to a request for all the details..." + JSON.stringify(obj));
  res.json(obj);
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
