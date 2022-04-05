const router = require('express').Router();

const Prestamos = require('../models/Prestamos');

const {isAuthenticated} = require('../helpers/auth');

router.get('/administrar',isAuthenticated,async(req,res)=>{
    const prestamos = await Prestamos.find().lean();
    res.render('administrar/all-prestamos',{prestamos});
});

router.delete('/administrar/delete/:id',isAuthenticated,async(req,res)=>{
    const {name} = await Prestamos.findById(req.params.id);
    const regresoPrestamo = new Prestamos();
    regresoPrestamo.actualizar = await regresoPrestamo.regresaArticulo(name);
    await Prestamos.findByIdAndDelete(req.params.id);
    req.flash('success_msg','Prestamo cancelado satisfactoriamente.');
    res.redirect('/administrar');
});

module.exports = router;