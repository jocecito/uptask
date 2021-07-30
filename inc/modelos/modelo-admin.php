<?php

$accion = $_POST['accion'];
$password = $_POST['password'];
$usuario = $_POST['usuario'];

if ($accion === 'crear') {
    // Codigo para crear los administradores

    // Hashear Passwords
    $opciones = array(
        'cost' => 10
    );
    $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);

    // Importar la conexión 
    include '../funciones/conexion.php';

    try {
        // Realizar consulta a la base de datos
        $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?) ");
        $stmt->bind_param('ss', $usuario, $hash_password);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion
            );
        } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}

if ($accion === 'login') {
    // primero importar la conexión 
    include '../funciones/conexion.php';

    try {
        // Seleccionar el administrador de la base de datos
        $stmt = $conn->prepare("SELECT * FROM usuarios WHERE usuario = ?");
        $stmt->bind_param('s', $usuario);
        $stmt->execute();
        // Loguear el usuario
        $stmt->bind_result($id_usuario, $nombre_usuario, $pass_usuario);
        $stmt->fetch();
        if ($nombre_usuario) {
            // El usuario existe: Verificar password.
            if(password_verify($password, $pass_usuario)) {
                // Creo la session 
                session_start();
                $_SESSION['usuario'] = $nombre_usuario;
                $_SESSION['id'] = $id_usuario;
                $_SESSION['login'] = true;
                // Login Correcto
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'nombre' => $nombre_usuario,
                    'tipo' => $accion
                );
            } else {
                // Login Incorrecto. Enviar Error
                $respuesta = array(
                    'respuesta' => 'Password Incorrecto'
                );
            }
            
        } else {
            $respuesta = array(
                'error' => 'Usuario no existe'
            );
        }
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}
