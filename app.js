require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();

const userRoutes = require('./backend/routes/userRoutes');
const pokedexRoutes = require('./backend/routes/pokedexRoutes');
const animeRoutes = require('./backend/routes/animeRoutes');
const gameRoutes = require('./backend/routes/gameRoutes');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'frontend/Views'));

app.use(express.urlencoded({ extended: false }));
app.use(session({
	secret: 'my-super-secret-key',
	resave: false,
	saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, 'frontend')));

app.use(userRoutes);
app.use(pokedexRoutes);
app.use(animeRoutes);
app.use(gameRoutes);

// 404 handler - render custom error page
app.use((req, res, next) => {
	res.status(404).render('Page_not_found', {
		isLoggedIn: req.session && req.session.isLoggedIn ? true : false,
		username: req.session && req.session.username ? req.session.username : null
	});
});

app.listen(3000);

