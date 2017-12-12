var env = {
    webPort: process.env.PORT || 3000,
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || '',
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbDatabase: process.env.DB_DATABASE || 'coffee-app-backend'
};


if (process.env.NODE_ENV = 'test') {
    dburl = 'mongodb://localhost/coffee-app-backend-test'
}

   /* var dburl = process.env.NODE_ENV === 'production' ?
        'mongodb://' + env.dbUser + ':' + env.dbPassword + '@' + env.dbHost + ':' + env.dbPort + '/' + env.dbDatabase :
        'mongodb://localhost/' + env.dbDatabase;*/

   var dburl = 'mongodb://username1:password1@ds135956.mlab.com:35956/coffee-app-backend';


module.exports = {
    env: env,
    dburl: dburl
};