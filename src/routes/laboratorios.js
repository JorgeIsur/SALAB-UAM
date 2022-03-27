const router = require('express').Router();

const Labs = require('../models/Laboratorios');

const {isAuthenticated} = require('../helpers/auth');

router.get('/laboratorios',async(req,res)=>{
  const labs = await Labs.find().lean();
  res.render('laboratorios/all-labs',{labs});
});

router.get('/laboratorios/add',isAuthenticated,async(req,res)=>{
  res.render('laboratorios/nuevo-lab');
});

router.post('/laboratorios/nuevo-lab',isAuthenticated,async(req,res)=>{
  const {name, cupo, responsable, area} = req.body;
  var {habilitado} = req.body;
  console.log(habilitado);
  if(typeof habilitado == 'undefined'){
    console.log("No definido...");
    habilitado = false;
  }
  const errors=[];
  if(!name){
    errors.push({text:'Ingresa el nombre del laboratorio.'});
  }
  if(!cupo){
    errors.push({text:'Ingresa el cupo.'});
  }
  if(!responsable){
    errors.push({text:'Ingresa al responsable.'});
  }
  if(!area){
    errors.push({text:'Selecciona un area.'});
  }
  if(errors.length > 0){
    res.render('laboratorios/nuevo-lab',{
      errors,
      name,
      cupo,
      responsable
    });
  }else{
    const nuevoLab = new Labs({name,cupo,responsable,area,habilitado});
    nuevoLab.user = req.user.id;
    await nuevoLab.save();
    req.flash('success_msg','Laboratorio registrado.');
    res.redirect('/laboratorios');
  }
});

router.get('/laboratorios/edit/:id',isAuthenticated,async(req,res)=>{
  const edit = await Labs.findById(req.params.id).lean();
  res.render('laboratorios/edit-lab',{edit});
});

router.put('/laboratorios/edit-lab/:id',isAuthenticated,async(req,res)=>{
  const {name,cupo,responsable,area} = req.body;
  var {habilitado} = req.body;
  console.log(habilitado);
  if(typeof habilitado == 'undefined'){
    console.log("No definido...");
    habilitado = false;
  }
  await Labs.findByIdAndUpdate(req.params.id,{name,cupo,responsable,area,habilitado});
  req.flash('success_msg','Laboratorio actualizado.');
  res.redirect('/laboratorios');
});

router.delete('/laboratorios/delete/:id',isAuthenticated,async(req,res)=>{
  await Labs.findByIdAndDelete(req.params.id);
  req.flash('success_msg','Laboratorio borrado.');
  res.redirect('/laboratorios');
});


module.exports = router;
