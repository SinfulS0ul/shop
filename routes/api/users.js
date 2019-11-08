const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const validateResetPasswordInput = require('../../validation/resetPassword');
const validateForgotPasswordInput = require('../../validation/forgotPassword');
const validateUpdateUserInput = require('../../validation/updateUser');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const upload = require('../../services/file-upload');
const config = require('../config/keys');

const User = require('../../models/User');

router.get('/test', (req, res) => res.json({
  msg: "Users Works"
}));

// @route   POST api/users/register
// @desc    Register user

router.post('/register', (req, res) => {
  const {
    errors,
    isValid
  } = validateRegisterInput(req.body);

  if (!isValid)
    return res.status(400).json(errors);

  User
    .findOne({
      email: req.body.email
    })
    .then(user => {
      if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors)
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          photo: 'https://murph1ne.s3.eu-central-1.amazonaws.com/no-avatar.png',
          products: []
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) 
              throw err;
              
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                const payload = {
                  id: user.id,
                  name: user.name,
                  photo: user.photo,
                  email: user.email
                };
      
                jwt.sign(payload, keys.secretOrKey, {
                    expiresIn: 3600
                  },
                  (err, token) => {
                    res.json({
                      success: true,
                      token: 'Bearer ' + token
                    });
                  }
                );})
              .catch(err => console.log(err));
          })
        })
      }
    });
});

// @route   POST api/users/login
// @desc    Login user

router.post('/login', (req, res) => {
  const {
    errors,
    isValid
  } = validateLoginInput(req.body);

  if (!isValid)
    return res.status(400).json(errors);

  const email = req.body.email;
  const password = req.body.password;

  User
    .findOne({
      email
    })
    .then(user => {
      if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }

      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          const payload = {
            id: user.id,
            name: user.name,
            photo: user.photo,
            email: user.email,
            favorites: user.favorites,
            phoneNumber: user.phoneNumber,
            products: user.products
          };

          jwt.sign(payload, keys.secretOrKey, {
              expiresIn: 3600
            },
            (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              });
            }
          );
        } else {
          errors.password = 'Password incorrect';
          return res.status(400).json(errors);
        }
      });
    });
});

// @route   POST api/users/forgotPassword
// @desc    Send mail to reset password

router.post('/forgotPassword', (req, res) => {
  const {
    errors,
    isValid
  } = validateForgotPasswordInput(req.body);

  if (!isValid)
    return res.status(400).json(errors);

  const email = req.body.email;
  console.log(email);

  if (email === '')
    res.status(400).send('Email required');

  User
    .findOne({
      email
    }).then((user) => {
      if (user === null) 
        res.status(403).send('User not found');
      else {
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 36000;
        user.save();

        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: config.email,
            pass: config.password,
          },
        });

        const mailOptions = {
          from: 'failerconst@gmail.com',
          to: `${user.email}`,
          subject: 'Link To Reset Password',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n' +
            `http://localhost:3000/reset/${token}\n\n` +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n',
        };

        transporter.sendMail(mailOptions, (err, response) => {
          if (err)
            console.error(err);
          else
            return res.status(200).json('Recovery email sent');
        });
      }
    });
});

// @route   GET api/users/getResetUser
// @desc    Getting user that going to reset password

router.get('/getResetUser', (req, res) => {
  User.findOne({
    resetPasswordToken: req.query.resetPasswordToken
  }).then((user) => {
    if (user === null)
      res.status(403).send('Password reset link is invalid');
    else if (user.resetPasswordExpires < Date.now())
      res.status(403).send('Password reset link has expired');
    else
     res.status(200).send({name: user.name});
  });
});

// @route   POST api/users/resetPassword
// @desc    Update password via email

router.post('/resetPassword', (req, res) => {
  const {
    errors,
    isValid
  } = validateResetPasswordInput(req.body);
  
  if (!isValid)
    return res.status(400).json(errors);

  User.findOne({
    name: req.body.name,
    resetPasswordToken: req.body.resetPasswordToken
  }).then(user => {
    if (user === null) 
      res.status(403).send('Password reset link is invalid');
    else if (user.resetPasswordExpires < Date.now())
      res.status(403).send('Password reset link has expired');
    else if (user !== null && user.resetPasswordExpires >= Date.now()) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) 
            throw err;

          user.password = hash;
          user.resetPasswordToken = null;
          user.resetPasswordExpires = null;

          user
            .save()
            .then(() => {
              console.log('Password updated');
              res.status(200).send({ message: 'Password updated' });
            })
            .catch(err => console.log(err));
        })
      })
  }});
});

// @route   GET api/users/getUserByID
// @desc    Getting user by id

router.get('/getUserByID', (req, res) => {
  User.findOne({
    _id: req.query.userId
  }).then((user) => {
    res.json({name: user.name, photo: user.photo});
  });
});

// @route   POST api/users/updateUserInfo
// @desc    Update user's data

router.post('/updateUserInfo', upload.single('avatar'), (req, res) => {
  const {
    errors,
    isValid
  } = validateUpdateUserInput(req.body);

  if (!isValid)
    return res.status(400).json(errors);
  
  User
    .findOne({
      _id: req.body.userId
    })
    .then(user => {
      if (user) {
        user.name = req.body.name ? req.body.name : user.name;
        user.phoneNumber = req.body.phoneNumber ? req.body.phoneNumber : user.phoneNumber;
        user.photo = req.file ? req.file.location : user.photo;
        
        user
          .save()
          .then(user => {
            const payload = {
              id: user.id,
              name: user.name,
              photo: user.photo,
              email: user.email,
              favorites: user.favorites,
              phoneNumber: user.phoneNumber,
              products: user.products
            };

            jwt.sign(payload, keys.secretOrKey, {
                expiresIn: 3600
              },
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
              }
            );
          })
      } else {
        errors.name = 'User not found';
        return res.status(404).json(errors);
      }
    });
});

// @route   GET api/users/getUserProducts
// @desc    Getting user's products that are on sale

router.get('/getUserProducts', (req, res) => {
  User.findOne({
    _id: req.query.userId
  }).then((user) => {
    res.json(user.products);
  });
});


// @route   POST api/users/updateUserFavorites
// @desc    Updating user's favorites

router.post('/updateUserFavorites', (req, res) => {
  User
    .findOne({ 
      _id: req.body.userId 
    })
    .then(user => { 
      user.favorites = [...user.favorites, ...req.body.favorites];
      res.json(user.favorites);
    })
});


router.get('/getAll', (req, res) => {
  User
    .find({})
    .then(users => {
      res.send(users)
    })
});

module.exports = router;