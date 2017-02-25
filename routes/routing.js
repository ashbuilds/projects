var Person = require('../models/person');

module.exports = function(app, router) {

    var path = "/nodeSample/";
    path = "/";

    router.use(function(req, res, next) {
        console.log(__filename, __dirname);
        console.log('new Request..');
        next();
    });

    router.get(path, function(req, res) {
        res.json({
            message: 'Test api on azure'
        });
    });

    router.route('/person')
        .post(function(req, res) {
            var person = new Person();

            Object.keys(req.body).forEach(function(key) {
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
        .get(function(req, res) {
            Person.find(function(err, person) {
                if (err)
                    res.send(err);

                res.json(person);
            });
        });

    router.route('/person/:person_id')
        .get(function(req, res) {
            Person.findById(req.params.person_id, function(err, person) {
                if (err)
                    res.send(err);
                res.json(person);
            });
        })
        .put(function(req, res) {
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
        .delete(function(req, res) {
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

    router.route('/person/filter')
        .post(function(req, res) {
            var sortBy = "sortBy" in req.body ? req.body.sortBy : null;
            delete req.body.sortBy;

            Person.find(req.body).sort(sortBy).exec(function(err, result) {
                err ? res.send(err) : res.json(result);
            })
        });

    app.use(path, router);

}