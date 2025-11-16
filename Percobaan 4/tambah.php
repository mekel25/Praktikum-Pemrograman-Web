<?php
session_start();

$errors = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nama = trim($_POST['nama'] ?? '');
    $telepon = trim($_POST['telepon'] ?? '');
    $email = trim($_POST['email'] ?? '');

    if (empty($nama)) $errors[] = "Nama wajib diisi.";
    if (empty($telepon)) $errors[] = "Nomor telepon wajib diisi.";
    if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Format email tidak valid.";
    }

    if (empty($errors)) {
        $_SESSION['kontak'][time()] = [
            "nama" => htmlspecialchars($nama),
            "telepon" => htmlspecialchars($telepon),
            "email" => htmlspecialchars($email)
        ];
        header("Location: index.php?msg=success");
        exit();
    }
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Tambah Kontak</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body {
            background: linear-gradient(135deg, #6a85f1, #b98cff);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: "Segoe UI", sans-serif;
        }

        .card-custom {
            width: 480px;
            border-radius: 18px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
            border: none;
        }

        .btn-primary {
            background-color: #4c6ef5;
            border: none;
        }

        .btn-primary:hover {
            background-color: #3b5bdb;
        }

        .btn-secondary {
            background-color: #adb5bd;
            border: none;
        }

        .btn-back {
            background-color: #ffffff;
            color: #4c6ef5;
            border: 2px solid #4c6ef5;
            font-weight: 600;
        }

        .btn-back:hover {
            background-color: #4c6ef5;
            color: white;
        }
    </style>
</head>

<body>

<div class="card card-custom p-4">
    
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="m-0 text-center w-100 fw-bold text-primary">Tambah Kontak Baru</h4>
    </div>

    <!-- Tombol kembali -->
    <a href="index.php" class="btn btn-back mb-3 w-25">
        ← Kembali
    </a>

    <?php if (!empty($errors)): ?>
        <div class="alert alert-danger">
            <ul class="mb-0">
                <?php foreach ($errors as $e): ?>
                    <li><?= $e ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>

    <form action="" method="POST">

        <div class="mb-3">
            <label class="form-label">Nama Lengkap*</label>
            <input type="text" class="form-control" name="nama" required>
        </div>

        <div class="mb-3">
            <label class="form-label">Nomor Telepon*</label>
            <input type="text" class="form-control" name="telepon" required>
        </div>

        <div class="mb-3">
            <label class="form-label">Email (Tidak wajib)</label>
            <input type="email" class="form-control" name="email">
        </div>

        <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-primary px-4">Simpan</button>
            <button type="reset" class="btn btn-secondary px-4">Reset</button>
        </div>

    </form>
</div>

</body>
</html>