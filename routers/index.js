const express = require('express');
const router = express.Router();

// importar express validator
const {body} = require('express-validator');

//importar el controlador
const proyectoControllers = require('../controllers/proyectoControllers');
const tareasControllers = require('../controllers/tareasControllers');
const usuariosControllers = require('../controllers/usuariosControllers');
const authControllers = require('../controllers/authControllers');


module.exports = function() {

    // rutas para el home
    router.get('/',
        authControllers.usuarioAutenticado, //verifica si esta autenticado para mostrar pagina
        proyectoControllers.proyectoHome
    
    );


    router.get('/nuevo-proyecto',
        authControllers.usuarioAutenticado,
        proyectoControllers.formularioProyecto
    );

    router.post('/nuevo-proyecto', 
        authControllers.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectoControllers.nuevoProyecto
    );
    
    // listar proyecto
    router.get('/proyectos/:url', 
        authControllers.usuarioAutenticado,
        proyectoControllers.proyectoPorUrl
    );

    // actualizar el proyecto
    router.get('/proyecto/editar/:id', 
        authControllers.usuarioAutenticado,
        proyectoControllers.formularioEditar
    );

    router.post('/nuevo-proyecto/:id', 
        authControllers.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectoControllers.actualizarProyecto
    );

    // Eliminar proyecto
    router.delete('/proyectos/:url', 
        authControllers.usuarioAutenticado,
        proyectoControllers.eliminarProyecto
    );

    // agregar tarea
    router.post('/proyectos/:url',
        authControllers.usuarioAutenticado,
        tareasControllers.agregarTarea
     );

    // actualizar tarea
    router.patch('/tareas/:id', 
        authControllers.usuarioAutenticado,
        tareasControllers.cambiarEstadoTarea
    );

    // eliminar tarea
    router.delete('/tareas/:id', 
        authControllers.usuarioAutenticado,
        tareasControllers.eliminarTarea
    );

    // crear nueva cuenta 
    router.get('/crear-cuenta', usuariosControllers.formCrearCuenta);
    router.post('/crear-cuenta', usuariosControllers.crearCuenta);
    router.get('/confirmar/:correo', usuariosControllers.confirmarCuenta);

    // iniciar sesion 
    router.get('/iniciar-sesion', usuariosControllers.formIniciarSesion);
    router.post('/iniciar-sesion', authControllers.autenticarUsuario);

    // cerrar sesion
    router.get('/cerrar-sesion', authControllers.cerrarSesion);

    // reestablecer contraseña
    router.get('/reestablecer', usuariosControllers.formReestablecerPassword);
    router.post('/reestablecer', authControllers.enviarToken);
    router.get('/reestablecer/:token', authControllers.validarToken);
    router.post('/reestablecer/:token', authControllers.actualizarPassword);


    return router;

}


