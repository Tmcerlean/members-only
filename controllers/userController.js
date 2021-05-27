const { body, validationResult } = require('express-validator');
const Message = require('../models/message');
const User = require('../models/user');
const bcrypt = require("bcryptjs");

exports.user_create_get = function(req, res, next) {
    res.render("sign-up-form", { msg: "" });
}

exports.user_create_post = [

    // Validate and santize the form fields.
    body('first_name', 'First name required').trim().isLength({ min: 1 }).escape(),
    body('family_name', 'Family name required').trim().isLength({ min: 1 }).escape(),
    body('username', 'Username required').trim().isLength({ min: 1 }).escape(),
    body('email', 'Email required').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('sign-up-form', {errors: errors.array()});
            return;

        } else {
            // Data from form is valid.

            // Check password matches password confirmation
            if(req.body.password != req.body.confirm_pw){
                res.render('sign-up-form',{msg:'Password confirmation fields do not match'});
                return;
            }
            
            // Check if username already exists.
            User.findOne({ 'username': req.body.username })
                .exec( function(err, found_username) {
                    if (err) { return next(err); }

                    if (found_username) {
                        // Username already exists.
                        res.render('sign-up-form',{msg:'Username taken'});
                    } else {
                        // Create a user object with escaped and trimmed data.
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
                    }
            })
        }
    }
];

exports.create_post_get = function(req, res, next) {
    res.render("create-post-form", { msg: "" });
}

exports.create_post_post = [

    // Validate and santize the form fields.
    body('post_title', 'Post title must be at least 5 characters').trim().isLength({ min: 5 }).escape(),
    body('post_content', 'Post must be at least 30 characters').trim().isLength({ min: 30 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('create-post-form', {errors: errors.array(), msg: ''});
            return;

        } else {
            // Data from form is valid.

            // Store post in DB
            const message = new Message({
                title: req.body.post_title,
                body: req.body.post_content,
                user: res.locals.currentUser,
            }).save(err => {
                if (err) { 
                return next(err);
                };
                res.redirect("/");
            });
        }
    }
];

exports.become_admin_get = function(req, res, next) {
    res.render("become-admin-form", { msg: "" });
}

exports.become_admin_post = [

    // Validate and santize the form fields.
    body('admin_password', 'You must enter the admin password').trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('become-admin-form', {errors: errors.array(), msg: ''});
            return;

        } else {
            // Data from form is valid.

            let adminUser = new User({
                first_name: res.locals.currentUser.first_name,
                family_name: res.locals.currentUser.family_name,
                username: res.locals.currentUser.username,
                email: res.locals.currentUser.email,
                password: res.locals.currentUser.password,
                member_status: true,
                messages: res.locals.currentUser.messages,
                _id: res.locals.currentUser._id
            });

            if(req.body.admin_password === process.env.ADMIN){
                User.findByIdAndUpdate(res.locals.currentUser._id, adminUser, {}, function(err,adminUser){
                    res.redirect('/');
                });

            } else {
                res.render('become-admin-form',{ msg:'Wrong admin password' })
            }
        }
    }
];