var search = document.getElementById("search"),
    palabra = document.getElementsByTagName("container"),
    forEach = Array.prototype.forEach;

search.addEventListener("keyup", function(e){
    var choice = this.value;
  
    forEach.call(palabra, function(f){
        if (f.innerHTML.toLowerCase().search(choice.toLowerCase()) == -1)
            f.parentNode.style.display = "none";
        else
            f.parentNode.style.display = "block";
    });
}, false);