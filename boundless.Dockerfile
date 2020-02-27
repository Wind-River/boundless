FROM node:12-alpine

ARG apiKey
ARG authDomain
ARG databaseURL
ARG projectId
ARG storageBucket
ARG messagingSenderId
ARG appId

COPY ./app/client/. /app

RUN cd /app && \
  apiKey=${apiKey//\"} && \
  authDomain=${authDomain//\"} && \
  databaseURL=${databaseURL//\"} && \
  projectId=${projectId//\"} && \
  storageBucket=${storageBucket//\"} && \
  messagingSenderId=${messagingSenderId//\"} && \
  appId=${appId//\"} && \
  echo -e "\
export const databaseConfig = {\\n\
  production: {\\n\
    apiKey: '${apiKey//\'/}',\\n\
    authDomain: '${authDomain//\'/}',\\n\
    databaseURL: '${databaseURL//\'/}',\\n\
    projectId: '${projectId//\'/}',\\n\
    storageBucket: '${storageBucket//\'/}',\\n\
    messagingSenderId: '${messagingSenderId//\'/}',\\n\
    appId: '${appId//\'/}'\\n\
  },\\n\
  testing: {\\n\
    apiKey: '${apiKey//\'/}',\\n\
    authDomain: '${authDomain//\'/}',\\n\
    databaseURL: '${databaseURL//\'/}',\\n\
    projectId: '${projectId//\'/}',\\n\
    storageBucket: '${storageBucket//\'/}',\\n\
    messagingSenderId: '${messagingSenderId//\'/}',\\n\
    appId: '${appId//\'/}'\\n\
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
