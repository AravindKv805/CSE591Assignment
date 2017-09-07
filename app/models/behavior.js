let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');

let behaviorSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: String,
    dateTime: Date,
    data: String,
    link: String
});

module.exports = mongoose.model('Behavior', behaviorSchema);
