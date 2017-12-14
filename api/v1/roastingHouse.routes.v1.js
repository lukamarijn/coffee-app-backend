var express = require('express');
var routes = express.Router();
var RoastingHouse= require('../../src/coffeeRoastingHouse');

routes.post('/roastinghouses', function(req, res) {
    res.contentType('application/json');
    const body = req.body;

    const houseProps = {
        name: body.name,
        city: body.city,
        description: body.description,
        image_url: body.image_url
    };

    RoastingHouse.create(houseProps)
        .then(bar => bar.populate({ path: 'beans'}))
        .then(roastinghouse=> res.status(201).send(roastinghouse))
        .catch((error) => res.status(400).send({error: error.message}));
});

routes.put('/roastinghouses/:id', function(req, res) {
    res.contentType('application/json');
    const body = req.body;

    const id = req.params.id;

    RoastingHouse.findByIdAndUpdate(
        id,
        {
            name: body.name,
            city: body.city,
            image_url: body.image_url,
            description: body.description
        }
    )
        .then(() =>  RoastingHouse.findById({'_id' : id}))
        .then(result =>{ res.status(200).send(result); })
        .catch((error) => res.status(404).send({error: error.message}));

});

routes.get('/roastinghouses', function(req, res) {
    res.contentType('application/json');
    RoastingHouse.find({})
        .then((roastingHouse) => {
            res.status(200).send(roastingHouse);
        })
        .catch((error) => res.status(400).send({error: error.message}));
});

routes.delete('/roastinghouses/:id', function(req, res) {
    res.contentType('application/json');
    const id = req.params.id;

    RoastingHouse.findByIdAndRemove({_id: id})
        .then(roastingHouse => res.status(202).send(roastingHouse))
        .catch((error) => res.status(404).send({error: error.message}));
});

routes.get('/roastinghouses/:id', function(req, res) {
    res.contentType('application/json');

    const id = req.params.id;

    RoastingHouse.find({_id: id})
        .then((roastingHouse) => {
            res.status(200).send(roastingHouse);
        })
        .catch((error) => res.status(400).send({error: error.message}));
});


module.exports = routes;
