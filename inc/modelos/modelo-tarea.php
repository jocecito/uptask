<?php 

$accion = $_POST['accion'];
if(isset($_POST['tarea'])) {$tarea = $_POST['tarea'];}
if(isset($_POST['id_proyecto'])){$id_proyecto = (int) $_POST['id_proyecto'];}
if(isset($_POST['estado'])){$estado = (int) $_POST['estado'];}
if(isset($_POST['id_tarea'])){$id_tarea = $_POST['id_tarea'];}

if ($accion === 'crear') {
    // Codigo para crear los proyectos
    // Importar la conexión 
    include '../funciones/conexion.php';

    try {
        // Realizar consulta a la base de datos
        $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?,?) ");
        $stmt->bind_param('si', $tarea, $id_proyecto);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion,
                'nombre_tarea' => $tarea,
                'id_proyecto' => $id_proyecto
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

if($accion === 'actualizar') {
    // Codigo para crear los proyectos
    // Importar la conexión 
    include '../funciones/conexion.php';

    try {
        // Realizar consulta a la base de datos
        $stmt = $conn->prepare("UPDATE tareas SET estado = ? WHERE id = ? ");
        $stmt->bind_param('ii', $estado, $id_tarea);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'tipo' => $accion,
                'estado' => $estado,
                'id_tarea' => $id_tarea
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

if($accion === 'eliminar') {
    // Codigo para crear los proyectos
    // Importar la conexión 
    include '../funciones/conexion.php';

    try {
        // Realizar consulta a la base de datos
        $stmt = $conn->prepare("DELETE from tareas WHERE id = ? ");
        $stmt->bind_param('i', $id_tarea);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'tipo' => $accion,
                'id_tarea' => $id_tarea
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


