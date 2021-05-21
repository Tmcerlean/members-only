const { body,validationResult } = require('express-validator');

const User = require('../models/user');
const bcrypt = require("bcryptjs");

exports.index = function(req, res) {

    async.parallel({
        book_count: function(callback) {
            Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        book_instance_count: function(callback) {
            BookInstance.countDocuments({}, callback);
        },
        book_instance_available_count: function(callback) {
            BookInstance.countDocuments({status:'Available'}, callback);
        },
        author_count: function(callback) {
            Author.countDocuments({}, callback);
        },
        genre_count: function(callback) {
            Genre.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Local Library Home', error: err, data: results });
    });
};

exports.user_create_post = function(req, res, next) {

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        // if err, do something
        if (err) { 
          return next(err);
        };
        // otherwise, store hashedPassword in DB
        const user = new User({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            member_status: false,
            messages: []
        }).save(err => {
            if (err) { 
            return next(err);
            };
            res.redirect("/");
        });
      });    
};