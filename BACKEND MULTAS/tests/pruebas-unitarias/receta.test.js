const express = require('express');
const request = require('supertest');
const multasRutas = require('../../rutas/multasRutas');
const multaModel = require('../../models/Multa');
const mongoose  = require('mongoose');
const app = express();
app.use(express.json());
app.use('/multas', multasRutas);

describe('Pruebas Unitarias para multas', () => {
    //se ejecuta antes de iniciar las pruebas
    beforeEach(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/multas',{
            useNewUrlParser : true,            
        });
        await multaModel.deleteMany({});
    });
    // al finalziar las pruebas
    afterAll(() => {
        return mongoose.connection.close();
      });

    //1er test : GET
    test('Deberia Traer todas las multas metodo: GET: getmultas', async() =>{
        await multaModel.create({ nombre: 'Maria Isabel Fernholz Soto', correo: 'mifernholz@gmail.com', multa: 100, placa: '318lch', error:'Jiro en u en la Rotonda'});
        await multaModel.create({ nombre: 'Carlos Montero Pantoja', correo: 'carlosmonterop1978@gmail.com', multa: 200, placa: '4466lpl', error:'Jiro en u en el 5 anillo' });
        // solicitud - request
        const res =  await request(app).get('/multas/getmultas');
        //verificar la respuesta
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
    }, 10000);

    test('Deberia agregar una nueva multa: POST: /crear', async() => {
        const nuevaMulta = {
            nombre: 'Sofia Montero Fernholz',
            correo: 'sofiamf@gmail.com',
            placa: '8822lol',
            multa: 150,
            error: 'Jiro en u en la Rotonda del 6 anillo'
            
        };
        const res =  await request(app)
                            .post('/multa/crear')
                            .send(nuevaMulta);
        expect(res.statusCode).toEqual(201);
        expect(res.body.nombre).toEqual(nuevaMulta.nombre);
    });

    test('Deberia actualizar una tarea que ya existe: PUT /editar/:id', async()=>{
        const multaCreada = await multaModel.create(
                                  { nombre: 'Sofia Montero Fernholz',
                                    correo: 'sofiamf@gmail.com',
                                    placa: '8822lol',
                                    multa: 150,
                                    error: 'Jiro en u en la Rotonda del 6 anillo'})
        const multaActualizar = {
            nombre: 'Sofia Montero Fernholz',
            correo: 'sofiamf@gmail.com',
            placa: '8822lol',
            multa: 200,
            error: 'se cruzo la interseccion en luz roja del 5 anillo (EDITADO)',
        };
        const res =  await request(app)
                            .put('/libro/editar/'+multaCreada)
                            .send(multaActualizar);
        expect(res.statusCode).toEqual(201);
        expect(res.body.nombre).toEqual(multaActualizar.nombre);                   

    });
   
    test('Deberia eliminar una multa existente : DELETE /eliminar/:id', async() =>{
        const multaCreada = await multaModel.create(
            {   nombre: 'Sofia Montero Fernholz',
                correo: 'sofiamf@gmail.com',
                placa: '8822lol',
                multa: 150,
                error: 'Jiro en u en la Rotonda del 6 anillo'
                
             });

        const res =  await request(app)
                                .delete('/multas/eliminar/'+multaCreada._id);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({mensaje :  'multa eliminada'});
    });
});