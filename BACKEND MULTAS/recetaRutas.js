const express = require('express');
const rutas = express.Router();
const multaModel = require('../models/Multa');
const UsuarioModel = require('../models/Usuario');


//endpoint 1.  traer todas las multas, usuarios, placas, correos
rutas.get('/getRecetas', async (req, res) => {
    try  {
        const receta = await  RecetaModel.find();
        res.json(receta);
    } catch (error){
        res.status(500).json({mensaje: error.message});
    }
});
//endpoint 2. Crear 
rutas.post('/crear', async (req, res) => {

    const multa = new multaModel({
        nombre: req.body.nombre,
        correo: req.body.correo,
        placa: req.body.placa,
        multa: req.body.multa,
        usuario: req.body.usuario // asignar el id del usuario
    })
    try {
        const nuevaMulta = await multa.save();
        res.status(201).json(nuevaMulta);
    } catch (error) {
        res.status(400).json({ mensaje :  error.message})
    }
});
//endpoint 3. Editar
rutas.put('/editar/:id', async (req, res) => {
    try {
        const multaEditada = await multaModel.findByIdAndUpdate(req.params.id, req.body, { new : true });
        if (!multaEditada)
            return res.status(404).json({ mensaje : 'Multa no encontrada!!!'});
        else
            return res.status(201).json(multaEditada);

    } catch (error) {
        res.status(400).json({ mensaje :  error.message})
    }
});
//ENDPOINT 4. eliminar
rutas.delete('/eliminar/:id',async (req, res) => {
    try {
       const multaEliminada = await multaModel.findByIdAndDelete(req.params.id);
       if (!multaEliminada)
            return res.status(404).json({ mensaje : 'Multa no encontrada!!!'});
       else 
            return res.json({mensaje :  'Multa eliminada'});    
       } 
    catch (error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
// - 5. obtener una receta por su ID
rutas.get('/multa/:id', async (req, res) => {
    try {
        const multa = await multaEditadaModel.findById(req.params.id);
        if (!multa)
            return res.status(404).json({ mensaje : 'multa no encontrada!!!'});
        else 
            return res.json(multa);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});

// - eliminar todas las multas
rutas.delete('/eliminarTodos', async (req, res) => {
    try {
        await multaModel.deleteMany({ });
        return res.json({mensaje: "Todas las multas han sido eliminadas"});
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
// - contar el numero total de multas
rutas.get('/totalmultas', async (req, res) => {
    try {
        const total = await multaModel.countDocuments();
        return res.json({totalmulta: total });
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
// - obtener multas ordenadas por nombre ascendente
// query.sort({ field: 'asc', test: -1 });
rutas.get('/ordenarmultas', async (req, res) => {
    try {
       const multasOrdenadas = await multasModel.find().sort({ nombre: -1});
       res.status(200).json(multasOrdenadas);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});

//REPORTES 1
rutas.get('/recetaPorUsuario/:usuarioId', async (peticion, respuesta) =>{
    const {usuarioId} = peticion.params;
    console.log(usuarioId);
    try{
        const usuario = await UsuarioModel.findById(usuarioId);
        if (!usuario)
            return respuesta.status(404).json({mensaje: 'usuario no encontrado'});
        const recetas = await RecetaModel.find({ usuario: usuarioId}).populate('usuario');
        respuesta.json(recetas);

    } catch(error){
        respuesta.status(500).json({ mensaje :  error.message})
    }
})

//REPORTES 2
//sumar porciones de recetas por Usuarios
rutas.get('/porcionPorUsuario', async (req, res) => {
    try {   
        const usuarios = await UsuarioModel.find();
        const reporte = await Promise.all(
            usuarios.map( async ( usuario1 ) => {
                const recetas = await RecetaModel.find({ usuario: usuario1._id});
                const totalPorciones = recetas.reduce((sum, receta) => sum + receta.porciones, 0);
                return {
                    usuario: {
                        _id: usuario1._id,
                        nombreusuario: usuario1.nombreusuario
                    },
                    totalPorciones,
                    recetas: recetas.map( r => ( {
                        _id: r._id,
                        nombre: r.nombre,
                        porciones: r.porciones
                    }))
                }
            } )
        )
        res.json(reporte);
    } catch (error){
        res.status(500).json({ mensaje :  error.message})
    }
})

module.exports = rutas;