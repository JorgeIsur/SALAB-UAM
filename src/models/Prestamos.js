const mongoose = require('mongoose');
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

module.exports = mongoose.model('Prestamos',SchemaPrestamo);