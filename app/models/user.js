let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');

let userSchema = mongoose.Schema({
    local: {
        username: String,
        password: String,
    },
    loginHistory: {
        type: Array
    },
    logoutHistory: {
    	type: Array
    }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
