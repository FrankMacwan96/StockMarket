const { json } = require('express');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

// A defineation of username and passwords which be reflected in MongoDB Database.
var UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    wallet : {type: Number, default:0},
    Stocks : {type: Array}
});
   
//This is a middleware which performs the function supplied as parameter in "pre" before saving the data in database
//In oure case we are generating a salt(definition below) to enrypt our password before saving it using this middleware
UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt, a salt is a string of length SALt_WORK_FACTOR made of any alphanumerics and special characters
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

//This is called a schema method
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
     
module.exports = mongoose.model('User', UserSchema);
