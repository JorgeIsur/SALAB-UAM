const router = require('express').Router();

const Prestamos = require('../models/Prestamos');

const Inventario = require('../models/Inventario');

const Labs = require('../models/Laboratorios');

const Users = require('../models/User');

const {isAuthenticated} = require('../helpers/auth');

router.get('/prestamos/nuevo-prestamo',isAuthenticated,async(req,res)=>{
    const items = await Inventario.find().lean();
    res.render('prestamos/nuevo-prestamo',{items});
});

router.post('/prestamos/nuevo-prestamo/:id',isAuthenticated,async(req,res)=>{
    const inventario = await Inventario.findById(req.params.id).lean();
    const articulo = inventario.numInventario;
    const name = inventario.name;
    const laboratorio = inventario.lab;
    console.log(req.user.name);
    const usuario = await Users.find({name:req.user.name}).lean();
    const [{matricula}] = usuario;
    const cantidad = '1';
    const nuevoPrestamo = new Prestamos({name,matricula,articulo,laboratorio,cantidad});
    console.log(req.user.id);
    nuevoPrestamo.user = req.user.id;
    await nuevoPrestamo.save();
    req.flash('success_msg','Prestamo registrado');
    res.redirect('/prestamos');
});

router.get('/prestamos',isAuthenticated,async(req,res)=>{
    const prestamos = await Prestamos.find({user:req.user.id}).lean();
    res.render('prestamos/all-prestamos',{prestamos});
});

router.get('/prestamos/edit/:id',isAuthenticated, async(req,res)=>{
    const inventario = await Inventario.findById(req.params.id).lean();
    res.render('prestamos/all-prestamos',{inventario});
});

router.put('/prestamos/edit/:id',isAuthenticated,async(req,res)=>{
    const {name, description, area} = req.body;
    await Inventario.findByIdAndUpdate(req.params.id,{name,description,area});
    req.flash('success_msg','Item editado satisfactoriamente.');
    res.redirect('/administrar');
});

router.delete('/prestamos/delete/:id',isAuthenticated,async(req,res)=>{
    await Inventario.findByIdAndDelete(req.params.id);
    req.flash('success_msg','Prestamo cancelado satisfactoriamente.');
    res.redirect('/administrar');
});

module.exports = router;