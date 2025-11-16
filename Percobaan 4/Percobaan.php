<?php
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>PHP Dasar</title>
</head>
<body>
    <h1><?php echo "Selamat Datang di PHP!"; ?></h1>
    
    <?php
    $nama = "John Doe";
    $umur = 25;
    $aktif = true;
    
    echo "<h2>Informasi User:</h2>";
    echo "Nama: " . $nama . "<br>";
    echo "Umur: " . $umur . " tahun<br>";
    echo "Status: " . ($aktif ? "Aktif" : "Tidak Aktif");
    ?>
    
    <h3>Tanggal dan Waktu:</h3>
    <?php
    echo "Hari ini: " . date("d-m-Y H:i:s");
    ?>
</body>
</html>