# Boundless Portal
Employee driven innovations are tracked here. An innovation may include 
(but not limited to):
* cool fun demo (e.g., Internet connected coffee maker)
* new tool or process that make other Wind River groups or customers more 
productive
* new product feature
* platform extensions (e.g., VxWorks, Linux, Titanium)

----

# Installation Guide
**Note:** Docker compose is required and must support version 3.7+
<br />
**Note:** Google account with Firebase enabled

## Cloning the Repo
```bash
$ git clone https://github.com/Wind-River/boundless.git && cd boundless
```
Once the cloning is complete, please fetch Firebase Credentials.

## Firebase Credentials
Log into firebase via the following link: https://firebase.google.com/

* On upper right corner, please select <**Go to console**>
* Click on <**Create a project**> (You may reuse your old projects).
* Complete "_Create a project_"
* Once done, press "**Continue**"
* Select "**Develop**" tab on left menu
* Select "**Database**" and press <**Create database**>
* Select "**Start in production mode**"
* Select region
* Choose "Rules" tab inside "**Database**" and change it to following:
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
* Select "**Storage**" tab on left menu under "**Develop**"
* Choose <**Get started**> and complete
* Edit the "Rules" to following:
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
* Select "**Functions**" tab on left menu under "**Develop**"
* Choose <**Get started**> and complete
* Please select the "**Settings Cog**" icon on the upper left corner
* Select "**Project settings**"
* Scroll down and select "**</>**" and complete (Firebase Hosting not required)
* Please copy from var firebaseConfigs = { ... }
```js
  apiKey: ...,
    .
    .
    .
  appId: ...
```
Proceed onto next session.
<br />

## Application

### Webserver Hosting
Generating the setup files.
```bash
$ cd ./app
$ ./setup.sh
```

Please fill in Firebase configuration inside system.yml inside config folder as 
instructed.

```yml
# Please make sure to replace all the commas
databaseConfig:
  production:
    apiKey: ------------------------------------
    authDomain: ------------------------------------
    databaseURL: ------------------------------------
    projectId: ------------------------------------
    storageBucket: ------------------------------------
    messagingSenderId: ------------------------------------
    appId: ------------------------------------

  testing:
    apiKey: ------------------------------------
    authDomain: ------------------------------------
    databaseURL: ------------------------------------
    projectId: ------------------------------------
    storageBucket: ------------------------------------
    messagingSenderId: ------------------------------------
    appId: ------------------------------------
    
  dev:
  
```

Once the Firebase credentials are set inside 'system.yml' please proceed with 
the following:

```bash
# one must be in root dir of this repo
$ ./database_setup.sh

# if running locally (ex. localhost:8080), run demo.sh
$ ./demo.sh

# if building to host on a server, run build.sh to create the distribution file
$ ./build.sh # this will generate spa folder inside the root dir of the repo
```

After running 'build.sh', the application is ready to be served on webserver.
This example will be showing on how to host it on Apache2.0 and the commands
are as follows:

```bash
# check the status of apache2
$ sudo systemctl status apache2

# if not available, please install via package-manager
# if apache2 is not runnig, please run the following command
$ sudo systemctl start apache2

# copy the files inside spa folder into var/www/html
$ sudo cp -r ./spa/. /var/www/html/
```

This should allow the user to visit port 80 of the host machine and enjoy the
application.

### Container Hosting
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

## Firebase-Functions
Installation guide can be found on the following link:
https://firebase.google.com/docs/functions/get-started

```bash
# inside boundless root directory
$ npm install -g firebase-tools

# this could take several mins since this will be installing dependencies
$ cd ./app/server/cloud/functions && npm i && cd ..

# 'firebase login' should prompt broswer, please select proper google account since
# this command will be grabbing credentials from the browser
$ firebase login # please log into the google account which holds the firebase project

# './deploy.sh' should take several minutes to complete
$ ./deploy.sh
```

Now, the application is fully ready to be used.
