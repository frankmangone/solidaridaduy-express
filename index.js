const express = require('express');
const bcrypt  = require('bcrypt');
const body_parser = require('body-parser');
const cors    = require('cors');
const salt_rounds = 10;

const app     = express();

//app.use(bodyParser.urlencoded({ extended: true }));
app.use(body_parser.json());
app.use(cors());


var initiatives = require('./dummy_initiatives');
initiatives = initiatives.initiatives;

var admins = require('./dummy_admins');
admins = admins.admins
for (var i = 0; i < admins.length; i++) {
	admins[i].password_digest = bcrypt.hashSync(admins[i].password, salt_rounds);
}

//

// Admin Routes ---------------------------------------------------

app.post('/admin/login', function(req, res) {
	// Request body should be { email, password }
	let admin = admins.find(adm => adm.email == req.body.email);
	if (!!admin) {
		bcrypt.compare(req.body.password, admin.password_digest, function(err, result) {
			if (result) {
				res.json(admin)
			}
			else {
				res.json({ validation_errors: { password: 'INVALID' } })
			}
		})
	}
	else {
		res.json({ validation_errors: { email: 'INVALID' } })
	}
})

// initiative Routes ----------------------------------------------

app.get('/initiative/:id', function(req, res) {
	res.json(initiatives.find(init => init._id == req.params.id));
})

app.get('/initiatives/search', function(req, res) {
	res.json(initiatives);
})

app.listen(5000, function () {
	console.log('Listening to port 5000');
})

