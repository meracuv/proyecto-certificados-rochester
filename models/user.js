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
	username: {type:String,required:true,maxlength:[50,"Username muy largo"]},
	password: {type:String,minlength:[8,"El password es muy corto"],validate: password_validation},
	email: {type: String, required:true, match:email_match},
});

user_schema.virtual("password_confirmation").get(function(){
	return this.p_c;
}).set(function(password){
	this.p_c = password;
});


var User = mongoose.model("User",user_schema);

module.exports.User = User;