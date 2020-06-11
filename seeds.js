var mongoose 	= require("mongoose"),
	Campground  = require("./models/campground"),
	Comments    = require("./models/comment");

var data = [
	{
		name: "Tso Moriri Lake, Ladakh",
		image: "https://www.holidify.com/images/cmsuploads/compressed/640px-Tsomoriri_Lake_DSC4010_20190212171119.jpg",
		description: "Tsomoriri Lake is the highest lake in the world and located in Ladakh. Camping here is the experience of a lifetime. The lake is completely frozen during the winters and is an excitingly unique thing to witness. The best time to camp here is during May to September and it is simply wonderful to spend time in the decorated tents. You can trek in the nearby Ladakh region and witness the mesmerizing sunset at the lake. The best part is that the tents are comfortable with electricity supply."
	},
	{
		name: "Camp Exotica, Kullu",
		image: "https://www.holidify.com/images/cmsuploads/compressed/tent-1208201_1920_20190212172038.jpg",
		description: "The Camp Exotica is a perfect weekend getaway option located in Kullu in the Manali district of Himachal Pradesh. The accommodation provided is world class and the tents simply leave you connecting with nature like never before. The location of these tents is such that it gives a panoramic view of the surrounding mountains. The food provided is of fine quality and the incredible view will simply leave you in awe of this adventure. Make sure to take out time for this pleasure full camping trip."
	},
	{
		name: "West Ladakh Camp, Ladakh",
		image: "https://www.holidify.com/images/cmsuploads/compressed/24366507140_38f32204a4_z_20190212174301.jpg",
		description: "If you are planning to go on a trekking trip to Ladakh, you can make it even more adventurous by camping at the West Ladakh Camp. This beautiful campsite is sprawled across 20 acres of ranch and is ideally situated close to the Indus River. The tents are so placed that these are surrounded by apricot and willow trees which nest the migratory birds. You can set your base here and go trekking in the nearby region and visit the Buddhist Monasteries. The food served here is authentic Tibetan and Ladakhi food making it a unique culinary experience."
	}
];

function seedDB(){
	Campground.deleteMany({}, function(err,campground){
	// 	if(err){
	// 		console.log(err);
	// 	} else{
	// 		console.log("Campgrounds removed");
	// 		for(var i=0; i<data.length; i++)
	// 		{
	// 			Campground.create(data[i], function(err,campground){
	// 				if(err){
	// 					console.log(err);
	// 				} else{
	// 					console.log("campground added");
	// 					Comments.create({
	// 						title: "Great Place!",
	// 						author: "Anonymous"
	// 					}, function(err, comment){
	// 						if(err){
	// 							console.log(err);
	// 						} else{
	// 							campground.comments.push(comment);
	// 							campground.save();
	// 							console.log("created comment");
	// 						}
	// 					});
	// 				}
	// 			});
	// 		}
	// 	}
	});
}

module.exports = seedDB;


















