var express = require('express');
var cors    = require('cors')
var app = express();

app.use(cors());

var dummy_initiatives = require('./dummy_initiatives');
var initiatives = dummy_initiatives.initiatives;
//


app.get('/initiative/:id', function(req, res, next) {
	res.json(initiatives.find(init => init._id == req.params.id));
})

app.get('/initiatives/search', function(req, res, next) {
	res.json(initiatives);
})

app.listen(5000, function () {
	console.log('Listening to port 5000');
})

