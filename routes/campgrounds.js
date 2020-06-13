var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var Middleware = require("../middleware");
//setting up multer
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

//setting up cloudinary
var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dpbo6rip1', 
  api_key: '348263559637488', 
  api_secret: 'rMykHlriOUlKxjvd092errC1_p8'
});

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

//CREATE - add new campground to DB
router.post("/", Middleware.isLoggedIn, upload.single('image'), function(req, res) {
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
      if(err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      // add cloudinary url for the image to the campground object under image property
      req.body.campground.image = result.secure_url;
      // add image's public_id to campground object
      req.body.campground.imageId = result.public_id;
      // add author to campground
      req.body.campground.author = {
        id: req.user._id,
        username: req.user.username
      }
      Campground.create(req.body.campground, function(err, campground) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        res.redirect('/campgrounds/' + campground.id);
      });
    });
});

// Edit
router.get("/:id/edit", Middleware.checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id, function(err,campground){
		res.render("campgrounds/edit", {campground: campground});
	})
});

//Update
router.put("/:id", upload.single('campground[image]'), Middleware.checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id, async function(err, campground){
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		} else{
			if(req.file){
				try{
					await cloudinary.v2.uploader.destroy(campground.imageId)
					var result = await cloudinary.v2.uploader.upload(req.file.path);
					campground.imageId=result.public_id;
					campground.image=result.secure_url;
				} catch(err){
					req.flash("error", err.message);
					return res.redirect("back");
				}
				
			}
			campground.name=req.body.campground.name;
			campground.description=req.body.campground.description;
			campground.price=req.body.campground.price;
			campground.save();
			req.flash("success", "Successfully Updated!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

//Delete
router.delete("/:id", Middleware.checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id, async function(err, campground){
		if(err){
			req.flash("error", err.message);
			return res.redirect("back");
		}
		try{
			await cloudinary.v2.uploader.destroy(campground.imageId);
			campground.remove();
			req.flash('success', "Campground deleted successfully");
			res.redirect('/campgrounds');
		}
		catch(err){
			req.flash("error", err.message);
			return res.redirect("back");
		}
	});
});

module.exports = router;