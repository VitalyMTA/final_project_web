const DUMMY_USER = {
    username: 'dummy1',
    password: 'dummy1',
    birth_date: '2000-01-01',
    city: 'Tel-Aviv',
    gender: 'Other',
    occupation: 'Working'
};

const isDummySession = (req) => {
    return !!(req.session && req.session.isLoggedIn && req.session.username === DUMMY_USER.username);
};

// Handles new user registration with validation and password hashing
exports.registerUser = (req, res, next) => {
    const wantsJson = req.headers.accept && req.headers.accept.includes('application/json');
    if (wantsJson) {
        return res.status(403).json({
            message: 'Registration is disabled. Use username "dummy1" and password "dummy1" to log in.'
        });
    }

    res.status(403).send('Registration is disabled. Use username "dummy1" and password "dummy1" to log in.');
};

// Authenticates user and creates session
exports.loginUser = (req, res, next) => {
    const wantsJson = req.headers.accept && req.headers.accept.includes('application/json');
    const username = req.body.username;
    const password = req.body.password;

    if (username !== DUMMY_USER.username || password !== DUMMY_USER.password) {
        if (wantsJson) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        return res.status(401).send('Invalid username or password');
    }

    if (!req.session) {
        if (wantsJson) {
            return res.status(500).json({ message: 'Session is not configured' });
        }

        return res.status(500).send('Session is not configured');
    }

    req.session.isLoggedIn = true;
    req.session.username = DUMMY_USER.username;

    req.session.save((err) => {
        if (err) {
            console.log(err);
            if (wantsJson) {
                return res.status(500).json({ message: 'Error while saving session' });
            }

            return res.status(500).send('Error while saving session');
        }

        if (wantsJson) {
            return res.status(200).json({ success: true, redirect: '/' });
        }

        res.redirect('/');
    });
};

// Destroys user session and clears cookie
exports.logoutUser = (req, res, next) => {
    if (!req.session) {
        return res.redirect('/');
    }

    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error while logging out');
        }

        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};

exports.authStatus = (req, res, next) => {
    const isLoggedIn = isDummySession(req);
    const username = isLoggedIn ? DUMMY_USER.username : null;

    if (!isLoggedIn) {
        return res.status(200).json({
            isLoggedIn,
            username
        });
    }

    res.status(200).json({
        isLoggedIn,
        username,
        user: {
            username: DUMMY_USER.username,
            birth_date: DUMMY_USER.birth_date,
            city: DUMMY_USER.city,
            gender: DUMMY_USER.gender,
            occupation: DUMMY_USER.occupation
        }
    });
};

