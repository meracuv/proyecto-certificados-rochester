var Imagen = require("../models/imagenes");

module.exports = function(image,req,res){
	//true = Tiene permisos
	//Falso = Si no tiene permisos
	if(req.method === "GET" && req.path.indexOf("edit") < 0){
		//ver la imagen
		return true;
	}

	if(image.creator._id.toString() == res.locals.user._id){
		//Esta imagen yo la subí
		return true; 
	}

	return false;
	
}