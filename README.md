# omega_doorlock

This borrows *heavily* from the `omega_garage` project, which is node.js application that can control your garage door(s).

This app uses a configuration file to define pins, the name of the door lock that the pin corresponds with, and a sensor pin for the magnetic proximity sensor.

This can be used with solenoids or other electromagnetic systems.

# Initial installation steps:

1. Make sure package manager is up-to-date

  ```opkg update```

2. Install the `onoff` Gpio library:

  ```opkg install onoff-node```

3. Install nodejs

  ```opkg install nodejs```

4. Install git and required packages

  ```opkg install git git-http ca-bundle```


# To Install on Omegas with only 16mb of Flash storage:

5.Manually Clone the repo into /tmp/omega_doorlock

  ```git clone https://github.com/jedwood/omega_doorlock.git /tmp/omega_doorlock```

6. Move the config file to your home directory

  ```mv /tmp/omega_doorlock/doorlock_config.json /root/doorlock_config.json```

7. Modify the doorlock_config.json file with the appropriate credentials

8. Move the 'startOmegaDoorlock' file to the '/etc/init.d' directory and grant it rights to execute

  ```mv /tmp/omega_doorlock/startOmegaDoorlock /etc/init.d/```

  ```chmod +x /etc/init.d/startOmegaDoorlock```

9.Enable the new init.d script to make the service run at boot. The startOmegaDoorlock script will load the omega_doorlock repo into RAM and start the server.

  ```/etc/init.d/startOmegaDoorlock enable```

10. reboot the onion omega to make sure that the startOmegaDoorlock script is executed upon reboot.

```reboot```


# To Install on Omegas with more than 16mb of Flash storage:

5.Manually Clone the repo into your home directory

  ```git clone https://github.com/jedwood/omega_doorlock.git /root/omega_doorlock```

6. Move the config file to your home directory

  ```mv /tmp/omega_doorlock/doorlock_config.json /root/doorlock_config.json```

7. Modify the doorlock_config.json file with the appropriate credentials

8. Move the 'startOmegaDoorlock' file to the '/etc/init.d' directory and grant it rights to execute

  ```mv /root/omega_garage/startOmegaDoorlock16mbplus /etc/init.d/```

  ```chmod +x /etc/init.d/startOmegaDoorlock16mbplus```

9.Enable the new init.d script to make the service run at boot. The startOmegaDoorlock16mbplus script will start the server.

  ```/etc/init.d/startOmegaDoorlock16mbplus enable```

10. reboot the onion omega to make sure that the startOmegaDoorlock16mbplus script is executed upon reboot.

```reboot```


# A note about Express.js
* I initially tried to use an old ligther-weight router package, but got tired of fiddling and just fell back on old trusty Express. I have included a version in the repo that is working for me. If you have problems, try following the instructions in the guide here: https://community.onion.io/topic/855/nodejs-express-http-server/2.

# HomeBridge Compatibility
* For now I'm using just using a garage door plugin that is working great for my actual garage doors: https://github.com/washcroft/homebridge-http-garagedoorcontroller with the "generic API" config option, but *make sure you add this fix*: https://github.com/washcroft/homebridge-http-garagedoorcontroller/pull/9/files.

Here's what my config looks like:

```{
"accessory": "HttpGarageDoorController",
"name": "Sliding Door",
"lightName": false,
"doorOperationSeconds": 2,
"httpHost": "YOUR-LOCAL-IPADDRESS-HERE",
"httpPort": 3000,
"httpSsl": false,
"httpStatusPollMilliseconds": 4000,
"httpRequestTimeoutMilliseconds": 10000,
"httpHeaderName": "X-API-Key",
"httpHeaderValue": "MyAPIKey",
"oauthAuthentication": false,
"oauthSignatureMethod": "HMAC-SHA256",
"oauthConsumerKey": "MyOAuthConsumerKey",
"oauthConsumerSecret": "MyOAuthConsumerSecret",
"oauthToken": "MyOAuthToken",
"oauthTokenSecret": "MyOAuthTokenSecret",
"apiConfig":
{
"apiType": "Generic",
"doorOpenMethod": "POST",
"doorOpenUrl": "/doorlockCommand/0",
"doorOpenSuccessContent": "Done!",
"doorCloseMethod": "POST",
"doorCloseUrl": "/doorlockCommand/0",
"doorCloseSuccessContent": "Done!",
"doorStateMethod": "GET",
"doorStateUrl":"/getDoorlockState/0",
"lightOnMethod": "GET",
"lightOnUrl":"/controller/light/on",
"lightOnSuccessContent": "OK",
"lightOffMethod": "GET",
"lightOffUrl":"/controller/light/off",
"lightOffSuccessContent": "OK",
"lightStateMethod": "GET",
"lightStateUrl":"/controller/light/status"
}
}```

None of the light stuff is used, but when I initially tried to pull it out it threw errors. Someday I might find (or create) a more specific plugin.