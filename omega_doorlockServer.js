var Router = require('./node-simple-router');
var router = Router();

var omegaDoorlock = require('./omega_doorlock');

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

router.options('*', function(req,res) {
  var headers = {};
  headers["Access-Control-Allow-Origin"] = "*";
  headers["Access-Control-Allow-Headers"] = "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept";
  // respond to the request
  res.writeHead(200, headers);
  res.end();
});

router.get('/', function (req, res) {
  res.send('Hello World!');
});

router.get('/getDoorlockState/:doorIndex', function (req, res) {

  var state = omegaDoorlock.getDoorlockState(req.params.doorIndex);
  res.send(state);
});

router.post('/doorlockCommand/:doorIndex', function (req, res) {
  //req.params.doorIndex
  console.log("Received request to change the state of the doorlock door: " + req.params.doorIndex);

  omegaDoorlock.changeDoorlockState(parseInt(req.params.doorIndex));

  res.setHeader('Cache-Control', 'no-cache');
  res.send("Done!");
});

router.get('/getAllDetails', function (req, res)
{
  var obj = omegaDoorlock.getAllDoorlockStates()

  console.log("Responding to a request for all the details..." + JSON.stringify(obj));
  res.json(obj);
});


var server = http.createServer(router);
server.listen(3000, function(){
  console.log('omega_doorlock listening on port 3000!');
  omegaDoorlock.init();
});

process.on('SIGINT', function () {
  console.log("Cleaning up pins...");
  omegaDoorlock.closePins()
  process.exit();
});
