var express = require("express");
var Imagen = require("./models/imagenes");
var router = express.Router();
var fs = require("fs");
var redis = require("redis");

var client = redis.createClient()

var image_finder_middleware = require("./middlewares/find_image");

router.get("/",function(req,res){
   Imagen.find({})
         .populate("creator")
         .exec(function(err,imagenes){
            if(err) console.log(err);
               res.render("app/home",{imagenes: imagenes});
            })

      });
//<<<<<<<<<<<<<<<<<<<Buscador por años>>>>>>>>>>>>>>>>>>>>//
router.route("/imagenes/years")
   .post(function(req,res){
      Imagen.find({"years.year":req.body.year}, function(err,imagenes){
         res.render("app/home",{imagenes:imagenes});
      })
   })

//---ejecutar middlewares---//
router.all("/imagenes/:id*",image_finder_middleware)


////////////////////////////////////   RUTA PARA CREAR CERTIFICADOS   ////////////////////////////////////

router.route("/imagenes/:id/:id/cert")
   .post(function(req,res){
      Imagen.findById(req.params.id, function(err,imagen){
         var año = res.locals.imagen.years.id(req.body.years);
         var areas =  año.areas
         res.render("app/imagenes/pdf01",{imagen:res.locals.imagen, year:año});
      })
   })
/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>--CRUD's DATABASES--<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

//-------------------------------------CRUD OF SUBJECT(Asignatura), -------------------------------------------//
router.route("/imagenes/:id/:id/:id/:id")
   .get(function(req,res){
      res.render("app/imagenes/show")
   })
//----------Edit Subject----------//
   .put(function(req,res){
      Imagen.findById(req.params.id, function(err,imagen){
         var s = res.locals.imagen.years.id(req.body.years).areas.id(req.body.areas).subjects.id(req.body.subjects);
            s.subject = req.body.subject,
            s.qualification = req.body.qualification,
            s.ih = req.body.ih,
            res.locals.imagen.action = " editó la asignatura "+req.body.subject,
            res.locals.imagen.creator = res.locals.user._id;
         res.locals.imagen.save(function(err){
            if(!err){
               res.redirect("/app/imagenes/"+res.locals.imagen._id);
            }else{
               res.render("app/imagenes/"+imagen.id+"/edit",{imagen:imagen});
               console.log(err)
            }
         })
      })
   })
//----------Delete Subject----------//
   .delete(function(req,res){
      Imagen.findById(req.params.id, function(err,imagen){
         var sub = res.locals.imagen.years.id(req.body.years).areas.id(req.body.areas).subjects.id(req.body.subjects)
         if (sub == null){
            res.redirect("/app/imagenes/"+res.locals.imagen._id)
         }else{
            res.locals.imagen.action = " eliminó una asignatura",
            res.locals.imagen.creator = res.locals.user._id;
            sub.remove();
         }
         res.locals.imagen.save(function(err){
            if(!err){
               res.render("app/imagenes/show",{imagen:res.locals.imagen})
            }else{
               console.log(err);
               res.redirect("/app/imagenes"+req.params.id);
            }
         })
      });
   })


//-------------------------------------CRUD OF AREAS(AÑOS), Create a new Subject-------------------------------------------//

router.route("/imagenes/:id/:id/:id")
   .get(function(req,res){
      res.render("app/imagenes/show")
   })
//----------Create new Subject----------//
   .post(function(req,res){
      Imagen.findById(req.params.id, function(err,imagen){
         res.locals.imagen.action = " creó la asignatura "+req.body.subject,
         res.locals.imagen.creator = res.locals.user._id;
         res.locals.imagen.years.id(req.body.years).areas.id(req.body.area).subjects.push({
               subject: req.body.subject,
               qualification: req.body.qualification,
               ih: req.body.ih,
         });
         res.locals.imagen.save(function(err){
            if(!err){
               res.redirect("/app/imagenes/"+res.locals.imagen._id);
               console.log(res.locals.imagen.years.id(req.body.years).areas.id(req.body.area).subjects)
            }else{
               console.log(err)
               res.render("app/imagenes/"+imagen.id+imagen.year.id+"/year",{imagen:imagen});
            }
         })
      })
   })
//----------Edit Area----------//
   .put(function(req,res){
      Imagen.findById(req.params.id, function(err,imagen){
         var a = res.locals.imagen.years.id(req.body.years).areas.id(req.body.areas);
            a.area = req.body.area,
            a.iha = req.body.iha,
            a.qa = req.body.qa,
            res.locals.imagen.action = " editó el area "+req.body.area,
            res.locals.imagen.creator = res.locals.user._id;
         res.locals.imagen.save(function(err){
            if(!err){
               res.redirect("/app/imagenes/"+res.locals.imagen._id);
            }else{
               res.render("app/imagenes/"+imagen.id+"/edit",{imagen:imagen});
               console.log(err)
            }
         })
      })
   })
//----------Delete Area----------//
   .delete(function(req,res){
      Imagen.findById(req.params.id, function(err,imagen){
         var ar = res.locals.imagen.years.id(req.body.years).areas.id(req.body.areas)
         if (ar == null){
            res.redirect("/app/imagenes/"+res.locals.imagen._id)
         }else{
            res.locals.imagen.action = " eliminó un area ",
            res.locals.imagen.creator = res.locals.user._id;
            ar.remove();
         }
         res.locals.imagen.save(function(err){
            if(!err){
               res.redirect("/app/imagenes/"+res.locals.imagen._id)
            }else{
               console.log(err);
               res.redirect("/app/imagenes"+req.params.id);
            }
         })
      });
   })


