<!-- ##
## Copyright (c) 2020 Wind River Systems, Inc.
##
## Licensed under the Apache License, Version 2.0 (the "License");
## you may not use this file except in compliance with the License.
## You may obtain a copy of the License at:
##       http://www.apache.org/licenses/LICENSE-2.0
## Unless required by applicable law or agreed to in writing, software  distributed
## under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
## OR CONDITIONS OF ANY KIND, either express or implied.
## -->

## Techologies Needed:
* VS Code
* GitBash
* Vue.js - understanding Vue.js is particulartly important. 
* Quasar Framework
* Firebase
* gCloud
* Make
* Node.js

## Quasar Framework Guide
#### Installation & Running Guide
**Note:** If the developer/contributor has not installed quasar please follow the guide below first and go back to the main installation guide:
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

#### Running and Sandboxing Guide
Once user has finished cloning the git repo, the user can simply run the Sandbox mode by running the following commands.
```bash
$ npm i
$ quasar dev
```

## Setting Up Fork Environment:
* [Adding Upstream](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/configuring-a-remote-for-a-fork)
* [Syncing with Upstream](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/syncing-a-fork)

```bash
$ git fetch upstream -a
$ git pull upstream {branch_name}
```
**Note:** This should be done once per day or once before you start developing

Contributors may commit as many as they please but squash the commits to make to one commit above current dev branch upstream before "Pull Request".
```bash
# squashing git commits
$ git reset --soft HEAD~n && git commit -s -m "msg"
# or
$ git reset --soft {hash} && git commit -s -m "msg"
$ git push -f
```

When trying to merge to the upstream, please request a "Pull Request" to the boundless from GitHub.com

## Coding Standards:
* [Google Javascript Style Guide](https://google.github.io/styleguide/jsguide.html)
* ESLint (This is required since Quasar Framework demands correct ESLint syntax to compile)
* Async/Await syntax must be used for all Promises even for Promise.all(promises)
```js
  try {
    let doc = await promiseCall1(...)
    let data = await promiseCall2(doc)
    ...
  } catch (error) {
    ...
  }

// PLEASE AVOID THE FOLLOWING

  return promiseCall1(...)
    .then(doc => {
      return promiseCall2(doc)
      ...
    })
    .then(data => {
      ...
    })
    .catch(error => {
      ...
    })
```

* Variables must be camal case and must be self-explanatory for readibility purposes
* Vue component variables shall be explained in the time of declaration
```js
data () {
    return {
      db: null, // <Object>: firebase firestore credentials
      aboutData: null, // <Object>: text to be displayed on the right panel
      layoutConfig: null, // <Object>: configurations related to layout
      loading: true, // <Boolean>: flag for loading animation
      projectList: [], // <Array<Object>>: list of visible projects
      challengeList: [], // <Array<Object>>: list of visible challenges
      innovatorList: [], // <Array<Object>>: list of innovators for the projects
      sponsorList: [], // <Array<Object>>: list of sponsors for the challenges
      // keywords <Array<String>>: list of keywords appearing in all challenges
      keywords: [],
      keywordsInUse: [], // <Array<String>>: list of keywords in use
      keywordsCounter: {}, // <Map>: map of how many times each keywords appear
      keywordsValToKeyMap: {}, // <Map>: map of value to key of keywords
      keywordsImage: {} // <Map>: map of keyword's images
    }
  }

// PLEASE AVOID THE FOLLOWING

  data () {
    return {
      db: null,
      aboutData: null,
      layoutConfig: null,
      loading: true,
      projectList: [],
      challengeList: [],
      innovatorList: [],
      sponsorList: [],
      keywords: [],
      keywordsInUse: [],
      keywordsCounter: {},
      keywordsValToKeyMap: {},
      keywordsImage: {}
    }
  }
```
* Vue component methods shall be explained as well as return type and arguments
```js
  methods: {
    functionOne: async function () {
      /**
       * <PURPOSE OF THE FUNCTION>
       * @param {void}
       * @return {Promise<Boolean>}
       */
      ...
    },
    functionTwo: function () {
      /**
       * <PURPOSE OF THE FUNCTION>
       * @param {void}
       * @return {void}
       */
      ...
    },
    functionThree: function () {
      /**
       * <PURPOSE OF THE FUNCTION>
       * @param {void}
       * @return {void}
       */
      ...
    }
  }

// PLEASE AVOID THE FOLLOWING

  methods: {
    functionOne: async function () {
      ...
    },
    functionTwo: function () {
      ...
    },
    functionThree: function () {
      ...
    }
  }
```
* Vue components shall be named with capital character at the start of the filename and camal cased with .vue extension
* While possible please build reusable vue components
* Please follow the 80 (code) and 120 (html) standard as much as possible
```html
  <div
    class="col-3 q-mt-sm q-mb-sm q-ml-sm q-pa-sm shadow-2"
    style="overflow: auto; border-radius: 3px; min-width: 300px;"
    align="center"
  >
    <!-- html body -->
  </div>

<!-- PLEASE AVOID THE FOLLOWING -->

  <div class="col-3 q-mt-sm q-mb-sm q-ml-sm q-pa-sm shadow-2" style="overflow: auto; border-radius: 3px; min-width: 300px;" align="center">
    <!-- html body -->
  </div>
```

```js
  if (
    someComplicatedLogicA && someComplicatedLogicB &&
    someComplicatedLogicC && someComplicatedLogicD &&
    someComplicatedLogicE && someComplicatedLogicF
  ) {
    // some code
  }

// PLEASE AVOID THE FOLLOWING

  if (someComplicatedLogicA && someComplicatedLogicB && someComplicatedLogicC && someComplicatedLogicD && someComplicatedLogicE && someComplicatedLogicF) {
    // some code
  }
```

## Contributors 
Quasar has library for
  * Quasar sesssion storage - can store anything and is more safe [link](https://quasar.dev/quasar-plugins/web-storage#SessionStorage-API)
  * Quasar local storage  - more presistant [link](https://quasar.dev/quasar-plugins/web-storage#LocalStorage-API)
  * Quasar cookie storage - safetest but have space limitation (only can store 4MB) [link](https://quasar.dev/quasar-plugins/cookies#Cookies-API)
[One can find more information here:](https://quasar.dev/quasar-plugins/cookies#Cookies-API)

It is highly advised that the contributors use the following libary since Quasar helps JSON.load and JSON.dump as opposed to the developers needing to handle them individually. However, developers may choose to use browser's built in function.
