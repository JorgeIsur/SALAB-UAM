const req = require('express/lib/request');

const router = require('express').Router();

const User = require('../models/User');

const passport = require('passport');

router.get('/users/signin',(req,res)=>{
    res.render('users/signin');
});

router.post('/users/signin',passport.authenticate('local',{
    successRedirect: '/administrar',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup',(req,res)=>{
    res.render('users/signup');
});

router.post('/users/signup',async (req,res)=>{
    const {name,email,password,confirm_password,admin} = req.body;
    const errors = [];
    if(name.length<=0){
        errors.push({text:"Nombre no puede estar vacio."})
    }
    if(email.length<=0){
        errors.push({text:"Es necesario insertar un correo."})
    }
    if(password!=confirm_password){
        errors.push({text:"Las contraseñas no coinciden."});
    }
    if(password.length<4){
        errors.push({text:"La contraseña debe tener almenos 4 caracteres."});
    }
    if(errors.length>0){
        res.render('users/signup',{errors,name,email,password});
    }else{
    const emailUser = await User.findOne({email:email}).lean();
    if(emailUser){
        req.flash('error_msg','Este email ya ha sido registrado.');
        req.redirect('/users/signup');
    }
    const newUser = new User({name,email,password,admin});
    newUser.password = await newUser.encryptPassword(password);
    await newUser.save();
    req.flash('success_msg','Se ha realizado el registro exitosamente.');
    res.redirect('/users/signin');
    }
});

router.get('/users/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
});

module.exports = router;
