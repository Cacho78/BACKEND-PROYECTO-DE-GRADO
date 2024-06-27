//importacion de libs
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authRutas = require('./rutas/authRutas');
const Usuario = require('./models/Usuario');
const ObjectId = mongoose.Types.ObjectId;
require('dotenv').config();
const app = express();

// Ejemplo de creación de un nuevo ObjectId válido
const newId = new ObjectId();
console.log(newId); // Esto imprimirá un ObjectId generado aleatoriamente

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(bodyParser.json());

// ruta
const multasRutas = require('./rutas/multasRutas');

// configuraciones de environment
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

//manejo de JSON
app.use(express.json());

//CONEXION CON MONGODB\
mongoose.connect(MONGO_URI)
.then(() => {
        console.log('Conexion exitosa');
        app.listen(PORT, () => {console.log("Servidor express corriendo en el puerto: "+PORT)})
    }
).catch( error => console.log('error de conexion', error));

const autenticar = async (req, res, next)=>{
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token)
            res.status(401).json({mensaje: 'No existe el token de autenticacion'});
        const decodificar = jwt.verify(token, 'clave_secreta');
        req.usuario = await  Usuario.findById(decodificar.usuarioId);
        next();
    }
    catch(error){
        res.status(400).json({ error: error.message});
    }
};

app.use('/auth', authRutas);
app.use('/multas', autenticar, multasRutas);

//utilizar las rutas de multas
 app.use('/multas', multasRutas);

