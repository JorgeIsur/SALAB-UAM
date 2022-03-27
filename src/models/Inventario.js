const mongoose = require('mongoose');
const { Schema } = mongoose;

const EquipmentSchema = new Schema({
    name:{type: String,required: true},
    description:{type: String,required: true},
    cantidad:{type: String, required:true},
    area:{type:String,required:true},
    lab:{type:String,required:true},
    numInventario:{type:String,required:true},
    stock:{type: Boolean, required:true}
});

module.exports = mongoose.model('Inventario',EquipmentSchema);
