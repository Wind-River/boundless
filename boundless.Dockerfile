FROM node:12-alpine

ARG FIREBASE_API_KEY
ARG FIREBASE_AUTH_DOMAIN
ARG FIREBASE_DATABASE_URL
ARG FIREBASE_PROJECT_ID
ARG FIREBASE_STORAGE_BUCKET
ARG FIREBASE_MESSAGING_SENDER_ID
ARG FIREBASE_APP_ID

COPY ./app/client/. /app

RUN cd /app && \
  FIREBASE_API_KEY=${FIREBASE_API_KEY//\"} && \
  FIREBASE_AUTH_DOMAIN=${FIREBASE_AUTH_DOMAIN//\"} && \
  FIREBASE_DATABASE_URL=${FIREBASE_DATABASE_URL//\"} && \
  FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID//\"} && \
  FIREBASE_STORAGE_BUCKET=${FIREBASE_STORAGE_BUCKET//\"} && \
  FIREBASE_MESSAGING_SENDER_ID=${FIREBASE_MESSAGING_SENDER_ID//\"} && \
  FIREBASE_APP_ID=${FIREBASE_APP_ID//\"} && \
  echo -e "\
export const databaseConfig = {\\n\
  production: {\\n\
    apiKey: '${FIREBASE_API_KEY//\'/}',\\n\
    authDomain: '${FIREBASE_AUTH_DOMAIN//\'/}',\\n\
    databaseURL: '${FIREBASE_DATABASE_URL//\'/}',\\n\
    projectId: '${FIREBASE_PROJECT_ID//\'/}',\\n\
    storageBucket: '${FIREBASE_STORAGE_BUCKET//\'/}',\\n\
    messagingSenderId: '${FIREBASE_MESSAGING_SENDER_ID//\'/}',\\n\
    appId: '${FIREBASE_APP_ID//\'/}'\\n\
  },\\n\
  testing: {\\n\
    apiKey: '${FIREBASE_API_KEY//\'/}',\\n\
    authDomain: '${FIREBASE_AUTH_DOMAIN//\'/}',\\n\
    databaseURL: '${FIREBASE_DATABASE_URL//\'/}',\\n\
    projectId: '${FIREBASE_PROJECT_ID//\'/}',\\n\
    storageBucket: '${FIREBASE_STORAGE_BUCKET//\'/}',\\n\
    messagingSenderId: '${FIREBASE_MESSAGING_SENDER_ID//\'/}',\\n\
    appId: '${FIREBASE_APP_ID//\'/}'\\n\
  },\\n\
  dev: {}\\n\
}\
" > database.cred.js && \
  cd /app && \
  yarn install && \
  npx quasar build

FROM httpd:2-alpine

COPY --from=0 /app/dist/. /app

RUN cp -r /app/spa/. /usr/local/apache2/htdocs/
