const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.proyectoHome = async (req,res)=> {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId}});
    res.render('index',{
        nombrePagina : 'Proyectos',
        proyectos
    });
}


exports.formularioProyecto = async (req, res)=> {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId}});
    res.render('nuevoProyecto',{
        nombrePagina : 'Nuevo Proyecto',
        proyectos
    })
}

exports.nuevoProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId}});
    //enviar a la consola lo que escribe el usuario
    //console.log(req.body)

    //validar q tengamos algo en el input
    const {nombre} =req.body;

    let errores = [];

    if (!nombre){
        errores.push({'texto' : 'Agrega un Nombre al Proyecto'})
    }

    // si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else {
        // no hay errores
        //insertar a la BD
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({nombre, usuarioId });
        res.redirect('/')

    }
}

exports.proyectoPorUrl = async (req, res, next) =>{
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: { usuarioId}});
    
    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    // consultar tareas del proyecto actual
    const tareas = await Tareas.findAll({
        where : {
            proyectoId : proyecto.id
        },
        include: [{
            model: Proyectos
        }]
    });


    if(!proyecto) return next ();
    
    // render de la vista
    res.render('tareas',{
        nombrePagina : 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

exports.formularioEditar = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: { usuarioId}});
    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);


    // render a la vista
    res.render('nuevoProyecto', {
        nombrePagina : 'Editar Proyecto',
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId}});
    //enviar a la consola lo que escribe el usuario
    //console.log(req.body)

    //validar q tengamos algo en el input
    const {nombre} =req.body;

    let errores = [];

    if (!nombre){
        errores.push({'texto' : 'Agrega un Nombre al Proyecto'})
    }

    // si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else {
        // no hay errores
        //insertar a la BD
        await Proyectos.update(
            {nombre: nombre},
            {where : {id : req.params.id }}
            
            
        );
        res.redirect('/')

    }
}

exports.eliminarProyecto = async (req, res, next) => {
    // req, se usa params o query
    const {urlProyecto} = req.query;
    const resultado = await Proyectos.destroy({ where : { url : urlProyecto}});
    
    if(!resultado){
        return next();
    }

    res.status(200).send('El Proyecto fue Eliminado Correctamente');
}