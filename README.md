# omega_doorlock

This was inspired heavily by the `omega_garage` project, which is a node.js application that can control your garage door(s).

This app uses a configuration file to define pins, the name of the door lock that the pin corresponds with, and a sensor pin for the magnetic proximity sensor.

I originally created this to be used with a solenoid, but switched to a servo.

# Initial installation steps:

1. Make sure package manager is up-to-date

  ```opkg update```

2. Install nodejs

  ```opkg install nodejs```

3. Install git and required packages

  ```opkg install git git-http ca-bundle```


# To Install on Omegas with only 16mb of Flash storage:

4. Manually Clone the repo into /tmp/omega_doorlock

  ```git clone https://github.com/jedwood/omega_doorlock.git /tmp/omega_doorlock```

5. Move the config file to your home directory

  ```mv /tmp/omega_doorlock/doorlock_config.json /root/doorlock_config.json```

6. Modify the doorlock_config.json file with the appropriate credentials

7. Move the 'startOmegaDoorlock' file to the '/etc/init.d' directory and grant it rights to execute

  ```mv /tmp/omega_doorlock/startOmegaDoorlock /etc/init.d/```

  ```chmod +x /etc/init.d/startOmegaDoorlock```

8. Enable the new init.d script to make the service run at boot. The startOmegaDoorlock script will load the omega_doorlock repo into RAM and start the server.

  ```/etc/init.d/startOmegaDoorlock enable```

9. reboot the onion omega to make sure that the startOmegaDoorlock script is executed upon reboot.

```reboot```


# To Install on Omegas with more than 16mb of Flash storage:

4. Manually Clone the repo into your home directory

  ```git clone https://github.com/jedwood/omega_doorlock.git /root/omega_doorlock```

5. Move the config file to your home directory

  ```mv /root/omega_doorlock/doorlock_config.json /root/doorlock_config.json```

6. Modify the doorlock_config.json file with the appropriate credentials

7. Move the 'startOmegaDoorlock' file to the '/etc/init.d' directory and grant it rights to execute

  ```mv /root/omega_doorlock/startOmegaDoorlock16mbplus /etc/init.d/```

  ```chmod +x /etc/init.d/startOmegaDoorlock16mbplus```

8.Enable the new init.d script to make the service run at boot. The startOmegaDoorlock16mbplus script will start the server.

  ```/etc/init.d/startOmegaDoorlock16mbplus enable```

9. reboot the onion omega to make sure that the startOmegaDoorlock16mbplus script is executed upon reboot.

```reboot```


# A note about Express.js
* I initially tried to use an old ligther-weight router package, but got tired of fiddling and just fell back on old trusty Express. I have included a version in the repo that is working for me. If you have problems, try following the instructions in the guide here: https://community.onion.io/topic/855/nodejs-express-http-server/2.

# HomeBridge Compatibility
This one worked for me: https://github.com/AchimPieters/Apple-Homebridge-Door-Lock . Here's what my config looks like:

```
"accessories":[
  {
    "accessory": "HttpLock",
    "name": "Basement Door",
    "url": "http://YOUR_LOCAL_OMEGA_IP_HERE:3000/",
    "lock-id": "0",
    "username": "Your_Username",
    "password": "Your_Password"
    } ...
```

