<?php 

function obtenerPaginaActual() {
    $archivo = basename($_SERVER['PHP_SELF']);
    $pagina = str_replace(".php", "", $archivo);
    return $pagina;
}

function debuguear($var) {
    echo "<pre>";
    var_dump($var);
    echo "</pre>";
    exit;
}

/** Consultas **/

/** Obtener todos los proyectos **/
function obtenerProyectos() {
    include 'conexion.php';
    try {
        return $conn->query('SELECT id, nombre FROM proyectos');
    } catch(Exception $e) {
        echo "Error! : " . $e->getMessage();
        return false;
    }
}

/** Obtener el nombre del proyecto **/
function obtenerNombreProyecto($id_proyecto = null) {
    include 'conexion.php';
    try {
        return $conn->query("SELECT nombre FROM proyectos WHERE id = {$id_proyecto}");
    } catch(Exception $e) {
        echo "Error! : " . $e->getMessage();
        return false;
    }
}

// Obtener las Tareas
function obtenerTareasProyecto($id = null) {
    include 'conexion.php';
    try {
        return $conn->query("SELECT id, nombre, estado FROM tareas WHERE id_proyecto = {$id}");
    } catch(Exception $e) {
        echo "Error! : " . $e->getMessage();
        return false;
    }
}
?>