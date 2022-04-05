const mongoose = require('mongoose');

const inventario = require('../models/Inventario');

const { Schema } = mongoose;

const prestamo = new Date();
const entrega = new Date();

var formato_prestamo = prestamo;
var formato_entrega = entrega;

formato_prestamo  =""+ prestamo.getDate()+"/"+(prestamo.getMonth()+1)+"/"+prestamo.getFullYear();

entrega.setDate(prestamo.getDate()+7);

formato_entrega =""+ entrega.getDate()+"/"+(entrega.getMonth()+1)+"/"+entrega.getFullYear();

const SchemaPrestamo = new Schema({
    matricula:{type: String,required:true},
    name:{type:String,required:true},
    articulo:{type:String,required:true},
    laboratorio:{type: String, required:true},
    cantidad:{type:String, required:true},
    fecha:{type:Date, default:prestamo},
    entrega:{type:Date,default:entrega},
    f_fecha:{type:String,default:formato_prestamo},
    f_entrega:{type:String,default:formato_entrega}
});

SchemaPrestamo.methods.actualizaInventario = async (articulo)=>{
    const [{ cantidad, _id }] = await inventario.find({name:articulo}).lean();
    const valor = parseInt(cantidad)-1;
    console.log(valor);
    console.log(_id.toString());
    await inventario.findByIdAndUpdate(_id.toString(),{cantidad:valor.toString()});
};

SchemaPrestamo.methods.regresaArticulo = async (articulo)=>{
    const [{ cantidad, _id }] = await inventario.find({name:articulo}).lean();
    console.log(_id);
    const valor = parseInt(cantidad)+1;
    console.log(valor);
    console.log(_id.toString());
    await inventario.findByIdAndUpdate(_id.toString(),{cantidad:valor.toString()});
};

module.exports = mongoose.model('Prestamos',SchemaPrestamo);