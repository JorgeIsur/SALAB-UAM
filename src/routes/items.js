const router = require("express").Router();

const Inventario = require("../models/Inventario");

const Labs = require("../models/Laboratorios");

const { isAuthenticated } = require("../helpers/auth");


var multer = require("multer");
var subir = multer({ dest: "./public/pictures" });
const fs = require("fs");
const path = require("path");

router.get("/items/add", isAuthenticated, async (req, res) => {
  const laboratorios = await Labs.find().lean();
  res.render("items/nuevo-articulo", { laboratorios });
});

router.post( "/items/nuevo-articulo", subir.single("image"),isAuthenticated,async (req, res, next) => {
    console.log(req.body);
    try{
      var data = fs.readFileSync(path.join(__dirname+"/../"+"/public/pictures"+"/"+req.file.filename));
      var obj = {
      img: {
        data:fs.readFileSync(path.join(__dirname+"/../"+"/public/pictures"+"/"+req.file.filename)),
        contentType: "image/jpeg",
        pic:data.toString('base64'),
      },
    };
    }catch(err){
      var data = fs.readFileSync(path.join(__dirname+"/../"+"/public/pictures"+"/"+"notfound.png"));
      var obj = {
      img: {
        data:fs.readFileSync(path.join(__dirname+"/../"+"/public/pictures"+"/"+"notfound.png")),
        contentType: "image/jpeg",
        pic:data.toString('base64'),
      },
      };
    }
    console.log(obj);
    const {img} = obj;
    const { name, description, cantidad, area, lab, numInventario, stock } =req.body;
    const errors = [];
    if (!name) {
      errors.push({ text: "Escribe el nombre del artículo" });
    }
    if (!cantidad) {
      errors.push({ text: "Ingresa la cantidad." });
    }
    if (!numInventario) {
      errors.push({ text: "Ingresa el número de inventario." });
    }
    if (errors.length > 0) {
      res.render("items/nuevo-articulo", {
        errors,
        name,
        description,
        cantidad,
      });
    } else {
        try{
          const nuevoInventario = new Inventario({
          name,
          description,
          cantidad,
          area,
          lab,
          numInventario,
          stock,
          img,
        });
        nuevoInventario.user = req.user._id;
        await nuevoInventario.save();
        req.flash("success_msg", "Item registrado.");
        res.redirect("/items");
      }
      catch(err){
        console.log("Entra catch");
        req.flash("error_msg","Hubo un error en la solicitud.");
        console.log(err);
        res.redirect("/prestamos");
      }
    }
  }
);

router.get("/items/edit/:id", isAuthenticated, async (req, res) => {
  const edit = await Inventario.findById(req.params.id).lean();
  res.render("items/edit-item", { edit });
});

router.put("/items/edit-item/:id", isAuthenticated, async (req, res) => {
  const { name, description, cantidad, numInventario, area, lab, stock } =
    req.body;
  console.log(area);
  console.log(lab);
  await Inventario.findByIdAndUpdate(req.params.id, {
    name,
    description,
    cantidad,
    numInventario,
    area,
    lab,
    stock,
  });
  req.flash("success_msg", "Item editado.");
  res.redirect("/items");
});

router.get("/items", isAuthenticated, async (req, res) => {
  const items = await Inventario.find().lean();
  res.render("items/all-items", { items });
});

router.delete("/items/delete/:id", async (req, res) => {
  await Inventario.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Item borrado.");
  res.redirect("/items");
});

module.exports = router;
