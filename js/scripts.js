eventListeners();

var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners() {
    // Cuando carga el DOM poner barra de progreso
    document.addEventListener('DOMContentLoaded', function() {
        actualizarProgreso();
    });
    // boton para crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    // boton para crear tarea
    if (document.querySelector('.boton.nueva-tarea')) { document.querySelector('.boton.nueva-tarea').addEventListener('click', nuevaTarea); }

    // Botones para las acciones de las tareas DELEGATION
    if (document.querySelector('.listado-pendientes')) { document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas); }
}

function nuevaTarea(e) {
    e.preventDefault();
    var nombreTarea = document.querySelector('.nombre-tarea').value;
    // Validar que el nombre de la tarea no esté vacia
    if (nombreTarea === '') {
        swal({
            title: 'Error',
            text: 'El nombre es obligatorio',
            type: 'error'
        });
    } else {
        // insertar en PHP
        // Crear llamado AJAX
        var xhr = new XMLHttpRequest();

        // Crear FORMDATA
        var datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

        // Abrir la conexión
        xhr.open('POST', 'inc/modelos/modelo-tarea.php', true);

        // Ejecución y Respuesta
        xhr.onload = function() {
                if (this.status === 200) {
                    var respuesta = JSON.parse(xhr.responseText);
                    //console.log(respuesta);
                    var resultado = respuesta.respuesta,
                        tarea = respuesta.nombre_tarea,
                        id_insertado = respuesta.id_insertado,
                        tipo = respuesta.tipo;

                    if (resultado === 'correcto') {
                        if (tipo === 'crear') {
                            // alerta
                            swal({
                                title: 'Nice!',
                                text: 'Tarea Creada Correctamente',
                                type: 'success'
                            });

                            // Seleccionar el párrafo con la lista vacía
                            var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
                            if (parrafoListaVacia.length > 0) {
                                document.querySelector('.lista-vacia').remove();
                            }

                            // Construir Template
                            var nuevaTarea = document.createElement('li');
                            // Agregar ID
                            nuevaTarea.id = 'tarea:' + id_insertado;
                            // Agregar Clase
                            nuevaTarea.classList.add('tarea');
                            // Insertar HTML
                            nuevaTarea.innerHTML = `
                            <p>${tarea}</p>
                            <div class="acciones">
                            <i class ="far fa-check-circle"></i>
                            <i class ="fas fa-trash"></i>
                            </div>
                            `;
                            // Agregar al DOM
                            var listado = document.querySelector('.listado-pendientes ul');
                            listado.appendChild(nuevaTarea);

                            // Limpiar el form
                            document.querySelector('.agregar-tarea').reset();
                            actualizarProgreso();
                        }
                    } else {
                        swal({
                            title: 'Oops!',
                            text: 'Hubo un Error',
                            type: 'error'
                        });
                    }
                }
            }
            // Enviar la consulta
        xhr.send(datos);
    }
}

function nuevoProyecto(e) {
    e.preventDefault();

    // Aparece un <input> para el nombre del nuevo proyecto a crear
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);

    // Seleccionar el ID con el nuevo proyecto
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    // Al presionar enter crea el proyecto
    inputNuevoProyecto.addEventListener('keypress', function(e) {
        var tecla = e.which || e.keyCode;
        if (tecla === 13) {
            guardarProyectoDB(inputNuevoProyecto.value);
            listaProyectos.removeChild(nuevoProyecto);
        }
    });
}

