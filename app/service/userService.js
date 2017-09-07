let User = require('../models/user');

module.exports = {
    saveUser: function(user) {
        user.logoutHistory.push(Date());
        user.save(function(err) {
            if (err)
                throw err;
        });
    }
}
