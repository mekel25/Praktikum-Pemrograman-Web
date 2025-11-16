<?php
session_start();

$id = $_GET['id'] ?? null;

if ($id && isset($_SESSION['kontak'][$id])) {

    $nama = $_SESSION['kontak'][$id]['nama'] ?? 'Kontak';

    unset($_SESSION['kontak'][$id]);

    $_SESSION['flash'] = "Kontak <strong>$nama</strong> berhasil dihapus!";
}

header("Location: index.php");
exit();
?>