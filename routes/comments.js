var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var Middleware = require("../middleware")

router.get("/new", Middleware.isLoggedIn, function(req,res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else{
			res.render("comments/new", {campground: campground});
		}
	});
});

router.post("/", Middleware.isLoggedIn, function(req,res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			req.flash("error", "Something went wrong");
			console.log(err);
			res.redirect("/campgrounds");
		} else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
					res.redirect("/campgrounds");
				} else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Succesfully added the comment!");
					res.redirect("/campgrounds/" + campground._id);
				}

			});
		}
	});
});

router.get("/:comment_id/edit", Middleware.checkCommentOwnership, function(req,res){
	campground_id = req.params.id
	Comment.findById(req.params.comment_id, function(err,comment){
		if(err){
			res.redirect("back");
		} else{
			res.render("comments/edit", {campground_id: campground_id, comment: comment});
		}
	});
});

router.put("/:comment_id", Middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,comment){
		if(err){
			res.redirect("back");
		} else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/:comment_id", Middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err,comment){
		if(err){
			res.redirect("back");
		} else{
			req.flash("success", "Comment deleted succesfully!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;