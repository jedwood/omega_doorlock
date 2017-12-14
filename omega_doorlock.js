var method = omegaDoorlock.prototype;
var Gpio = require('/usr/bin/onoff-node/onoff.js').Gpio;
var https = require('https');

relaysStates = [0,0];
config = {};
doorlocksLength = 0;
pinsOut = [];
pinsIn = [];

function omegaDoorlock() {

}

omegaDoorlock.prototype.init = function()
{
  try
  {
    loadConfigFile();

    doorlocksLength = config.doorlocks.length;

    for(var i = 0; i < doorlocksLength; i++)
    {
      console.log("Creating relay for " + config.doorlocks[i].doorlockName + " doorlock on pin: " + config.doorlocks[i].relayPin);
      pinsOut[i] = new Gpio(config.doorlocks[i].relayPin,'out');

      console.log("Creating sensor input for " + config.doorlocks[i].doorlockName + " doorlock on pin: " + config.doorlocks[i].sensorPin);
      pinsIn[i] = new Gpio(config.doorlocks[i].sensorPin,'in');
    }

    setInterval(beginStateUpdates, 5000);
  }
  catch(e)
  {
    console.log("Error initializing: " + e);
  }
};

omegaDoorlock.prototype.getLockState = function(doorlockIndex)
{
  try
  {
    var strResult = "";
    if(relaysStates[doorlockIndex] == 0)
      strResult = "OPEN";
    else
      strResult = "CLOSED";

    console.log("The " + config.doorlocks[doorlockIndex].doorlockName + " doorlock is " + strResult);
    return strResult;
  }
  catch(e)
  {
    console.log("Error getting doorlock state: " + e);
    return "OPEN";
  }
}

omegaDoorlock.prototype.changeDoorlockState = function(doorlockIndex)
{
  try
  {
    console.log("Changing the state of the " + config.doorlocks[doorlockIndex].doorlockName + " doorlock.");

    this.setRelayState(doorlockIndex, 1);

    var obj = this;
    setTimeout(function()
    {
      obj.setRelayState(doorlockIndex, 0);
    }, 1000);

  }
  catch(e)
  {
    console.log("Error changing the doorlock state: " + e);
  }
};

omegaDoorlock.prototype.setRelayState = function(doorlockIndex, value)
{

  pinsOut[doorlockIndex].writeSync(value);
}

omegaDoorlock.prototype.getAllDoorlockStates = function()
{
  var obj = [];

  for(var i = 0; i < doorlocksLength; i++)
    obj.push(relaysStates[i]);

  return obj;
}

omegaDoorlock.prototype.closePins = function()
{
  for(var i = 0; i < this.garageDoorsLength; i++)
  {
    console.log("Closing relay pin: " + config.garageDoors[i].relayPin);
    pinsOut[i].unexport();

    console.log("Closing sensor pin: " + config.garageDoors[i].sensorPin);
    pinsIn[i].unexport();
  }
};

////////////////////////////////PRIVATE FUNCTIONS///////////////////////////////
function loadConfigFile()
{
  try
  {
    console.log("Loading configuration file...");
    var home = process.env.HOME;
    config = require('/root/doorlock_config.json');
    //config = require('./doorlock_config.json');
    console.log("Configuration file loaded..." + JSON.stringify(config));
  }
  catch (e)
  {
    console.log('Error loading the configuration file:', e);
    process.exit();
  }
};

function beginStateUpdates()
{
  for(var i = 0; i < doorlocksLength; i++)
  {
    updateDoorlockState(i);
  }
}

function updateDoorlockState(doorlockIndex)
{
  try
  {
    console.log("Updating doorlock door states");

    var result = pinsIn[doorlockIndex].readSync();

    if(result != relaysStates[doorlockIndex])//If the state of the doorlock has changed, then notify the user.
    {

      var humanResult = result == 0 ? "opened" : "closed";
      var doorName = config.doorlocks[doorlockIndex].doorlockName

      if (config.webhook) {
        //just fire it and forget it
        https.get(config.webhook + '?value1=' + doorName + '&value2=' + humanResult, null);
      }
    }

    relaysStates[doorlockIndex] = result;
  }
  catch(e)
  {
    console.log("Error getting doorlock state: " + e);
  }
}
module.exports = new omegaDoorlock();