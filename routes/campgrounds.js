var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var Middleware = require("../middleware");

router.get("/", function(req, res){
	Campground.find({}, function(err, Campgrounds){
		res.render("campgrounds/index",{campgrounds: Campgrounds, page: 'campgrounds'});
	})
});

router.get("/new", Middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

router.get("/:id", function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

router.post("/", Middleware.isLoggedIn, function(req,res){
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var addData = {
		name: req.body.Cname,
		price: req.body.Cprice,
		image: req.body.Cimg,
		description: req.body.Cdesc,
		author: author
	}
	Campground.create(addData, function(err,Campground){
		if(err){
			console.log(err);	
		}
		else{
			res.redirect("/campgrounds");
		}
	});
});

// Edit
router.get("/:id/edit", Middleware.checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id, function(err,campground){
		res.render("campgrounds/edit", {campground: campground});
	})
});

//Update
router.put("/:id", Middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
		if(err){
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

//Delete
router.delete("/:id", Middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err,campground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Campground deleted succesfully!");
			res.redirect("/campgrounds");
		}
	})
});

module.exports = router;