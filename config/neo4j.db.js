const neo4j = require('neo4j-driver').v1;

/*const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "password"));*/
const driver = neo4j.driver("bolt://hobby-jfclcepjgmiigbkehfhlgjal.dbs.graphenedb.com:24786", neo4j.auth.basic("username1", "b.EvPgFf2SvQxe.Is4r5Zq1HFDpGGMx"));
module.exports = driver;