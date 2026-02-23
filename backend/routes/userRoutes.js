const express = require('express');
const userController = require('../controllers/userController');

const DUMMY_PROFILE = {
    username: 'dummy1',
    birth_date: '2000-01-01',
    city: 'Tel-Aviv',
    gender: 'Other',
    occupation: 'Working'
};

const router = express.Router();

// Helper function to pass session variables to views
const getSessionData = (req) => {
    return {
        isLoggedIn: req.session && req.session.isLoggedIn ? true : false,
        username: req.session && req.session.username ? req.session.username : null
    };
};

router.get('/', (req, res, next) => {
    res.render('index', getSessionData(req));
});

router.get('/Add', (req, res, next) => {
    res.render('Add', getSessionData(req));
});

router.get('/Profile', (req, res, next) => {
    if (!req.session || !req.session.isLoggedIn || req.session.username !== DUMMY_PROFILE.username) {
        return res.redirect('/Add');
    }

    res.render('Profile', {
        isLoggedIn: true,
        username: DUMMY_PROFILE.username,
        user: DUMMY_PROFILE
    });
});

router.get('/auth/status', userController.authStatus);

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);

module.exports = router;