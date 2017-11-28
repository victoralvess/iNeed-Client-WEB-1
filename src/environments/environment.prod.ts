export const environment = {
  production: true,
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
        url: 'https://2need.store',
        key: ''
      },
      auth0: {
        domain: 'default-tenant.auth0.com',
        clientID: 'bK8ww4-EDzJUgz-lcdg5JTRz8hCPtTQi',
        redirectUri: 'https://2need.store/callback',
        responseType: 'token id_token',
        scope: 'openid profile'
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
