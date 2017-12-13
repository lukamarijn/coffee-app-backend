const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app')
const Bar = require('../src/coffeeBar');
const Bean = require('../src/coffeeBean');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp)

describe('HTTP methods of bars', () => {

    it('Get to /api/v1/bars should GET all bars', (done) => {
        chai.request(app)
            .get('/api/v1/bars')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            })
    });



    it('Post to /api/v1/bars creates a new bar', (done) => {

        Bar.count().then(count => {
            request(app)
                .post('/api/v1/bars')
                .send({ name: 'bar', city: 'Breda'})
                .end(() => {
                    Bar.count().then(newCount => {
                        assert(count +1 === newCount);
                        done();
                    })
                })
        })
    });

    it('Get to /api/v1/bars/:id/beans get the beans of the bar', (done) => {

        const bean = new Bean({
            title: 'Decaf Dan',
            image_url: 'url',
            large_image_url: 'url',
        });

        bean.save().then(() => {
            const bar = new Bar({
                name: 'bar',
                city: 'Breda',
                beans: [bean._id] });
                bar.save().then(() => {
                request(app)
                    .get(`/api/v1/bars/${bar.id}/beans`)
                    .end((err, res) => {
                        assert(res.body[0].title === 'Decaf Dan');
                        done();
                    })
            })
        })
    });



    it('Put to /api/v1/bars/id updates a bar', (done) => {

        const bar = new Bar({ name: 'bar', city: 'Nederland'});

        bar.save().then(() => {
            request(app)
                .put(`/api/v1/bars/${bar._id}`)
                .send({ name: 'newBar', city: 'Breda'})
                .end(() => {
                    Bar.findOne({ _id: bar._id})
                        .then((bar) => {
                            assert(bar.name  == 'newBar');
                            done();
                        })
                })
        })
    });

    it('Delete to /api/v1/bars/id deletes a  bar', (done) => {


        const bar = new Bar({ name: 'bar', city: 'Nederland'});

        bar.save().then(() => {
            request(app)
                .delete(`/api/v1/bars/${bar._id}`)
                .end(() => {
                    Bar.findOne({ _id: bar._id})
                        .then((bar) => {
                            assert(bar === null);
                            done();
                        })
                })
        })
    });



});