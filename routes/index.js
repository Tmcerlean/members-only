const express = require('express');
const router = express.Router();
const passport = require("passport");
const Message = require('../models/message');

var user_controller = require('../controllers/userController');

/* GET home page. */
router.get('/', function(req, res, next) {
  Message.find().populate('user').exec(function(err,result){
    if(err){
        return next(err);
    }
    res.render("index", { user: req.user, result: result });
  })
});

// POST request for homepage - admin delete //
router.post('/', function(req, res, next) {
  Message.findByIdAndRemove(req.body.delete,function(err){
    if(err){
        return next(err);
    }
    res.redirect('/');
  })
})

// POST request for user log in.
router.post("/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

// GET request for log out.
router.get("/log-out", (req, res) => {
  req.logout();
  res.redirect("/");
});

// GET request for user sign up.
router.get("/sign-up", user_controller.user_create_get);

// POST request for user sign up.
router.post("/sign-up", user_controller.user_create_post);

// GET request for create post.
router.get("/post", user_controller.create_post_get);

// POST request for create post.
router.post("/post", user_controller.create_post_post);

// GET request for become admin page.
router.get("/admin", user_controller.become_admin_get);

// POST request for become admin page.
router.post("/admin", user_controller.become_admin_post);

module.exports = router;
