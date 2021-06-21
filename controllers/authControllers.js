const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// libreria de node que permite generar token
const crypto = require('crypto');
const { reset } = require('slug');
const bcrypt = require('bcrypt-nodejs');

// importar enviarEmail de handler
const enviarEmail = require('../handlers/email');


exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos Campos son Obligatorios'
});

// funcion para revisar si el usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) =>{

    // si el usuario esta autenticado, adelante
    if (req.isAuthenticated()) {
        return next();
    }

    // si no esta autenticado redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

// funcion para cerrar sesion
exports.cerrarSesion = (req, res) =>{
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion') // al cerrar sesion llega a la pagina de login
    })
}

// genera un token si el user es valido
exports.enviarToken = async (req,res) =>{
    // verificar q el usuario existe
    const {email} = req.body;
    const usuario = await Usuarios.findOne({
        where: { 
            email
        }
    })
    
    // si no hay usuario
     if (!usuario) {
         req.flash('error', 'No Existe esa Cuenta');
         res.redirect('/reestablecer');
     }
     // usuario existe
     usuario.token = crypto.randomBytes(20).toString('hex');

     // expiracion del token
     usuario.expiracion = Date.now() + 3600000;

     // guardarlos en la base de datos
     await usuario.save();    
     
     // url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    // enviar correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'password reset',
        resetUrl,
        archivo: 'reestablecer-password'
    });

    // finalizar accion
    req.flash('correcto', 'se envió un enlace de recuperacion a tu email');
    res.redirect('/iniciar-sesion');


}

exports.validarToken = async (req,res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token : req.params.token
        }
    });

    // sino encuentra el user
    if (!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    // formulario para generar el password
    res.render('resetPassword', {
        nombrePagina : 'Reestablecer Contraseña'
    })
}

// cambiar el pass por uno nuevo
exports.actualizarPassword = async (req, res) => {

    // verifica el token valido pero tambien la fecha de expiracion 
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token, 
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });

    // verificamos si el user existe
    if (!usuario) {
        req.flash('error', 'No Valido');
        res.redirect('/reestablecer');
    }

    // hashear el nuevo pass
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    // vacias token y expiracion
    usuario.token = null;
    usuario.expiracion = null;

    // guardamos el nuevo pass
    await usuario.save();

    req.flash('correcto', 'Tu Password se ha Modificado Correctamente');
    res.redirect('/iniciar-sesion');
}