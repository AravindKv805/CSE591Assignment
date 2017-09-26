let behaviorService = require('./service/behaviorService');
let userService = require('./service/userService');

module.exports = function(app, passport) {

    app.get('/', isLoggedOut, function(req, res) {
        res.render('index.ejs');
    });

    app.get('/login', isLoggedOut, function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/login', isLoggedOut, passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signup', isLoggedOut, function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        res.cookie('connect.username', req.user.local.username, { httpOnly: true });
        res.render('profile.ejs', {
            user: req.user
        });
    });

    app.post('/behavior', function(req, res) {
        let type = req.body.type;
        let dateTime = req.body.dateTime;
        let data = req.body.data;
        let username = req.body.username;
        let link = req.body.link;

        behaviorService.addLog(username, type, dateTime, data, link);
        res.send(200);
    });

    app.get('/behaviors', function(req, res) {
        if (req.user == undefined || req.user == null) {
            res.redirect('/');
        } else {
            behaviorService.getLogs(req.user, res);
        }
    });

    app.get('/stats', function(req, res) {
        if (req.user == undefined || req.user == null) {
            res.redirect('/');
        } else {
            behaviorService.getStats(req.user, res);
        }
    });

    app.get('/logout', function(req, res) {
        let user = req.user;

        if (user) {
            userService.saveUser(user);
        }
        req.logout();
        res.clearCookie('connect.useremail');
        res.redirect('/');
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }

    function isLoggedOut(req, res, next) {
        if (!req.isAuthenticated())
            return next();
        res.redirect('/profile');
    }
}
