var mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/fotos");

var posibles_valores = ["M","F"];
var email_match = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Coloca un email válido"];

var password_validation = {
	validator: function(p){
		return this.password_confirmation == p;
	},
	message: "las contraseñas no son iguales"
}
var user_schema = new Schema({
	name: String,
	username: {type:String,required:true,maxlength:[50,"Username muy largo"]},
	password: {type:String,minlength:[8,"El password es muy corto"],validate: password_validation},
	age: {type: Number,min:[5, "la edad no puede ser menor que 5"], max: [20, "la edad no puede ser mayor que 20"]},
	email: {type: String, required:true, match:email_match},
	date_of_birth: Date,
	sex: {type:String,enum:{values: posibles_valores, message:"Opción no válida"}}
});

user_schema.virtual("password_confirmation").get(function(){
	return this.p_c;
}).set(function(password){
	this.p_c = password;
});


var User = mongoose.model("User",user_schema);

module.exports.User = User;