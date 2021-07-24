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

?>