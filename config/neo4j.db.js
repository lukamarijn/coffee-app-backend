const neo4j = require('neo4j-driver').v1;
const config = require('./env/env');

var driver;

if (process.env.NODE_ENV === 'production') {
    driver = neo4j.driver("bolt://hobby-jfclcepjgmiigbkehfhlgjal.dbs.graphenedb.com:24786", neo4j.auth.basic("username1", "b.EvPgFf2SvQxe.Is4r5Zq1HFDpGGMx"));
    console.log("production environment");
}

if (process.env.NODE_ENV === 'test') {
    driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j-test", "password"));
    console.log("test environment");
}
else {
    driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "password"));
    console.log("normal environment");
}

module.exports = driver;