var express = require("express");
var Imagen = require("./models/imagenes");
var Nota = require("./models/nota")
var router = express.Router();
var fs = require("fs");
var redis = require("redis");

var client = redis.createClient()

var image_finder_middleware = require("./middlewares/find_image");

router.get("/",function(req,res){
/*Buscando el usuario*/
   res.render("app/home");
});


router.get("/notas/notas",function(req,res){
   res.render("app/notas/notas");
});

router.all("/notas/:id*",image_finder_middleware);

router.get("/notas/:id/edit",function(req,res){
   res.render("app/notas/edit"); 
});
// show, edit and delete an image
router.route("/notas/:id")
   .get(function(req,res){
      Nota.findById(re.params.id,function(){
         res.render("app/notas/show",{nota:nota});
      })
   })
   .put(function(req,res){

   })
   .delete(function(req,res){

   });
// view all images and create an image
router.route("/notas")
   .get(function(req,res){

   })
   .post(function(req,res){
      var data = {
         id_student: req.body.id_student,
         course: req.body.course,
         year: req.body.year,
         name: req.body.name,
         lastname: req.body.lastname,
         area: req.body.area,
         subject: req.body.subject,
         qualification: req.body.qualification
      }
      var nota = new Nota(data);
      nota.save(function(err){
         if(!err){
            res.redirect("/app/notas/"+nota._id)
         }
         else{
            console.log(nota);
            res.render(err);
         }
      });
   });



module.exports = router;