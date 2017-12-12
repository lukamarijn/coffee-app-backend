
const mongoose = require('mongoose');
const config = require('../config/env/env');

before(done => {
    mongoose.connect(config.url);
    mongoose.connection
        .once('open', () => done())
        .on('error', err => {
            console.warn('Warning', err);
        });
});

beforeEach(done => {
    mongoose.connection.db.dropDatabase()
        .then(() => done())
        .catch(() => done());
});
