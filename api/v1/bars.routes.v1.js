var express = require('express');
var routes = express.Router();
var Bar = require('../../src/coffeeBar');

routes.get('/bars', function(req, res) {
    res.contentType('application/json');
    Bar.find({})
        .populate({ path: 'beans'})
        .then((beans) => {
            res.status(200).json(beans);
        })
        .catch((error) => res.status(400).send({error: error.message}));
});


routes.get('/bars/:name', function(req, res){

    res.contentType('application/json');
    const  name = req.params.name;
    Bar.find({ 'name' : name})
        .populate({ path: 'beans'})
        .then((bar) => {
            res.status(200).json(bar);
        })
        .catch((error) => res.status(400).send({error: error.message}));
});
routes.post('/bars', function(req, res) {
    res.contentType('application/json');
    const body = req.body;

    const barProps = {
        name: body.name,
        city: body.city,
        beans: body.beans
    };

    Bar.create(barProps)
        .then(bar =>
            Bar.findById({'_id' : bar.id})
            .populate('beans'))
        .then(result2 => res.status(201).send(result2))
        .catch((error) => res.status(400).send({error: error.message}));
});

routes.put('/bars/:id', function(req, res) {
    const body = req.body;

    const id = req.params.id;

    Bar.findByIdAndUpdate(
        id,
        {
            name: body.name,
            beans: body.beans
        }
    )
        .then(bar =>
            Bar.findById({'_id' : bar.id})
                .populate('beans'))
        .then(result2 => res.status(201).send(result2))
        .catch((error) => res.status(404).send({error: error.message}));

});
routes.delete('/bars/:id', function(req, res) {
    res.contentType('application/json');
    const id = req.params.id;

    Bar.findByIdAndRemove({_id: id})
        .then(bar => res.status(202).send(bar))
        .catch((error) => res.status(404).send({error: error.message}));
});

routes.get('/bars/:id', function(req, res){
    res.contentType('application/json');
    const id = req.params.id;

    Bar.findById({'_id' : id})
        .populate('beans')
        .then((bar) => {
            res.status(200).send(bar);
        })
        .catch((error) => res.status(400).send({error: error.message}));
});

routes.get('/bars/:id/beans', function(req, res){

    const id = req.params.id;

    Bar.findById({'_id' : id})
        .populate('beans')
        .then((beans) => {
            res.status(200).json(beans.toJSON().beans);
        })
        .catch((error) => res.status(400).send({error: error.message}));

});

module.exports = routes;