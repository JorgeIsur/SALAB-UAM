const mongoose = require('mongoose');

const inventario = require('../models/Inventario');

const { Schema } = mongoose;

const prestamo = new Date();
const entrega = new Date();
entrega.setDate(prestamo.getDate()+7);

const SchemaPrestamo = new Schema({
    matricula:{type: String,required:true},
    name:{type:String,required:true},
    articulo:{type:String,required:true},
    laboratorio:{type: String, required:true},
    cantidad:{type:String, required:true},
    fecha:{type:Date, default:prestamo},
    entrega:{type:Date,default:entrega}
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
    const valor = parseInt(cantidad)+1;
    console.log(valor);
    console.log(_id.toString());
    await inventario.findByIdAndUpdate(_id.toString(),{cantidad:valor.toString()});
};

module.exports = mongoose.model('Prestamos',SchemaPrestamo);