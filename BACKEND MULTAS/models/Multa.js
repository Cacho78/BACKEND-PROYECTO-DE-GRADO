const mongoose = require('mongoose');
//definir el esquema
const multaSchema = new mongoose.Schema({
    // nombre: { type: String, require: true}
    nombre: String,
    correo: String,
    placa: String,
    multa: Number,
    error: String,
});

const multaModel = mongoose.model('multa',multaSchema, 'multa');
module.exports = multaModel;