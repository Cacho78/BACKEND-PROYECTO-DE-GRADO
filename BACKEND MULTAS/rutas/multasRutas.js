const express = require('express');
const rutas = express.Router();
const multaModel = require('../models/Multa');
const UsuarioModel = require('../models/Usuario');


// ENDPOINT 1.  TRAER TODAS LAS MULTAS.

rutas.get('/getmultas', async (req, res) => {
    try  {
        const multa = await  multaModel.find();
        res.json(multa);
    } catch (error){
        res.status(500).json({mensaje: error.message});
    }
});

//ENDPOINT 2. CREACION DE LA MULTA.

rutas.post('/crear', async (req, res) => {

    const multa = new multaModel({
        nombre: req.body.nombre,
        correo: req.body.correo,
        placa: req.body.placa,
        multa: req.body.multa,
        error: req.body.error,
        usuario: req.body.usuario // asignar el id del usuario
    });
    try {
        const nuevaMulta = await multa.save();
        res.status(201).json(nuevaMulta);
    } catch (error) {
        res.status(404).json({ mensaje :  error.message})
    }
});

// ENDPOINT 3. EDITAR MULTA.

rutas.put('/editar/:id', async (req, res) => {
    try {
        const multaEditada = await multaModel.findByIdAndUpdate(req.params.id, req.body, { new : true });
        if (!multaEditada)
            return res.status(404).json({ mensaje : 'Multa no encontrada!!!'});
        else
            return res.status(201).json(multaEditada);

    } catch (error) {
        res.status(400).json({ mensaje :  error.message});
    }
});

//ENDPOINT 4. ELIMINAR MULTA POR ID.

rutas.delete('/eliminar/:id',async (req, res) => {
    try {
       const multaEliminada = await multaModel.findByIdAndDelete(req.params.id);
       if (!multaEliminada)
            return res.status(404).json({ mensaje : 'Multa no encontrada!!!'});
       else 
            return res.json({mensaje :  'Multa eliminada'});    
       } 
    catch (error) {
        res.status(500).json({ mensaje :  error.message});
    }
});

// ENDPOINT 5. OBTENER UNA MULTA POR SU ID.

rutas.get('/multa/:id', async (req, res) => {
    try {
        const multa = await multaModel.findById(req.params.id);
        if (!multa)
            return res.status(404).json({ mensaje : 'multa no encontrada!!!'});
        else 
            return res.json(multa);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message});
    }
});

// ENDPOINT 6 CONTAR EL TOTAL DE MULTAS.

rutas.get('/totalmultas', async (req, res) => {
    try {
        const total = await multaModel.countDocuments();
        return res.json({totalmulta: total });
    } catch(error) {
        res.status(500).json({ mensaje :  error.message});
    }
});

// ENDPOINT 7 OBTENER MULTAS ORDENADAS POR NOMBRE ASCENDENTE.
// query.sort({ field: 'asc', test: -1 });

rutas.get('/ordenarmultas', async (req, res) => {
    try {
       const multaOrdenadas = await multaModel.find().sort({ nombre: -1});
       res.status(200).json(multaOrdenadas);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message});
    }
});

//REPORTE 1 para obtener todas las multas de un usuario específico con si Id

rutas.get('/multasusuario/:usuarioId', async (req, res) => {
    try {
        const multasUsuario = await multaModel.find({ usuario: req.params.usuarioId });
        if (multasUsuario.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron multas para este usuario' });
        }
        res.json(multasUsuario);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});
     
//REPORTE 2 para obtener todas las multas con un tipo específico de error

rutas.get('/multasconerror/:tipoError', async (req, res) => {
    try {
        const multasConError = await multaModel.find({ error: req.params.tipoError });
        if (multasConError.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron multas con este tipo de error' });
        }
        res.json(multasConError);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});
             
 module.exports = rutas;
