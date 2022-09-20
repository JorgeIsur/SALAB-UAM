const router = require('express').Router();
const Claves = require('../models/Claves');
const {isAuthenticated} = require('../helpers/auth');
const Users = require('../models/User');
const mqtt = require('mqtt');

router.get('/recoger',isAuthenticated,async(req,res)=>{
    const [{matricula}] = await Users.find({name:req.user.name});
    const recoger = await Claves.find({matricula:matricula}).lean();
    res.render('recoger/all-recoger',{recoger});
});

router.post('/recoger/abrir',isAuthenticated,async(req,res)=>{
    console.log(req.body);
    var {recoger} = req.body;
    recoger = true;
    await Claves.findByIdAndUpdate(req.params.id,{recogido:recoger});
    res.redirect('/recoger');
});

router.get('/recoger/nuevo-recoger',isAuthenticated,async(req,res)=>{
    res.render('recoger/nuevo-recoger');
});

router.post('/recoger/nuevo-recoger',isAuthenticated,async(req,res)=>{
    const {matricula,clave} = req.body;
    const errors = [];
    if(matricula.length<=0){
        errors.push({text:"Matricula no puede estar vacio."})   
    }
    if(clave.length<=0){
        errors.push({text:"Clave no puede estar vacio."});
    }
    if(errors.length>0){
        res.render('recoger/nuevo-recoger',{errors,matricula,clave});
    }
    else{
        console.log('entra else');
        const recogerUser = await Claves.findOne({matricula:matricula})
        if(recogerUser){
            console.log(clave);
            console.log(typeof clave);
            console.log(recogerUser);
            console.log(recogerUser.clave);
            console.log(typeof recogerUser.clave);
            if(clave === recogerUser.clave){
                console.log('clave correcta');
                res.redirect('/recoger');
            }else{
                console.log('Contraseña incorrecta');
                req.flash('error_msg','Clave incorrecta');
                res.redirect('/recoger/nuevo-recoger');
            }
        }else{
            console.log('usuario no encontrado');
            req.flash('error_msg','La matricula ingresada no tiene préstamos registrados');
            res.redirect('/recoger/nuevo-recoger');
        }
    }
});

module.exports = router;