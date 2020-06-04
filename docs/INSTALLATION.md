# Installation Guide

The current system utilizes google's firebase database, storage and serverless functions (to manage the data and storage). We will refer to these as the three core firebase components. We plan to support other server-side databases in the future (e.g., mongodb). The installation is broken into major parts: **Part I** – configuring the firebase components which should take approximately 45 minutes. Running the portal (**Part II**) could take as little as 5 minutes if you want to test it out using your local computer (localhost).

# Part I - Setting up Firebase Database and Storage 

## I.1) Prerequisites
Here are the require prerequisites: 
  * Create a dedeciate Google gmail account (we will enable Google's Firebase database and storage)
  * Use google chrome to maange access to Firebase (will inherit browser credentials during the installation)
  * A computer to build and configure the the portal (**build computer**)
    * will need access to a **unix/bash terminal** with **GNU make**. [Git Bash](https://gitforwindows.org/) is often used on Windows with a Windows version of make [here](https://gist.github.com/evanwill/0207876c3243bbb6863e65ec5dc3f058).
  * a **server computer** to host the web portal in production. For the server computer you could also use firebase hosting, the build computer or another dedicated server (e.g., running Apache server)
  
From your **build computer** linux terminal window:
```bash
$ git clone https://github.com/Wind-River/boundless.git && cd boundless
$ echo "" > init.js   ## We need to create file init.js for a later step.
```


```bash
### inside portal **root** directory
$ npm install -g firebase-tools

### this could take several minutes since this will be installing dozens of dependencies
$ cd app/server/firebase/functions 
$ npm i 
$ cd ../../..  ## go to the root/app directory to execute the next command

### 'firebase login' should prompt broswer, please select proper google account since
### this command will be grabbing credentials from the browser
$ firebase login --interactive ## log into the google account which holds the firebase project
```

## I.2) Firebase Project Creation and Credentials
In this section we need to create the firebase database, storage and server side functions. At the end you will need to make a copy of the database credentials to securely configure the web portal in **Part II**. This should take about 30 minutes. Log into firebase console via the following link: https://firebase.google.com/

* On upper right corner, please select <**Go to console**>
* **Create Firebase Project:**
  1. Click on [**Create a project**] (You may reuse your old projects).
  1. Enter project name 
  1. Configure Google Analytics (not required)
    1. select Default Account for Firebase
  1. select "_Create a project_"
  1. Once done, press "**Continue**"
* **Create Database:**
  1. Select "**Develop**" tab on left menu
  1. Select "**Database**" 
  1. Click on [**Create database**]
  1. Select "**Start in production mode**"
  1. Select region
  1. Click on [**Done**]
  1. Choose "Rules" menu tab (below "**Database**") and change it to the following:
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
* **Set Up the Firebase Storage:**
  1. Select "**Storage**" tab on left menu under "**Develop**"
  1. Choose [**Get started**]
  1. You will see message about edit another rule - click **Next**
  1. Select region, click **Done**
  1. 
  1. Choose "Rules" menu tab (below "**Storage**") and change it to the following:
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

* **Set Up the Firebase Server Side Functions:**
  1. Select "**Functions**" tab on left menu under "**Develop**"
  1. Choose [**Get started**] and complete
  1. you will be asked to install on your server: $ npm install -g firebase-tools - you did this already above - click **Continue**
  1. You can also ignore the following (just click [Finsh]):
   ```bash
    $ firebase init
    $ firebase deploy
    ```
* **Ready to grab the database credentials:**
  1. On left menu near top (**Project Overview**) select the "**Settings Cog**" icon on the upper left corner
  1. Select "**Project settings**"
  1. Scroll down and select "**</>**" icon
  1. Enter app nickname 
  1. (Firebase Hosting not required)
  1. Select [**Register app**]
  1. Copy the following for a later step from var firebaseConfigs = { ... };
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
Select [**Continue to console**]
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
ok - we are done configuring the database and server side storage

From the **terminal** run the following to install firebase functions (you must have make installed):
```bash
$ make fb_init
$ make fb_functions_deploy
```
** Congratulations ! ** - you have successfully configured firebase database, storage and server side fucntions..

YOU ARE READY TO RUN THE SERVER!

# Part II Running (Hosting) The Web Portal 
You have four options on how you can run the web portal:
  1. Run on your local (development) computer
  1. Web Server Hosting (e.g., Apache server)
  1. Container hosting (e.g., docker)
  1. Firebase Hosting (free with your firebase account)
  
**Run on your development computer** - The first option is what contributors (project developers) will need to use to develop and test. If you are an admin installing firebase for the first time try starting there to test it out. Even though it is on your local host the data you enter will reside in the production database and will be available to the other three hosting methods.

**Web Server Hosting (e.g., Apache server)** - This is a common way to host the web portal internally behind an organization firewall.

**Container hosting** - This is an easy way if you are comforable working with docker and container images. You will need to take a few steps to add the database credentials but the actual build is automated. 

**Firebase Hosting** 



## II.1) Run on your development computer
To run locally (e.g. from localhost:8080), call the make command from the root directory:
```bash
$ make run
```
This could take ~ 5 minutes the first time while it performs a complete build. 
Your portal is now reafdy (at least on your local computer) - go to local browser and enter:
   http://localhost:8080/ 


## II.2) Web Server Hosting (Apache server example)

From the root directory
Once the Firebase credentials are stored in 'system.yml' proceed with the following:

```bash
$ make build
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

## II.3) Container Server Hosting

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

## II.4) Firebase Hosting 
  TBD - see Firebase Web Hosting (part of your firebase account)
  
