var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PersonProps = require('../properties.json');



var check = {
    gender: function(gender) {
        return PersonProps.gender.filter(function(gen) {
            return gen.value == gender;
        }).length != 0;
    },
    pet: function(pet) {
        return PersonProps.pet.filter(function(p) {
            return p.value == pet;
        }).length != 0;
    }
};

var PersonSchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true,
        validate: check.gender
    },
    pet: {
        type: String,
        required: true,
        validate: check.pet
    }
});

module.exports = mongoose.model('Person', PersonSchema);