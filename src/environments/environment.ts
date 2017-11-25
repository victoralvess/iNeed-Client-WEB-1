// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDEeq0uXlCaOOIorAbxMJEe_6Uobr6O_1M',
    authDomain: 'default-project-d4f76.firebaseapp.com',
    databaseURL: 'https://default-project-d4f76.firebaseio.com',
    projectId: 'default-project-d4f76',
    storageBucket: 'default-project-d4f76.appspot.com',
    messagingSenderId: '553175398310'
  },
  apis: {
    ineed: {
      optmization: {
        //  url: 'http://localhost:8081',
        url: 'http://2need.store',
        key: ''
      }
    },
    google: {
      geocoding: {
        url: 'https://maps.googleapis.com/maps/api/geocode/json?',
        key: 'AIzaSyDBMaCLamHn33qRqgqKDs0KFxelcY1yFS0'
        // key: 'AIzaSyB8228EjbA5c_KZddHe9TgsOn1vP4ZkwMY'
        // key: 'AIzaSyB8228EjbA5c_KZddHe9TgsOn1vP4ZkwMY'
      }
    },
    webmania: {
      url: 'https://webmaniabr.com/api/1/cep/',
      key: 'Um63CZFPUQQYIOazveLh6HziEKwt9kvS',
      app_secret: '5NPddVdikevehe7GjwHK56WPLaJqRwhnLxemxD9qPZ6JBuAL'
    }
  }
};
