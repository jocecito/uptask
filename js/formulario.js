eventListeners();

function eventListeners() {
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}

function validarRegistro(e) {
    e.preventDefault();

    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;

    if (usuario === '' || password === '') {
        swal({
            type: 'error',
            title: 'Oops...',
            text: 'Debe ingresar Usuario y Contraseña'
        });
    } else {
        // Ambos campos existen 
        // Datos que se envian al servidor
        var datos = new FormData();
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);

        // AJAX (4 pasos)
        // Paso 1. Crear el object AJAX

        var xhr = new XMLHttpRequest();

        // Paso 2. Abrir la conexión 
        xhr.open('POST', 'inc/modelos/modelo-admin.php', true);

        // Paso 3. Onload Retorno de Datos
        xhr.onload = function() {
            if (this.status === 200) {
                // console.log(JSON.parse(this.responseText));
                var respuesta = JSON.parse(xhr.responseText)
                console.log(respuesta);
                // Si la respuesta es correcta
                if (respuesta.respuesta === 'correcto') {
                    // si es un nuevo usuario
                    if (respuesta.tipo === 'crear') {
                        swal({
                            title: 'Usuario Creado',
                            text: 'Click en Ok para continuar',
                            type: 'success'
                        });
                    } else if (respuesta.tipo === 'login') {
                        // Loguear al usuario
                        swal({
                            title: 'Login Correcto',
                            text: 'Presiona OK para abrir el dashboard',
                            type: 'success'
                        }).then(resultado => {
                            if (resultado.value) {
                                window.location.href = 'index.php';
                            }
                        });
                    }
                } else {
                    swal({
                        title: 'Error',
                        text: 'Hubo un error',
                        type: 'error'
                    });
                }
            }
        }

        //Enviar Petición
        xhr.send(datos);
    }
}