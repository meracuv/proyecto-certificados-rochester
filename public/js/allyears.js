var text = "<option>...</option>";
var i;
var fecha = new Date();
var ano = fecha.getFullYear();
for (i = 1973; i < ano; i++) {
var suma = parseInt(i) + parseInt(1);
var result = i+"-"+suma;
text += "<option value="+result+">" + result + "</option>";};
document.getElementById("year").innerHTML = text;