//-------------------------------------CRUD OF YEARS(AÑOS), Create a new Area-------------------------------------------//

router.route("/imagenes/:id/:id")
   .get(function(req,res){
      res.render("app/imagenes/show")
   })
//----------Create new Area----------//
   .post(function(req,res){
      Imagen.findById(req.params.id, function(err,imagen){
         res.locals.imagen.action = " creó el area "+req.body.area,
         res.locals.imagen.creator = res.locals.user._id;
         res.locals.imagen.years.id(req.body.years).areas.push({
               area: req.body.area,
               iha: req.body.iha,
               qa: req.body.qa,
               subjects: []
         });
         res.locals.imagen.save(function(err){
            if(!err){
               res.redirect("/app/imagenes/"+res.locals.imagen._id);
            }else{
               console.log(err)
               res.render("app/imagenes/"+imagen.id+imagen.year.id+"/year",{imagen:imagen});
            }
         })
      })
   })
//----------Edit Year----------//
   .put(function(req,res){
      Imagen.findById(req.params.id, function(err,imagen){
         var y = res.locals.imagen.years.id(req.body.years);
            y.year = req.body.year, //Objeto a insertar
            y.course = req.body.course,
            y.condition = req.body.condition,
            res.locals.imagen.action = " editó el año "+req.body.year,
            res.locals.imagen.creator = res.locals.user._id;
         res.locals.imagen.save(function(err){
            if(!err){
               res.redirect("/app/imagenes/"+res.locals.imagen._id);
            }else{
               res.render("app/imagenes/"+imagen.id+"/edit",{imagen:imagen});
               console.log(err)
            }
         })
      })
   })
//----------Delete Year----------//
   .delete(function(req,res){
      Imagen.findById(req.params.id, function(err,imagen){
         var ye = res.locals.imagen.years.id(req.body.years)
         if (ye == null){
            res.redirect("/app/imagenes/"+res.locals.imagen._id)
         }else{
            res.locals.imagen.action = " eliminó un año",
            res.locals.imagen.creator = res.locals.user._id;
            ye.remove();
         }
         res.locals.imagen.save(function(err){
            if(!err){
               res.redirect("/app/imagenes/"+res.locals.imagen._id);
            }else{
               console.log(err);
               res.redirect("/app/imagenes/"+req.params.id);
            }
         })
      });
   })


//------------------------------------CRUD OF STUDENTS(IMAGENES), Create new Year------------------------------------//

router.route("/imagenes/:id")
//-----------Edit Student(Imagen)-----------//
   .get(function(req,res){
      res.render("app/imagenes/show")
   })
//-------------Create new year-------------//
   .post(function(req,res){
      Imagen.findById(req.params.id, function(err,imagen){
         res.locals.imagen.action = " creó el año "+req.body.year,
         res.locals.imagen.creator = res.locals.user._id;
         res.locals.imagen.years.push({
            year: req.body.year, 
            course: req.body.course,
            condition: req.body.condition,
            areas: []
         });
         res.locals.imagen.save(function(err){
            if(!err){
               res.redirect("/app/imagenes/"+res.locals.imagen._id);
            }else{
               res.render("app/imagenes/"+imagen.id+"/edit",{imagen:imagen});
               console.log(err)
            }
         })
      })
   })
//----------Edit Students----------//
   .put(function(req,res){
      res.locals.imagen.id_student = req.body.id_student,
      res.locals.imagen.name = req.body.name,
      res.locals.imagen.lastname = req.body.lastname,
      res.locals.imagen.creator = res.locals.user._id,
      res.locals.imagen.action = " modificó al estudiante";
      res.locals.imagen.save(function(err){
         if(!err){
            res.redirect("/app/imagenes/"+res.locals.imagen._id);
            console.log(res.locals.imagen)
         }else{
            res.render("app/imagenes/"+req.params.id+"/edit")
         }
      })
   })
//-----------Delete Student--------------//
   .delete(function(req,res){
      Imagen.findOneAndRemove({_id: req.params.id},function(err){
         if(!err){
            res.redirect("/app/imagenes");
         }else{
            console.log(err);
            res.redirect("/app/imagenes/"+req.params.id)
         }
      })
   })


/*-----------------------------------Create a new Student and get all students-----------------------------*/

router.route("/imagenes")
//----------Get all Students----------//
   .get(function(req,res){
      Imagen.find({creator: res.locals.user._id},function(err,imagenes){
         if(err){ res.redirect("/app");return;}
         res.render("app/home",{imagenes: imagenes})
      });
   })
//----------Create new Student----------//
   .post(function(req,res){
      var data = {
         id_student: req.body.id_student,
         name: req.body.name,
         lastname: req.body.lastname,
         creator: res.locals.user._id,
         action: "Creado",
         years: []
      }

      var imagen = new Imagen(data);
      imagen.save(function(err){
         if(!err){ 
            res.redirect("/app/imagenes/"+imagen._id);
         }
         else{
            console.log(imagen);
            res.render(err);
         }
      });
   });

module.exports = router;