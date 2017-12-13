const express = require('express');
const routes = express.Router();
const Bean = require('../../src/coffeeBean');
const app = express();
const neo4j = require('../../config/neo4j.db');



routes.post('/beans', function(req, res) {
    res.contentType('application/json');
    const body = req.body;
    const session = neo4j.session();

    const beansProps = {
        title: body.title,
        description: body.description,
        image_url: body.image_url,
        large_image_url: body.large_image_url,
        roasting_house: body.roasting_house
    };

    Bean.create(beansProps)
        .then(bean => {
            session.run("CREATE (b:Bean {_id : {_id}, title: {titleParam}}) " +
                "MERGE (p:Plantation {name: {plantationParam}, country: {countryParam}}) " +
                "MERGE (t:Taste {title: {tasteParam}}) " +
                "MERGE (tp:Type{name: {typeParam}}) " +
                "MERGE (b)-[:PRODUCED_BY]->(p) " +
                "MERGE (b)-[:HAS_TASTE]-(t) " +
                "MERGE (b)-[:HAS_TYPE]->(tp) " +
                "RETURN b, p, t, tp;", {
                titleParam: bean.title,
                _id: bean._id.toString(),
                tasteParam: body.taste,
                plantationParam: body.plantation,
                countryParam: body.country,
                typeParam: body.type
            })
            .then(result => {
                Bean.findOne(bean).populate('roasting_house')
                    .then((fullBean) => {

                        var resultBean;
                        result.records.forEach(function (record) {

                            resultBean = {
                                _id: bean._id,
                                title: bean.title,
                                large_image_url: bean.large_image_url,
                                image_url: bean.image_url,
                                roasting_house: fullBean.roasting_house,
                                plantation: record._fields[1].properties.name,
                                country: record._fields[1].properties.country,
                                taste: record._fields[2].properties.title,
                                type: record._fields[3].properties.name

                            }
                        });
                        res.status(201).send(resultBean);
                        session.close();
                    })
                    .catch(error => res.status(400).send({error: error.message}));
            })
            .catch(error => res.status(400).send({error: error.message}));
         })
        .catch((error) => res.status(400).send({error: error.message}));
});

routes.put('/beans/:id', function(req, res) {

    const body = req.body;
    const session = neo4j.session();

    const id = req.params.id;


    Bean.findByIdAndUpdate(
        id,
        {
            title: body.title,
            roasting_house: body.roasting_house,
            large_image_url: body.large_image_url,
            image_url: body.image_url
        })
        .then(() => {
            Bean.findOne({_id: id}).populate('roasting_house')
                .then(bean => {
                    session.run("MATCH (b:Bean {_id : {_id}})-[r1:HAS_TASTE]->(:Taste) " +
                     "MATCH (b)-[r2:HAS_TYPE]->(:Type) " +
                     "MATCH (b)-[r3:PRODUCED_BY]->(:Plantation) " +
                     "DELETE r1, r2, r3 " +
                     "MERGE (p:Plantation {name: {plantationParam}, country: {countryParam}}) " +
                     "MERGE (t:Taste {title: {tasteParam}}) " +
                     "MERGE (tp:Type{name: {typeParam}}) " +
                     "MERGE (b)-[:PRODUCED_BY]->(p) " +
                     "MERGE (b)-[:HAS_TASTE]-(t) " +
                     "MERGE (b)-[:HAS_TYPE]->(tp) " +
                     "SET b.title = '" + bean.title +
                     "' RETURN b, p, t, tp;", {
                     _id: id.toString(),
                     tasteParam: body.taste,
                     plantationParam: body.plantation,
                     countryParam: body.country,
                     typeParam: body.type
                     }).then(result => {


                            var resultBean = {
                               _id: bean._id,
                                title: bean.title,
                                large_image_url: bean.large_image_url,
                                image_url: bean.image_url,
                                roasting_house: bean.roasting_house,
                                plantation: result.records[0]._fields[1].properties.name,
                                country: result.records[0]._fields[1].properties.country,
                                taste: result.records[0]._fields[2].properties.title,
                                type: result.records[0]._fields[3].properties.name

                            };

                     session.close();

                     res.status(200).send(resultBean)
                     })
                     .catch(error => console.log(error))
                     })
                .catch(error => console.log(error));
                })
        });


routes.delete('/beans/:id', function(req, res) {
    res.contentType('application/json');
    const id = req.params.id;
    const session = neo4j.session();

    Bean.findByIdAndRemove({_id: id})
        .then(bean => {
            session.run('MATCH (b:Bean { _id: {id} })DETACH DELETE b', {id : id})
                .then(result =>  res.status(200).send(bean))
                .catch((error) => res.status(404).send({error: error.message}));
            })
        .catch((error) => res.status(404).send({error: error.message}))

});



routes.get('/beans', function(req, res) {

    res.contentType('application/json');
    var name = req.query.name || '';
    const title = req.query.title || '';
    var taste = req.query.taste || '';
    var type = req.query.type || '';

    var searchString = {};

    if (title) {
        searchString.title = title;
    }


    if (name) {
        name = "name:'" + name + "'" ;
    }
    else {
        name = "";
    }

    if (taste) {
        taste = "title:'" + taste + "'" ;
    }
    else {
        taste = "";
    }

    if (type) {
        type = "name:'" + type + "'" ;
    }
    else {
        type = "";
    }



    const session = neo4j.session();


    Bean.find(searchString)
        .populate({path: 'roasting_house'})
        .then((beans) => {

            session.run("MATCH (b:Bean)-[]-(p:Plantation{" + name+ "}) "  +
                "MATCH (b:Bean)-[:HAS_TASTE]->(t:Taste{" + taste+ "}) " +
            "MATCH (b:Bean)-[:HAS_TYPE]->(tp:Type{" + type + "}) " +
                "RETURN b AS bean, p AS plantation, tp AS type, t AS taste;")
                .then(result2 => {
                    var beanArr = [];
                    console.log(title.toString());
                    for (var i = 0; i < beans.length; i++) {
                        result2.records.forEach(function (record) {

                            if (beans[i]._id == record._fields[0].properties._id) {
                                beanArr.push(
                                    {
                                        _id: beans[i]._id,
                                        title: beans[i].title,
                                        large_image_url: beans[i].large_image_url,
                                        image_url: beans[i].image_url,
                                        roasting_house: beans[i].roasting_house,
                                        plantation: record._fields[1].properties.name,
                                        country: record._fields[1].properties.country,
                                        type:  record._fields[2].properties.name,
                                        taste:  record._fields[3].properties.title

                                    })
                            }
                        })
                    }

                    res.send(beanArr);

                    session.close()

                })
                .catch((error) => res.status(404).send({error: error.message}))

        });
});




module.exports = routes;
