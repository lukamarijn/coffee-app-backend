var env = {
    webPort: process.env.PORT || 3000,
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || '',
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbDatabase: process.env.DB_DATABASE || 'coffee-app-backend',
    neo4jHost: process.env.NEO4J_HOST || '',
    neo4jPort: process.env.NEO4J_PORT || '',
    neo4jUser: process.env.NEO4J_USER || '',
    neo4jPassword: process.env.NEO4J_PASSWORD || '',
};

var dburl;

if (process.env.NODE_ENV === 'test') {
    dburl = 'mongodb://localhost/coffee-app-backend-test'
}

   else if (process.env.NODE_ENV === 'production') {
       dburl= 'mongodb://' + env.dbUser + ':' + env.dbPassword + '@' + env.dbHost + ':' + env.dbPort + '/' + env.dbDatabase
        console.log(dburl);

      /* dburl = 'mongodb://username1:password1@ds135956.mlab.com:35956/coffee-app-backend';*/
   }
else {
       dburl =  'mongodb://localhost/' + env.dbDatabase;
   }

module.exports = {
    env: env,
    dburl: dburl
};