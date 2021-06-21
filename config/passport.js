const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; 

// hacer referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

// local strategy - login con credenciales propias ( usuario y pass)
passport.use(
    new LocalStrategy(
        // por default passport  espera un usuario y pass
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async ( email, password, done ) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: { 
                        email,
                        activo: 1
                     } 
                });
                // el usuario existe pero el pass es incorrecto
                if (!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message : 'Password Incorrecto'
                    })

                }
                // el email existe y pass correcto
                return done(null, usuario);

            } catch (error) {
                // ese usuario no existe
                return done(null, false, {
                    message : 'Esa Cuenta No Existe'
                })

            }

        }
    )
);

// serializar el usuario  (ponerlo junto como un objeto)
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

// deserealizar usuario (acceder al objeto)
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

// exportar
module.exports = passport;
