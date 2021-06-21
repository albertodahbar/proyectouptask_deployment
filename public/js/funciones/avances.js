import Swal from 'sweetalert2';

export const actualizarAvance = (req, res) => {
    // seleccionar tareas existentes
    const tareas = document.querySelectorAll('li.tarea');

    if (tareas.length) {
        // seleccionar las tareas completadas 
        const tareasCompletas = document.querySelectorAll('i.completo');

        //calcular el avance
        const avance = Math.round((tareasCompletas.length / tareas.length) * 100);


        // mostrar el avance
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance+'%';

        if (avance === 100) {
            // opcional alerta
            Swal.fire(
                'Completaste el Proyecto',
                'Felicidades haz Terminado tus Tareas',
                'success'
            )
        }

    }

  
}