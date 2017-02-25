var Person = require('../models/person');		

module.exports = function(app, router) {

    var path = "/";

    router.get(path, function(req, res) {						//Default app route
        res.json({
            message: 'Something is so awesome inside!!!'
        });
    });

    router.route('/person')										//Set route to person for CURD Ops
        .post(function(req, res) {								//Route to create new Person
            var person = new Person();

            Object.keys(req.body).forEach(function(key) {		//Getting each key/value from request and append it to person collection.	
                person[key] = req.body[key];
            })

            person.save(function(err) {
                if (err)
                    res.send(err);
                res.json({
                    message: 'Person created!'
                });
            });

        })
        .get(function(req, res) {								//Route to Get all Person
            Person.find(function(err, person) {
                if (err)
                    res.send(err);

                res.json(person);
            });
        });

    router.route('/person/:person_id')							//Set route to person by id for URD Ops
        .get(function(req, res) {								//Get Person by ID
            Person.findById(req.params.person_id, function(err, person) {
                if (err)
                    res.send(err);
                res.json(person);
            });
        })
        .put(function(req, res) {								//Update Person By ID
            Person.findById(req.params.person_id, function(err, person) {

                if (err)
                    res.send(err);

                Object.keys(req.body).forEach(function(key) {
                    person[key] = req.body[key];
                })

                person.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({
                        message: 'Person updated!'
                    });
                });

            });
        })
        .delete(function(req, res) {							//Delete Person 	
            Person.remove({
                _id: req.params.person_id
            }, function(err, person) {
                if (err)
                    res.send(err);

                res.json({
                    message: 'Person deleted'
                });
            });
        });

    router.route('/person/filter')							//Perform Filter and sort 
        .post(function(req, res) {
            var sortBy = "sortBy" in req.body ? req.body.sortBy : null;		//Get SortBy key value
            delete req.body.sortBy;

            Person.find(req.body).sort(sortBy).exec(function(err, result) {	//Find person by given Object and apply sort if Available.	
                err ? res.send(err) : res.json(result);
            })
        });

    app.use(path+"api", router);							//Set Api route /api

}