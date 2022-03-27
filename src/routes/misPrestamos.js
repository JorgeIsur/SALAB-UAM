const router = require('express').Router();

const Inventario = require('../models/Inventario');

const Labs = require('../models/Laboratorios');

const {isAuthenticated} = require('../helpers/auth');

router.get('/administrar/nuevo-prestamo',isAuthenticated,(req,res)=>{
    res.render('administrar/nuevo-prestamo');
});

router.post('/administrar/nuevo-prestamo',isAuthenticated,async(req,res)=>{
    const items = await Inventario.find().lean();
    res.render('administrar/nuevoPrestamo',{items})
    const { name } = req.body;
    const errors=[];
    if(errors.length > 0){
        res.render('administrar/nuevo-prestamo',{
            errors,
            name
        });
    }else{
        const newInventario = new Inventario({name});
        newInventario.user = req.user.id;
        await newInventario.save();
        req.flash('success_msg','Prestamo registrado.')
        res.redirect('/administrar');
    }
});

router.get('/administrar',isAuthenticated,async(req,res)=>{
    const prestamos = await Inventario.find({user:req.user.id}).lean();
    res.render('administrar/misPrestamos',{prestamos});

});

router.get('/administrar/inventario/edit/:id',isAuthenticated, async(req,res)=>{
    const inventario = await Inventario.findById(req.params.id).lean();
    res.render('administrar/editar-item',{inventario});
});

router.put('/administrar/inventario/edit/:id',isAuthenticated,async(req,res)=>{
    const {name, description, area} = req.body;
    await Inventario.findByIdAndUpdate(req.params.id,{name,description,area});
    req.flash('success_msg','Item editado satisfactoriamente.');
    res.redirect('/administrar');
});

router.delete('/administrar/borrar/:id',isAuthenticated,async(req,res)=>{
    await Inventario.findByIdAndDelete(req.params.id);
    req.flash('success_msg','Prestamo cancelado satisfactoriamente.');
    res.redirect('/administrar');
});

module.exports = router;