function guardarProyectoDB(nombreProyecto) {
    // Crear llamado AJAX
    var xhr = new XMLHttpRequest();

    // Crear formdata para enviar datos
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');

    // Abrir la conexión 
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);

    // ONLOAD
    xhr.onload = function() {
        if (this.status === 200) {
            var respuesta = JSON.parse(xhr.responseText);
            var proyecto = respuesta.nombre_proyecto,
                id_proyecto = respuesta.id_insertado,
                tipo = respuesta.tipo,
                resultado = respuesta.respuesta;

            // Comprobar resultado 
            if (resultado === 'correcto') {
                // Fue exitoso
                if (tipo === 'crear') {
                    // Se creó un nuevo proyecto
                    // Inyectar el HTML
                    var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                        <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                             ${proyecto}
                        </a>
                    `;
                    // Agregar al HTML
                    listaProyectos.appendChild(nuevoProyecto);
                    // enviar alerta
                    swal({
                        title: 'Proyecto Creado',
                        text: 'El Proyecto: ' + proyecto + 'fue creado correctamente',
                        type: 'success'
                    }).then(resultado => {
                        if (resultado.value) {
                            window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                        }
                    });
                } else {
                    // Se actualizo o elimino
                }
            } else {
                // Hubo un error
                SVGFEDropShadowElement({
                    type: 'error',
                    title: 'Error!',
                    text: 'Hubo un error!'
                });
            }
        }
    }

    // enviar datos
    xhr.send(datos);
}

function accionesTareas(e) {
    e.preventDefault();

    if (e.target.classList.contains('fa-check-circle')) {
        if (e.target.classList.contains('completo')) {
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        } else {
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }
    }
    if (e.target.classList.contains('fa-trash')) {
        Swal.fire({
            title: 'Seguro(a)?',
            text: 'Ésta Acción no se puede deshacer!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, deseo borrar!',
            cancelButtonText: 'Cancelar'

        }).then((result) => {
            if (result.value) {

                var tareaEliminar = e.target.parentElement.parentElement;
                // Borrar de la BD
                eliminarTareaBD(tareaEliminar);
                // Borrar del HTML
                tareaEliminar.remove();
                swal(
                    'Borrado!',
                    'La tarea se eliminó correctamente',
                    'success'
                )
            }
        })
    }


}

// Completa o no una tarea

function cambiarEstadoTarea(tarea, estado = int) {
    var idTarea = tarea.parentElement.parentElement.id.split(':');
    // console.log(idTarea);
    // Crear llamado AJAX
    xhr = new XMLHttpRequest();

    // Informacion
    var datos = new FormData();
    datos.append('id_tarea', idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);

    // open la conexion
    xhr.open('POST', 'inc/modelos/modelo-tarea.php', true);

    // ONLOAD
    xhr.onload = function() {
            if (this.status === 200) {
                var respuesta = JSON.parse(xhr.responseText);
                actualizarProgreso();
            }
        }
        // enviar la peticion 
    xhr.send(datos);
}

// Elimina tarea de la base de datos
function eliminarTareaBD(tarea) {
    var idTarea = tarea.id.split(':');
    // console.log(idTarea);
    // Crear llamado AJAX
    xhr = new XMLHttpRequest();

    // Informacion
    var datos = new FormData();
    datos.append('id_tarea', idTarea[1]);
    datos.append('accion', 'eliminar');

    // open la conexion
    xhr.open('POST', 'inc/modelos/modelo-tarea.php', true);

    // ONLOAD
    xhr.onload = function() {
            if (this.status === 200) {
                var respuesta = JSON.parse(xhr.responseText);
                // Comprobar que haya tareas restantes
                var listaTareasRestantes = document.querySelectorAll('li.tarea');
                if (listaTareasRestantes.length === 0) {
                    document.querySelector('.listado-pendientes ul').innerHTML = "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
                }
                actualizarProgreso();
            }
        }
        // enviar la peticion 
    xhr.send(datos);
}

// Actualiza el avance del proyecto 
function actualizarProgreso() {
    // Obtener todas las tareas
    const tareas = document.querySelectorAll('li.tarea');

    // Obtener tareas completadas
    const tareasCompletadas = document.querySelectorAll('i.completo');

    // Determinar el avance
    const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);

    // Asignar el avance a la barra
    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance + '%';

    if (avance === 100) {
        swal({
            title: 'Proyecto Finalizado!',
            text: 'Ya no tienes tareas pendientes',
            type: 'success'
        });
    }
}