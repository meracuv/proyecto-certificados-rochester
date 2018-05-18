function autocompletado () {
	document.getElementById("container").innerHTML = '';

		var preguntame = [#{imagenes}];

	var pal = document.getElementById("search").value;
	for(indice in preguntame){
		var item = preguntame[indice];
		var preguntando = item.name+""+item.lastname+""+item.id_student;
		var nombre = item.name;
		var apellido = item.lastname;
		var _ids = item.id_student;
		var url = "/app/imagenes/"+item._id;
		if(pal.length != 0 && preguntando.length != 0){
			if(preguntando.toLowerCase().search(pal.toLowerCase()) != -1 ){
				var node = document.createElement("li");
				node.innerHTML = "<a href="+url+"><container><p>"+_ids+"</p><h4>"+nombre+""+apellido+"</h4></container></a>";
				document.getElementById("container").appendChild(node);
			}
		}
	}
}