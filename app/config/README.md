# Please fill in the 'system.txt' with your own Firebase credentials
## Following is the example of firebase config credentials

Currently, both 'production' and 'testing' must be filled in for the software to build. If one does not wish to create multiple Firebase Projects, he or she may re-use the same credentials for both 'production' and 'testing' without any issues.

```js
// system.txt
export const databaseConfig = {
  production: {
    apiKey: '------------------------------------',
    authDomain: '------------------------------------',
    databaseURL: '------------------------------------',
    projectId: '------------------------------------',
    storageBucket: '------------------------------------',
    messagingSenderId: '------------------------------------',
    appId: '------------------------------------'
  },
  testing: {
    apiKey: '------------------------------------',
    authDomain: '------------------------------------',
    databaseURL: '------------------------------------',
    projectId: '------------------------------------',
    storageBucket: '------------------------------------',
    messagingSenderId: '------------------------------------',
    appId: '------------------------------------'
  },
  dev: {}
}
```
**Note:** Strings must be single quoted and will not work otherwise due to ESLint.


# Please fill in the 'system.yml' with your own Firebase credentials
## Following is the example of firebase config credentials

Currently, both 'production' and 'testing' must be filled in for the software to build. If one does not wish to create multiple Firebase Projects, he or she may re-use the same credentials for both 'production' and 'testing' without any issues.

```yml
## system.yml
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
