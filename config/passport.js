const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// User model
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Find if email id is present

      User.findOne({ email })
        .then((user) => {
          // No user found
          if (!user) {
            return done(null, false, {
              message: "This email is not registered",
            });
          }

          // Match password
          // password => entered in form, user.password => fetched from user object retrieved from db

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              throw err;
            }

            // passwords matched
            if (isMatch) {
              return done(null, user);
            }
            // passwords didnt match
            else {
              return done(null, false, { message: "Incorrect password" });
            }
          });
        })
        .catch((err) => {
          throw err;
        });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
