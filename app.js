var express = require("express");
var bodyParser = require("body-parser");
var User = require("./models/user").User;
var session = require("express-session");
var router_app = require("./routes_app");
var session_middleware = require("./middlewares/session");
var formidable = require("express-form-data");
var RedisStore = require("connect-redis")(session);
var http = require("http");
var realtime = require("./realtime");

var methodOverride = require("method-override"); //llamados-------

var app = express();//llamados
var server = http.Server(app);

var sessionMiddleware = session({
	store: new RedisStore({}),
	secret:"meracunofalse"
});

realtime(server,sessionMiddleware);

app.use("/public",express.static('public'));//elementos estaticos
app.use(bodyParser.json()); //Para hacer peticiones de JSON
app.use(bodyParser.urlencoded({extended: true}));


app.use(methodOverride("_method"))



app.use(sessionMiddleware);

app.use(formidable.parse({keepExtensions: true }));

app.set("view engine", "jade");

app.get("/",function(req,res){
	console.log(req.session.user_id);
	res.render("index");
});

app.get("/signup",function(req,res){
	User.find(function(err,doc){
		console.log(doc);
		res.render("signup");
	});
});

app.get("/login",function(req,res){
		res.render("login");
});

app.post("/users",function(req,res){

	var user = new User({
		                 email: req.body.email,
		                 password: req.body.password,
		                 password_confirmation: req.body.password_confirmation,
		                 username: req.body.username
		                });
	
	user.save().then(function(us){
	res.send("Guardamos tus datos correctamente");
	},function(err){
		console.log(String(err));//Impresion en la consola de los errores
		res.send("Hubo un error al guardar el usuario");
	});

});

app.post("/sessions",function(req,res){

	User.findOne({email:req.body.email,password:req.body.password},function(err,user){
		req.session.user_id = user._id;
		res.redirect("/app");
	});

});

app.use("/app",session_middleware);
app.use("/app",router_app);

server.listen(3000);