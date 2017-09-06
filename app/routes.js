var behaviorService = require('./service/behaviorService');

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
        res.cookie('connect.useremail', req.user.local.email, { httpOnly: true });
        res.render('profile.ejs', {
            user: req.user
        });
    });

    app.post('/behavior', function(req, res) {
        console.log(req.body);
        let type = req.body.type;
        let dateTime = req.body.dateTime;
        let data = req.body.data;
        let email = req.body.useremail;
        let link = req.body.link;

        behaviorService.addLog(email, type, dateTime, data, link);

        res.send(200);
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.clearCookie('connect.useremail');
        let user = req.user;
        user.logoutHistory.push(Date());
        user.save(function(err) {
            if (err)
                throw err;
            return done(null, user);
        });
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
