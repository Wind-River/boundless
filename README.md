# Boundless
Boundless Innovation Portal

# Installation Guide
**Note:** Docker compose is required and must support version 3.7+

## Application

Please fill in Firebase configuration inside docker-compose.yml file.
```yaml
 6|      args:
 7|        - FIREBASE_API_KEY="---------------------------------"
 8|        - FIREBASE_AUTH_DOMAIN="---------------------------------"
 9|        - FIREBASE_DATABASE_URL="-----------------------------------"
10|        - FIREBASE_PROJECT_ID="------------------------------------"
11|        - FIREBASE_STORAGE_BUCKET="------------------------------------"
12|        - FIREBASE_MESSAGING_SENDER_ID="------------------------------------"
13|        - FIREBASE_APP_ID="------------------------------------"
```

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
