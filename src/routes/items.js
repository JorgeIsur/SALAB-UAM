const router = require('express').Router();

const Inventario = require('../models/Inventario');

const Labs = require('../models/Laboratorios');

const {isAuthenticated} = require('../helpers/auth');

router.get('/items/add',(req,res)=>{
    res.render('items/nuevo-articulo');
});

router.post('/items/nuevo-articulo',isAuthenticated,async(req,res)=>{
    const {name, description, cantidad, area, lab, numInventario, stock} = req.body;
    const errors=[];
    if(!name){
        errors.push({text:'Escribe el nombre del artículo'});
    }
    if(!cantidad){
        errors.push({text:'Ingresa la cantidad.'});
    }
    if(!numInventario){
      errors.push({text:'Ingresa el número de inventario.'});
    }
    if(errors.length > 0){
        res.render('items/nuevo-articulo',{
            errors,
            name,
            description,
            cantidad
        });
    }else{
        const nuevoInventario = new Inventario({name,description,cantidad,area,lab,numInventario,stock});
        nuevoInventario.user = req.user.id;
        await nuevoInventario.save();
        req.flash('success_msg','Item registrado.');
        res.redirect('/items');
    }
});

router.get('/items/edit/:id',isAuthenticated,async(req,res)=>{
  const edit = await Inventario.findById(req.params.id).lean();
  res.render('items/edit-item',{edit});
});

router.put('/items/edit-item/:id',isAuthenticated,async(req,res)=>{
  const {name,description,cantidad,numInventario,area,lab,stock} = req.body;
  console.log(area);
  console.log(lab);
  await Inventario.findByIdAndUpdate(req.params.id,{name,description,cantidad,numInventario,area,lab,stock});
  req.flash('success_msg','Item editado.');
  res.redirect('/items');
});

router.get('/items',isAuthenticated,async(req,res)=>{
    const items = await Inventario.find().lean();
    res.render('items/all-items',{items});
});

router.delete('/items/delete/:id',async(req,res)=>{
  await Inventario.findByIdAndDelete(req.params.id);
  req.flash('success_msg','Item borrado.');
  res.redirect('/items');
})

module.exports = router;
