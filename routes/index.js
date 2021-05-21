const express = require('express');
const router = express.Router();
const passport = require("passport");

var user_controller = require('../controllers/userController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("index", { user: req.user });
});

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
router.get("/sign-up", (req, res) => res.render("sign-up-form"));

// POST request for user sign up.
router.post('/sign-up', user_controller.user_create_post);

module.exports = router;
