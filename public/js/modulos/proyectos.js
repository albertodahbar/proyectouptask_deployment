import Swal from  'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar){
    btnEliminar.addEventListener('click', e => {
        const urlProyecto = e.target.dataset.proyectoUrl;

        //console.log(urlProyecto); 

        Swal.fire({
            title: 'Deseas Borrar este Proyecto?',
            text: "Un Proyecto Eliminado No se Puede Recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'si, eliminar!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                // enviar peticion a axios
                const url = `${location.origin}/proyectos/${urlProyecto}`;

                axios.delete(url, { params: {urlProyecto} })
                    .then(function(respuesta){
                        Swal.fire(
                            'Eliminado!',
                            respuesta.data,
                            'success'
                        );
                
                        setTimeout(() => {
                            window.location.href = '/'
                        }, 3000);
                    })
                    .catch(() => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Hubo un Error',
                            text: 'No se Pudo Eliminar el Proyecto'
                        })
                    })


                
    
            }
          })
    })
}

export default btnEliminar;