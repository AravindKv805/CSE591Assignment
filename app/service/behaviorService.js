let Behavior = require('../models/behavior');
let User = require('../models/user');
let moment = require('moment');

module.exports = {
    addLog: function(username, type, dateTime, data, link) {
        User.findOne({ 'local.username': decodeURIComponent(username) }, function(err, user) {
            let newBehavior = new Behavior();

            newBehavior.userId = user._id;
            newBehavior.type = type;
            newBehavior.dateTime = dateTime;
            newBehavior.data = data;
            newBehavior.link = link;
            newBehavior.save(function(err) {
                if (err)
                    throw err;
                return;
            });
        });
    },
    getLogs: function(user, res) {
        Behavior.find({ 'userId': user._id }, function(err, behaviors) {
            if (err)
                throw err;
            else {
                res.render('behaviors.ejs', {
                    username: user.local.username,
                    behaviors: behaviors,
                    moment: moment
                });
            }
        });
    }
}
