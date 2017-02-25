// calling packages
var express = require('express'); 				// express
var app = express();							// define express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://onlineapps:9xV976CcYO2DncsvoPvBVtshDErPPZxpCMCm8FvyaiIXFSpYwyAvlRVzHj2OfIBKWfHnrm9U6qzkURK6BmIb7g==@onlineapps.documents.azure.com:10250/?ssl=true'); // connect to database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));		//confirming connection
db.once('open', function() {
    console.log("Connected to Database !!")
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 1337;


var router = express.Router();
require('./routes/routing')(app, router);								//include all routes	
app.listen(port);

console.log('Server on port : ' + port);								//fancy a beer