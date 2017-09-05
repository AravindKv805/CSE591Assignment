var Behavior = require('../models/behavior');

module.exports = {
    addLog: function(userId, type, dateTime, data) {
        let newBehavior = new Behavior();
        newBehavior.userId = userId;
        newBehavior.type = type;
        newBehavior.dateTime = dateTime;
        newBehavior.data = data;

        newBehavior.save(function(err) {
            if (err)
                throw err;
            return done(null, newUser);
        });
    },
}
