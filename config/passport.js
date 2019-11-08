const JwtStartegy = require('passport').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');
const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    'userPassport',
    new JwtStartegy(options, (jwtPayload, done) => {
      User
        .findById(jwtPayload.id)
        .then(user => {
          if(user){
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};