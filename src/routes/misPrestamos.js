const router = require('express').Router();

const Prestamos = require('../models/Prestamos');

const Inventario = require('../models/Inventario');

const Labs = require('../models/Laboratorios');

const Users = require('../models/User');

const {isAuthenticated} = require('../helpers/auth');

const { default: jsPDF } = require('jspdf');

const path = require('path');

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
    nuevoPrestamo.actualizar = await nuevoPrestamo.actualizaInventario(name);
    nuevoPrestamo.user = req.user._id;
    await nuevoPrestamo.save();
    req.flash('success_msg','Prestamo registrado');
    res.redirect('/prestamos');
});

router.get('/prestamos',isAuthenticated,async(req,res)=>{
    try{
        const [{matricula}] = await Users.find({name:req.user.name}).lean();
        const prestamos = await Prestamos.find({matricula:matricula}).lean();
        console.log(prestamos);
        const [{entrega}] = prestamos;
        var fecha = new Date();
        var restante = Math.round(Math.abs(fecha.getTime() - entrega.getTime())/ (1000 * 60 * 60 * 24)); 
        var diferencia = {
            restante:restante,
        };
        console.log(diferencia.restante);
        if(diferencia.restante==0){
            var adeudo = {
                adeudo: new Date()
            };
            res.render('prestamos/all-prestamos',{prestamos,diferencia,adeudo});
        }else{
            var documento = new jsPDF();
            console.log(req.user.matricula);
            //var matricula = req.user.matricula;
            documento.text(10,10,'Universidad Autónoma Metropolitana');
            documento.text(10,20,'Carta de NO adeudos.');
            documento.text(10,30,'Alumno:'+req.user.name+"");
            documento.text(10,40,'Matricula:'+matricula+"");
            documento.text(10,50,'Fecha:'+fecha);
            await documento.save('public/pdf/'+matricula+'-no-adeudos.pdf');
            const server = 'http://127.0.0.1:8887/'
            const ruta = 'public/pdf/'+matricula+"-no-adeudos.pdf";
            var descarga = server + ruta;
            const url = {
                descarga:descarga
            };
            console.log(url);
            res.render('prestamos/all-prestamos',{prestamos,diferencia,url});
        }
    }
    catch(err){
        console.log('entra catch');
        res.render('prestamos/all-prestamos');
    }
});

router.delete('/prestamos/delete/:id',isAuthenticated,async(req,res)=>{
    const [{matricula}] = await Users.find({name:req.user.name}).lean();
    const [{name}] = await Prestamos.find({matricula:matricula}).lean();
    const regresoPrestamo = new Prestamos();
    regresoPrestamo.actualizar = await regresoPrestamo.regresaArticulo(name);
    await Prestamos.findByIdAndDelete(req.params.id);
    req.flash('success_msg','Prestamo cancelado satisfactoriamente.');
    res.redirect('/prestamos');
});

router.get('/prestamos/no-adeudos',isAuthenticated,async(req,res)=>{
    var documento = new jsPDF();
    console.log(req.user.matricula);
    var matricula = req.user.matricula;
    documento.text(10,10,'Universidad Autónoma Metropolitana');
    documento.text(10,20,'Carta de NO adeudos.');
    documento.text(10,30,'Alumno:'+req.user.name+"");
    documento.text(10,40,'Matricula:'+matricula+"");
    documento.text(10,50,'Fecha:'+Date.now());
    await documento.save('public/pdf/'+matricula+'-no-adeudos.pdf');
    const ruta = 'public/pdf/'+matricula+"-no-adeudos.pdf";
    console.log(ruta);
    res.send('<a href="http://127.0.0.1:8887/'+ruta+'" download> PDF </a>')
});

module.exports = router;