const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en UpTask'
    })
}

exports.formIniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesión en UpTask'
    })
}

exports.crearCuenta = async (req, res) => {
    // leer los datos
    const { email, password } = req.body;

    // para manejar el error se usa try .catch
    try {
        // crear el usuario
        await Usuarios.create({
            email,
            password
        });

        // Crear una url de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //crear el objeto de usuario
        const usuario = {
            email
        };

        // enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu Cuenta',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });

        // redirigir al usuario 
        req.flash('correcto', 'Te Enviamos un Correo, Confirma tu Cuenta');
        res.redirect('/iniciar-sesion');

    } catch (error){
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta',{
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en UpTask',
            email,
            password
        })
    }

    
}

exports.formReestablecerPassword = (req,res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer Contraseña'
    })
}

// cambiar estado de cuenta (activo)
exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    // si no existe el user
    if (!usuario) {
        req.flash('error', 'No Valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta Activada Correctamente');
    res.redirect('/iniciar-sesion');
}