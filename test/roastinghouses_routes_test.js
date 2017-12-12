const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app')
const RoastingHouse = require('../src/coffeeRoastingHouse')

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp)

describe('HTTP methods of roastingHouses', () => {

    it('Get to /api/v1/roastinghouses should GET all the roastinghouses', (done) => {
        chai.request(app)
            .get('/api/v1/roastinghouses')
            .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            done();
            })
    });



    it('Post to /api/v1/roastinghouses creates a new roastinghouse', (done) => {

        RoastingHouse.count().then(count => {
            request(app)
                .post('/api/v1/roastinghouses')
                .send({ name: 'roastinghouse', city: 'Breda'})
                .end(() => {
                    RoastingHouse.count().then(newCount => {
                        assert(count +1 === newCount);
                        done();
                    })
                })
        })
    });

    it('Put to /api/v1/roastingHouses/id updates a  roastinghouse', (done) => {

        const roastingHouse = new RoastingHouse({ name: 'RoastingHouse', city: 'Nederland'});

        roastingHouse.save().then(() => {
            request(app)
                .put(`/api/v1/roastinghouses/${roastingHouse._id}`)
                .send({ name: 'roastinghouse', city: 'Breda'})
                .end(() => {
                    RoastingHouse.findOne({ _id: roastingHouse._id})
                        .then((roastinghouse) => {
                            assert(roastinghouse.city == 'Breda');
                            done();
                        })
                    })
                })
        });

    it('Delete to /api/v1/roastingHouses/id deletes a  roastinghouse', (done) => {

        const roastingHouse = new RoastingHouse({ name: 'RoastingHouse', city: 'Nederland'});

        roastingHouse.save().then(() => {
            request(app)
                .delete(`/api/v1/roastinghouses/${roastingHouse._id}`)
                .end(() => {
                    RoastingHouse.findOne({ _id: roastingHouse._id})
                        .then((roastinghouse) => {
                            assert(roastinghouse == null)
                            done();
                        })
                })
        })
    })

});