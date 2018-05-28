var mongoose = require("mongoose"); //LLamado de mongoose
var uniqueValidator = require("mongoose-unique-validator")
var Schema = mongoose.Schema; //Funcionde mongos para crear Schemas

//------Base de datos de los "Estudiantes"------//
var img_Schema = new Schema({
	id_student: {type:String, require:true, unique:true},
	name: {type:String, require:true},
	lastname: {type:String, require:true},
	creator: {type: Schema.Types.ObjectId, ref: "User" },
	action: {type:String, require:true},
	years: [ {
		year: String,
		course: String,
		condition: String,
		areas: [ {
			area: String,
			iha: String,
			qa: String,
			subjects: [ {
				subject: String,
				qualification: String,
				ih: String, 
			} ],
		} ],
	} ],
});

//<<<<<----Asignar nombres de base de datos y asigna variables---->>>>>//
var Imagen = mongoose.model("Imagen",img_Schema);

//Se exporta el modelo y la base de datos
module.exports = Imagen;