<!-- ##
## Copyright (c) 2019 Wind River Systems, Inc.
##
## Licensed under the Apache License, Version 2.0 (the "License");
## you may not use this file except in compliance with the License.
## You may obtain a copy of the License at:
##       http://www.apache.org/licenses/LICENSE-2.0
## Unless required by applicable law or agreed to in writing, software  distributed
## under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
## OR CONDITIONS OF ANY KIND, either express or implied.
## -->

# Boundless Innovation Tracker
#### Installation & Running Guide
**Note:** If the user has not installed quasar please follow the guide below first and go back to the main installation guide:
```bash
  # quasar installation

  install visual studio code
  install node 

  $ npm install -g vue-cli
  $ npm install -g @quasar/cli

  $ quasar create {foldername}

  $ cd {foldername}
  $ quasar dev

  # check for upgradable packages
  $ quasar upgrade

  # do the actual upgrade
  $ quasar upgrade --install
```

Given that the user has already installed quasar on their local machine. Please note that this application is built with **npm** and not **yarn**.
```
  $ git clone {link}
  $ cd boundless1
```
MORE INFORMATION ON WHAT FILES TO MODIFY BEFORE RUNNING.
MAIN FILE IS src/firebase/init_primary.js and src/firebase/init_test.js
Get the Firebase config...


#### Running and Sandboxing Guide

Once user has finished cloning the git repo, the user can simply run the Sandbox mode by running the following commands.
```bash
  $ npm i
  $ quasar dev
```

#### Building Guide
The link below covers all majority of the websever and please refer to them while building.
```
  // https://quasar.dev/quasar-cli/cli-documentation/commands-list#build
  // https://quasar.dev/quasar-cli/developing-spa/deploying
```

#### Hosting & Deploying Guide
Please follow the guides below to host or deploy software/application on the webserver of your liking.
```
  // https://firebase.google.com/docs/hosting
  // https://quasar.dev/quasar-cli/developing-spa/deploying
```


##### Acknowledgement
All the codes and guides are consolidated from https://quasar.dev/introduction-to-quasar. Please go checkout this amazing framework.

Please go checkout Firebase for all the amazing backend services they provide from https://firebase.google.com/.
