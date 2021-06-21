const express = require ('express');
const router = require('./routers');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// extraer valores de variables.env
require('dotenv').config({ path: 'variables.env' });

//const expressValidator = require('express-validator');

// helpers con algunas funciones
const helpers = require('./helpers');

//crear conexion a la BD
const db = require('./config/db');

// importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('conectado al servidor'))
    .catch(error => console.log(error) ); 


// crear app de express
const app = express();

//donde cargar los archivos estaticos
app.use(express.static('public'));

// habilitar pug
app.set('view engine', 'pug');

// agregar express validator a las apps
//app.use(expressValidator);

// habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));


// añadir la carpeta de vistas
app.set('views',path.join(__dirname, './views'));

// agregar flash messages
app.use(flash());

// agregar cookie Parser
app.use(cookieParser());

// agregar las sessiones que nos permiten navegar en distintas paginas sin autenticarse de nuevo
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
})); 

// agregar passport
app.use(passport.initialize());
app.use(passport.session())


// pasar vardump a la aplicacion
app.use((req, res, next)=> {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
})
// middleware para la fecha
app.use((req, res, next) => {
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
})



app.use('/',router())

// servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El Servidor esta funcionando');
});

// llamar email
//require('./handlers/email');