const express = require('express');

const bcrypt  = require('bcrypt');
const salt_rounds = 10;

const body_parser = require('body-parser');
const cors    = require('cors');

const jwt 	  = require('jsonwebtoken');
const access_token_secret = 'la./solidaridad-_0es??_una/\cosa_(?)maravillosa';

const app     = express();

//app.use(bodyParser.urlencoded({ extended: true }));
app.use(body_parser.json());
app.use(cors());


/* Dummy data ------------------------------------------------ */
var initiatives = require('./dummy_initiatives');
initiatives = initiatives.initiatives;

var admins = require('./dummy_admins');
admins = admins.admins
for (var i = 0; i < admins.length; i++) {
	admins[i].password_digest = bcrypt.hashSync(admins[i].password, salt_rounds);
}
/* ----------------------------------------------------------- */


//

// Authentication middleware --------------------------------------
function authenticateJWT(req, res, next) {
	const authHeader = req.headers.authorization;

	if (authHeader) {
		// The split is because of the format: Bearer ajshgdqe...
		const token = authHeader.split(' ')[1];
		jwt.verify(token, access_token_secret, (err) => {
			if (err) {
				// Return Forbidden
				return res.sendStatus(403);
			}
			next();
		});
	}
	else {
		// Return Unauthorized
		res.sendStatus(401);
	}
}

//

// Admin Routes ---------------------------------------------------

app.post('/admin/login', function(req, res) {
	// Request body should be { email, password }
	let admin = admins.find(adm => adm.email == req.body.email);
	if (!!admin) {
		bcrypt.compare(req.body.password, admin.password_digest, function(err, result) {
			if (result) {
				const access_token = jwt.sign(
										{ email: admin.email }, 
										access_token_secret,
										{ expiresIn: '20m' });
				res.json({ 
					admin: { 
						first_name: admin.first_name,
						last_name:  admin.last_name,
					},
					access_token 
				});
			}
			else {
				res.json({ validation_errors: { password: 'INVALID_PASSWORD' } });
			}
		})
	}
	else {
		res.json({ validation_errors: { email: 'EMAIL_NOT_FOUND' } });
	}
})

app.get('/admin/initiatives', authenticateJWT, function(req, res) {
	// TODO: Pagination?
	res.json(initiatives);
})

app.get('/admin/verify', authenticateJWT, function(req, res) {
	// TODO: Use this route to verify that the user is still logged in
	res.send(true);
});



// Initiative Routes ----------------------------------------------

app.get('/initiative/:id', function(req, res) {
	res.json(initiatives.find(init => init._id == req.params.id));
})

app.get('/initiatives/search', function(req, res) {
	// TODO: Perform the search!
	res.json(initiatives);
})

app.listen(5000, function () {
	console.log('Listening to port 5000');
})

