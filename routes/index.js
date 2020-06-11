var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res){
	res.render("landing");
});

router.get("/register", function(req, res){
   res.render("register", {page: 'register'});
});

router.post("/register", function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err,user){
		if(err){
			req.flash("error", err.message);
			return res.redirect("/register");
		} 
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to Yelp Camp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

router.get("/login", function(req,res){
	res.render("login", {page: 'login'}); 
});

router.post("/login", function (req, res, next) {
  passport.authenticate("local",
    {
      successRedirect: "/campgrounds",
      failureRedirect: "/login",
      failureFlash: true,
      successFlash: "Logged in succesfully as " + req.body.username + ", Enjoy!"
    })(req, res);
});

router.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "Logged out succesfully!")
	res.redirect("/campgrounds");
});

module.exports = router;