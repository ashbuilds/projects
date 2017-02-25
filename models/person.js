var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PersonProps = require('../properties.json');		//Get JSON of Person Properties Gender and Pet



var check = {
    gender: function(gender) {							//Validate is listed Gender in "properties.json"
        return PersonProps.gender.filter(function(gen) {
            return gen.value == gender;
        }).length != 0;
    },
    pet: function(pet) {								//Validate is listed Pet in "properties.json"
        return PersonProps.pet.filter(function(p) {
            return p.value == pet;
        }).length != 0;
    }
};

var PersonSchema = new Schema({							//Schema
    name: {
        type: String,
        required: true,
        lowercase: true,								//To lower case for easy sorting
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