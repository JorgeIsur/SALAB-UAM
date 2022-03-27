const mongoose = require('mongoose');
const { Schema } = mongoose;

const LabSchema = new Schema({
    name:{type: String,required: true},
    cupo:{type: String,required: true},
    responsable:{type: String, required:true},
    area:{type:String,required:true},
    habilitado:{type: Boolean, required:true}
});

module.exports = mongoose.model('Labs',LabSchema);