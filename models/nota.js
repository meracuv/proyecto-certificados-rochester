var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var nota_Schema = new Schema({
	id_student: {type:String, require:true},
	course: {type:String, require:true},
	year: {type:String, require:true},
	student: {
		name: {type:String, require:true},
		lastname: {type:String, require:true}
	},
	ratings: {
		area: String,
		dependencies: {
			subject: String,
			qualification: String
		}
	}
});

var Nota = mongoose.model("Nota",nota_Schema);

module.exports = Nota;