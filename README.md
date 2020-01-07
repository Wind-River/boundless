# Boundless
Boundless Innovation Portal

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

Making sure docker-compose is installed.

```bash
$ docker-compose -v
docker-compose version 1.25.0, build b42d419
```

Once once has verified that both docker-compose and Firebase configuration
credentials are installed, please run the following:

```bash
$ docker-compose build
$ docker-compose up
```

Once the docker-compose up is up and running, you may connect to the IP via
browser and explore the software.

**Note:** Currently, Firebase-functions are not automated.

## Firebase-Functions
