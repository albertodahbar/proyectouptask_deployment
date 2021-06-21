import axios from "axios";
import Swal from "sweetalert2";
import {actualizarAvance} from '../funciones/avances';


const tareas = document.querySelector('.listado-pendientes'); 

if (tareas) {

    tareas.addEventListener('click', e => {
        if (e.target.classList.contains('fa-check-circle')){
            const icono = e.target ;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            
            // req hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;
            
            axios.patch(url, { idTarea })
                .then(function(respuesta){
                    if(respuesta.status === 200){
                        icono.classList.toggle('completo');

                        actualizarAvance();
                    }

                })

        }
        if (e.target.classList.contains('fa-trash')){
            
            const tareaHTML = e.target.parentElement.parentElement,
                    idTarea = tareaHTML.dataset.tarea;
                    Swal.fire({
                        title: 'Deseas Borrar esta Tarea?',
                        text: "Una Tarea Eliminada No se Puede Recuperar!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'si, eliminar!',
                        cancelButtonText: 'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const url = `${location.origin}/tareas/${idTarea}`;
                            // enviar delete por medio de axios
                            axios.delete(url, { params: { idTarea } })
                                .then(function(respuesta){
                                    if (respuesta.status ===200 ){
                                        // eliminar el nodo
                                        tareaHTML.parentElement.removeChild(tareaHTML);

                                        // opcional alerta
                                        Swal.fire(
                                            'Tarea Eliminada',
                                            respuesta.data,
                                            'success'
                                        )
                                        actualizarAvance();
                                    }
                                });

                        }
                    })
        }

    });

}

export default tareas;