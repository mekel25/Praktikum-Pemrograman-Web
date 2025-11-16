<?php
session_start();

$id = $_GET['id'] ?? null;

if (!$id || !isset($_SESSION['kontak'][$id])) {
    header("Location: index.php");
    exit();
}

$kontak = $_SESSION['kontak'][$id];
$errors = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $nama = trim($_POST['nama']);
    $telepon = trim($_POST['telepon']);
    $email = trim($_POST['email']);

    if ($nama === '') $errors[] = "Nama wajib diisi.";
    if ($telepon === '') $errors[] = "Nomor telepon wajib diisi.";
    if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Email tidak valid.";

    if (empty($errors)) {

        $_SESSION['kontak'][$id] = [
            'nama' => htmlspecialchars($nama),
            'telepon' => htmlspecialchars($telepon),
            'email' => htmlspecialchars($email)
        ];

        $_SESSION['flash'] = "Kontak <strong>$nama</strong> berhasil diperbarui!";
        header("Location: index.php");
        exit();
    }
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Edit Kontak</title>
<style>
    body { font-family: sans-serif; background:#f4f7f6; padding:20px; }
    .box { max-width:500px; background:white; padding:25px; margin:20px auto; border-radius:8px;
           box-shadow:0 4px 12px rgba(0,0,0,0.1); }

    .form-group { margin-bottom:15px; }
    input[type="text"], input[type="email"] {
        width:100%; padding:10px; border-radius:5px; border:1px solid #ccc;
    }

    .btn { padding:10px 16px; border:none; border-radius:5px; cursor:pointer; font-weight:bold; }
    .btn-save { background:#ffc107; color:black; }

    .back { text-decoration:none; }
    .error-box { background:#f8d7da; padding:10px; border-left:4px solid #dc3545; margin-bottom:15px; border-radius:5px; }
</style>
</head>
<body>

<div class="box">
    <a href="index.php" class="back">← Kembali</a>

    <h2 style="text-align:center;color:#333;">Edit Kontak</h2>

    <?php if (!empty($errors)): ?>
        <div class="error-box">
            <?php foreach ($errors as $e): ?>
                • <?php echo $e; ?><br>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

    <form method="POST">
        <div class="form-group">
            <label>Nama Lengkap*</label>
            <input type="text" name="nama" value="<?php echo htmlspecialchars($kontak['nama']); ?>">
        </div>

        <div class="form-group">
            <label>Nomor Telepon*</label>
            <input type="text" name="telepon" value="<?php echo htmlspecialchars($kontak['telepon']); ?>">
        </div>

        <div class="form-group">
            <label>Email</label>
            <input type="email" name="email" value="<?php echo htmlspecialchars($kontak['email']); ?>">
        </div>

        <button type="submit" class="btn btn-save">Simpan Perubahan</button>
    </form>
</div>

</body>
</html>
