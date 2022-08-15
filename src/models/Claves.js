const mongoose = require('mongoose');
const {Schema} = mongoose;

const KeySchema = new Schema({
    matricula:{type: String,required:true},
    name:{type: String, required:true},
    clave:{type: String,required:true},
    recogido:{type: Boolean, required:true}
});

module.exports = mongoose.model('Claves', KeySchema);
