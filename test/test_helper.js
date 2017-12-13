
const mongoose = require('mongoose');
const config = require('../config/env/env');
const driver = require ('../config/neo4j.db.js');

before(done => {
    mongoose.connect(config.dburl);
    mongoose.connection
        .once('open', () => done())
        .on('error', err => {
            console.warn('Warning', err);
        });

});

beforeEach(done => {
    mongoose.connection.db.dropDatabase()
        .then(() => {
            driver.session().run("MATCH (n) DETACH DELETE n")
            done()})
        .catch(() => done());

});




