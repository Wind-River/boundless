# Installation Guide

The current system utilizes google's firebase database, storage and serverless functions (to manage the data and storage). We plan to support other server side databases in the future (e.g., mongodb). Two thirds of the installation centers around setting up the firebase database, storage and server side functions. 

## Prerequisites
  * create a dedeciate Google gmail account (with Firebase enabled)
  * a computer to build the the boundless application (**build computer**)
    * will need access to a bash terminal with GNU make installed. 
  * a computer server to serve up the application (**server computer**) - could use also firebase hosting, the build computer or another dedicated server (e.g., running Apache server)
  
From your **build computer** linux terminal
```bash
$ git clone https://github.com/Wind-River/boundless.git && cd boundless
$ echo "" > init.js
```


```bash
# inside boundless root directory
$ npm install -g firebase-tools

# this could take several mins since this will be installing dependencies
$ cd app/server/firebase/functions 
$ npm i 
$ cd ../../..

# 'firebase login' should prompt broswer, please select proper google account since
# this command will be grabbing credentials from the browser
$ firebase login --interactive ## log into the google account which holds the firebase project
```

## Firebase Project Creation and Credentials
Log into firebase console via the following link: https://firebase.google.com/

* On upper right corner, please select <**Go to console**>
* Create firebase project
  1. Click on [**Create a project**] (You may reuse your old projects).
  1. Configure Google Analytics - 
  1. select Default Account for Firebase
  1. select "_Create a project_"
  1. Once done, press "**Continue**"
* Create Database
  1. Select "**Develop**" tab on left menu
  1. Select "**Database**" 
  1. Click on [**Create database**]
  1. Select "**Start in production mode**"
  1. Select region
  1. Click on [**Done**]
  1. Choose "Rules" tab inside "**Database**" and change it to following:
  ```js
  // rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if true;
      }
    }
  }
  ```
* Set up firebase Storage
  1. Select "**Storage**" tab on left menu under "**Develop**"
  1. Choose [**Get started**]
  1. Select region
  1. Edit the "Rules" to following:
      ```js
      // rules_version = '2';
      service firebase.storage {
        match /b/{bucket}/o {
          match /{allPaths=**} {
            allow read, write: if true;
          }
        }
      }
      ```
We need to set the server side functions. In order to config Firebase functions you will need to install firebase-tools
Although we provide instructions here, a more details installation guide can be found here:
https://firebase.google.com/docs/functions/get-started
* Set up Functions
  1. Select "**Functions**" tab on left menu under "**Develop**"
  1. Choose [**Get started**] and complete
  1. you will be asked to install on your server: $ npm install -g firebase-tools
  1. You can ignore the following (just click [Finsh]):
   ```bash
    $ firebase init
    $ firebase deploy
    ```
  1. On left menu near top (**Project Overview**) select the "**Settings Cog**" icon on the upper left corner
  1. Select "**Project settings**"
  1. Scroll down and select "**</>**" icon
  1. Enter app nickname 
  1. (Firebase Hosting not required)
  1. Select [**Register app**]
  1. Copy the following for a later step from var firebaseConfigs = { ... };
      ```js
        apiKey: ...,
          .
          .
          .
        appId: ...
        measurementId: ...
      ```
  1. Select [**Continue to console**]
<br />

## Copy db creditals into init.js
From the root directory
Back to the build computer terminal go into editor for init.js and paste the firebase credentials into ./init.js. For example:
```js
  var firebaseConfig = {
    apiKey: "...",
    authDomain: "...",
    databaseURL: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "...",
    measurementId: "..."
  };
```

Install firebase functions
If the user has make installed, you may just run make from the root as shown below:
```bash
make fb_init
make fb_functions_deploy
```

## Webserver Hosting (Apache server example)

From the root directory
Once the Firebase credentials are stored in 'system.yml' proceed with the following:

```bash
make build
```

To run locally (ex. localhost:8080), call
```bash
# if running locally (ex. localhost:8080), call
$ make run
```

After running 'make build' above the application is ready to be hosted on webserver.
The following example will be showing on how to host it on an Apache web server:

### Apache server example
On the **server computer**: 
```bash
# check the status of apache2
$ sudo systemctl status apache2

# if not available, please install via package-manager
# if apache2 is not runnig, please run the following command
$ sudo systemctl start apache2

# copy the files inside spa folder into var/www/html
$ sudo cp -r ./spa/. /var/www/html/
```

This should allow the user to visit port 80 of the **server computer** and enjoy the
application.

## Container Hosting

**Note:** Docker compose is required and must support version 3.7+
<br />
Please fill in Firebase configuration inside docker-compose.yml file.
```yaml
 6|      args:
 7|        apiKey: "[VALUE]"
 8|        authDomain: "[VALUE]"
 9|        databaseURL: "[VALUE]"
10|        projectId: "[VALUE]"
11|        storageBucket: "[VALUE]"
12|        messagingSenderId: "[VALUE]"
13|        appId: "[VALUE]"
```

_Tip:_ Making sure docker-compose is installed.

```bash
$ docker-compose -v
docker-compose version 1.25.0, build b42d419
```

**Note:** If docker-compose version does not work, please either reinstall
docker-compose or try the non-dockerized hosting mentioned previously.

Given docker-compose worked, the user may follow the following instructions to
finish hosting.

```bash
$ docker-compose build
$ docker-compose up
```

**Note:** It is possible that PORT 80 is already in use. If it was the case, 
please run ```$ sudo systemctl stop apache2 ``` to stop apache2. If the user is 
familiar with the TCP enabling, the user may also do so.

Once the docker-compose up is up and running, you may connect to the IP via
browser and explore the software.

**Note:** Currently, Firebase-functions are not automated.


Now, the application is fully ready to be used.