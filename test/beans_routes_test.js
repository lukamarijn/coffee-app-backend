const assert = require('assert');
const request = require('supertest')
const driver = require ('../config/neo4j.db.js');
const mongoose = require('mongoose');
const app = require('../app')
const Bean = require('../src/coffeeBean');
const RoastingHouse = require('../src/coffeeRoastingHouse');


const chai = require('chai');
const should = chai.should();

var expect = require('chai').expect;

/*
chai.use(chaiHttp);*/


describe('HTTP methods of beans', () => {

    it('Post to /api/v1/beans creates a new bean', (done) => {

        const roastingHouse = new RoastingHouse({name: 'RoastingHouse', city: 'Nederland'});


        roastingHouse.save().then(() =>
            Bean.count().then(count => {
                request(app)
                    .post('/api/v1/beans')
                    .send({
                        title: 'Decaf Dan',
                        image_url: 'url',
                        large_image_url: 'url',
                        roasting_house: roastingHouse._id,
                        taste: 'zoet',
                        type: 'espresso',
                        plantation: 'plantage',
                        country: 'Afrika'
                    })
                    .end(function (err, res) {
                        Bean.count().then(newCount => {
                            newCount.should.equal(count + 1);

                            driver.session().run("MATCH (b:Bean{_id: {idParam}}) RETURN b", {idParam: res.body._id}).then(bean => {
                                bean.records[0]._fields[0].properties.title.should.equal('Decaf Dan');
                                res.should.have.status(201);
                                done();

                            });
                        });


                    })

            }));
    });

    it('DELETE to /api/v1/beans deletes a bean', (done) => {

        const roastingHouse = new RoastingHouse({name: 'RoastingHouse', city: 'Nederland'});

        roastingHouse.save().then(() => {
            const bean = new Bean({
                title: 'Decaf Dan',
                image_url: 'url',
                large_image_url: 'url',
                roasting_house: roastingHouse._id,
                taste: 'zoet',
                type: 'espresso',
                plantation: 'plantage',
                country: 'Afrika'
            })
            bean.save().then(() => {
                request(app)
                    .delete(`/api/v1/beans/${bean._id}`)
                    .end(function (err, res) {

                        Bean.findOne({_id: bean._id})
                            .then((resultBean) => {
                                assert(resultBean === null);
                                driver.session().run("MATCH (b:Bean{_id: {idParam}}) RETURN b", {idParam: bean._id.toString()}).then(neo4jresult => {
                                    assert(neo4jresult.records.length === 0);
                                    res.should.have.status(200);
                                    done();
                                });

                            });

                    });
            });
        })

    });


  it("returns 400 when invalid json is submitted", function (done) {
        request(app)
            .post('/api/v1/beans')
            .send({})
            .expect(400)
            .end(function (err, res) {

                expect(res).to.have.status(400);
                done()
            })
    })

    it('Get to /api/v1/beans gets beans', (done) => {
        const roastingHouse = new RoastingHouse({name: 'RoastingHouse', city: 'Nederland'});

        roastingHouse.save().then(() => {
            const bean = new Bean({
                title: 'Decaf Dan',
                image_url: 'url',
                large_image_url: 'url',
                roasting_house: roastingHouse._id,
                taste: 'zoet',
                type: 'espresso',
                plantation: 'plantage',
                country: 'Afrika'
            });
            bean.save().then(() =>
                driver.session().run("CREATE (b:Bean {_id : {_id}, title: {title}}) " +
                    "MERGE (p:Plantation {name: {plantation}, country: {country}}) " +
                    "MERGE (t:Taste {title: {taste}}) " +
                    "MERGE (tp:Type{name: {type}}) " +
                    "MERGE (b)-[:PRODUCED_BY]->(p) " +
                    "MERGE (b)-[:HAS_TASTE]-(t) " +
                    "MERGE (b)-[:HAS_TYPE]->(tp) " +
                    "RETURN b, p, t, tp;", {title: 'Decaf Dan',
                    _id: bean._id.toString(),
                    roasting_house: roastingHouse._id,
                    taste: 'zoet',
                    type: 'espresso',
                    plantation: 'plantage',
                    country: 'Afrika'}).then(() => {
                    request(app)
                        .get(`/api/v1/beans`)
                        .end(function (err, res) {

                            Bean.findOne({_id: bean._id})
                                .then((resultBean) => {
                                    assert(resultBean.title === 'Decaf Dan');
                                    driver.session().run("MATCH (b:Bean{_id: {idParam}})" +
                                        "MATCH (b)-[:HAS_TASTE]->(t:Taste) " +
                                        "RETURN b AS bean, t AS taste;", {idParam: resultBean._id.toString()})

                                        .then(neo4jresult => {
                                            neo4jresult.records[0]._fields[0].properties.title.should.equal('Decaf Dan');
                                            neo4jresult.records[0]._fields[1].properties.title.should.equal('zoet');
                                            res.should.have.status(200);
                                            done();
                                        });

                                });

                        });
                }))
        });
    });

    it('Put to /api/v1/beans updates a bean', (done) => {

        const roastingHouse = new RoastingHouse({name: 'RoastingHouse', city: 'Nederland'});

        roastingHouse.save().then(() => {
            const bean = new Bean({
                title: 'Decaf Dan',
                image_url: 'url',
                large_image_url: 'url',
                roasting_house: roastingHouse._id,
                taste: 'zoet',
                type: 'espresso',
                plantation: 'plantage',
                country: 'Afrika'
            });
            bean.save().then(() =>
                driver.session().run("CREATE (b:Bean {_id : {_id}, title: {title}}) " +
                    "MERGE (p:Plantation {name: {plantation}, country: {country}}) " +
                    "MERGE (t:Taste {title: {taste}}) " +
                    "MERGE (tp:Type{name: {type}}) " +
                    "MERGE (b)-[:PRODUCED_BY]->(p) " +
                    "MERGE (b)-[:HAS_TASTE]-(t) " +
                    "MERGE (b)-[:HAS_TYPE]->(tp) " +
                    "RETURN b, p, t, tp;", {title: 'Decaf Dan',
                    _id: bean._id.toString(),
                    roasting_house: roastingHouse._id,
                    taste: 'zoet',
                    type: 'espresso',
                    plantation: 'plantage',
                    country: 'Afrika'}).then(() => {
                    request(app)
                        .put(`/api/v1/beans/${bean._id}`)
                        .send({
                            title: 'Decaf Dannnn',
                            image_url: 'url',
                            large_image_url: 'url',
                            roasting_house: roastingHouse._id,
                            taste: 'kruidig',
                            type: 'espresso',
                            plantation: 'plantage',
                            country: 'Afrika'
                        })
                        .end(function (err, res) {

                            Bean.findOne({_id: bean._id})
                                .then((resultBean) => {
                                    assert(resultBean.title === 'Decaf Dannnn');
                                    driver.session().run("MATCH (b:Bean{_id: {idParam}})" +
                                        "MATCH (b)-[:HAS_TASTE]->(t:Taste) " +
                                        "RETURN b AS bean, t AS taste;", {idParam: resultBean._id.toString()})

                                        .then(neo4jresult => {
                                            neo4jresult.records[0]._fields[0].properties.title.should.equal('Decaf Dannnn');
                                            neo4jresult.records[0]._fields[1].properties.title.should.equal('kruidig');
                                            res.should.have.status(200);
                                            done();
                                        });

                                });

                        });
                }))
            });
        });
    });
