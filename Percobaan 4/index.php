<?php
session_start();

if (!isset($_SESSION['kontak'])) {
    $_SESSION['kontak'] = [];
}

// Ambil flash message
$flash = $_SESSION['flash'] ?? null;
unset($_SESSION['flash']);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Manajemen Kontak</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 20px; }
        .container { max-width: 1000px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

        .flash {
            padding: 12px;
            background: #d4edda;
            border-left: 5px solid #28a745;
            margin-bottom: 20px;
            border-radius: 5px;
            color: #155724;
        }

        h2 { color: #333; text-align: center; margin-bottom: 25px; border-bottom: 3px solid #007bff; display: inline-block; padding-bottom: 5px; }
        .header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }

        .add-link { padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .add-link:hover { background-color: #218838; }

        .contact-list { display: flex; flex-wrap: wrap; gap: 20px; margin-top: 30px; }
        .contact-card { background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; width: calc(33% - 20px); box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .contact-card:hover { transform: translateY(-5px); box-shadow: 0 6px 15px rgba(0,0,0,0.15); }

        .card-name { font-size: 1.4em; color: #007bff; margin-bottom: 10px; }
        .card-actions a { margin-right: 10px; text-decoration: none; font-weight: bold; }
        .edit-link { color: #ffc107; }
        .delete-link { color: #dc3545; }
    </style>
</head>
<body>

<div class="container">

    <?php if ($flash): ?>
        <div class="flash"><?php echo $flash; ?></div>
    <?php endif; ?>

    <div class="header-section">
        <h2>List Daftar Kontak (<?php echo count($_SESSION['kontak']); ?>)</h2>
        <a href="tambah.php" class="add-link">➕ Tambahkan Kontak Disini!!</a>
    </div>

    <div class="contact-list">
        <?php if (empty($_SESSION['kontak'])): ?>
            <p style="text-align:center; width:100%; color:#666;">Masih Kosong Nih.</p>
        <?php else: ?>
            <?php foreach ($_SESSION['kontak'] as $id => $k): ?>
                <div class="contact-card">
                    <div class="card-name"><?php echo htmlspecialchars($k['nama']); ?></div>
                    <p><strong>Telepon:</strong> <?php echo htmlspecialchars($k['telepon']); ?></p>
                    <p><strong>Email:</strong> <?php echo htmlspecialchars($k['email']); ?></p>

                    <div class="card-actions">
                        <a href="edit.php?id=<?php echo $id; ?>" class="edit-link">Edit</a> |
                        <a href="hapus.php?id=<?php echo $id; ?>" class="delete-link" onclick="return confirm('Hapus kontak ini?')">Hapus</a>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>

</div>
</body>
</html>