var method = omegaDoorlock.prototype;
var https = require('https');

servosStates = [0,0];
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
      console.log("Creating servo for " + config.doorlocks[i].doorlockName + " doorlock on pin: " + config.doorlocks[i].servoPin);
      exec('fast-gpio set-output ' + config.doorlocks[i].servoPin);
      exec('fast-gpio set ' + config.doorlocks[i].servoPin + ' 0');

      // exec('fast-gpio pwm 18 50 ' + pulse);

      console.log("Creating sensor input for " + config.doorlocks[i].doorlockName + " doorlock on pin: " + config.doorlocks[i].sensorPin);
      exec('fast-gpio set-input ' + config.doorlocks[i].sensorPin);
    }

    setInterval(beginStateUpdates, 5000);
  }
  catch(e)
  {
    console.log("Error initializing: " + e);
  }
};

omegaDoorlock.prototype.getDoorlockState = function(doorlockIndex)
{
  try
  {
    var strResult = "";
    if(servosStates[doorlockIndex] == 0)
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

    this.setservoState(doorlockIndex, 1);
    exec('fast-gpio pwm ' + config.doorlocks[doorlockIndex].servoPin + ' 50 10');

    setTimeout(function()
    {
      exec('fast-gpio set ' + config.doorlocks[i].servoPin + ' 0');
    }, 1000);

  }
  catch(e)
  {
    console.log("Error changing the doorlock state: " + e);
  }
};

omegaDoorlock.prototype.getAllDoorlockStates = function()
{
  var obj = [];

  for(var i = 0; i < doorlocksLength; i++)
    obj.push(servosStates[i]);

  return obj;
}

omegaDoorlock.prototype.closePins = function()
{
  for(var i = 0; i < this.garageDoorsLength; i++)
  {
    console.log("Closing servo pin: " + config.garageDoors[i].servoPin);
    exec('fast-gpio set ' + config.doorlocks[i].servoPin + ' 0');
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

    var result = exec('fast-gpio read ' + config.doorlocks[i].sensorPin);

    if(result != servosStates[doorlockIndex])//If the state of the doorlock has changed, then notify the user.
    {

      var humanResult = result == 0 ? "opened" : "closed";
      var doorName = config.doorlocks[doorlockIndex].doorlockName

      if (config.webhook) {
        //just fire it and forget it
        https.get(config.webhook + '?value1=' + doorName + '&value2=' + humanResult, null);
      }
    }

    servosStates[doorlockIndex] = result;
  }
  catch(e)
  {
    console.log("Error getting doorlock state: " + e);
  }
}
module.exports = new omegaDoorlock();