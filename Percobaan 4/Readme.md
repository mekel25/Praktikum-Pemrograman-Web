Perkenalkan saya Michael Deffrans Cristian
Dari Kelompok PPW - D
--
Tugas Akhir percobaan judul 4 kali ini merupakan implementasi penggunaan PHP sebagai bahasa server-side scripting, manipulasi form, validasi, dan manajemen state menggunakan **PHP Session**.

---

## 🎯 Fitur Utama Aplikasi

Aplikasi ini adalah Sistem Manajemen Kontak Sederhana yang menyimpan data secara **sementara** menggunakan superglobal array `$_SESSION`. Data akan hilang ketika sesi browser berakhir atau server dihentikan.

### Struktur File

| File | Fungsi Utama | Deskripsi |
| :--- | :--- | :--- |
| **`index.php`** | **Tampilan Daftar (Read)** | Halaman utama yang menampilkan daftar semua kontak dalam format Card List. Berfungsi sebagai antarmuka utama dan menyediakan tautan aksi (Tambah, Edit, Hapus). |
| **`tambah.php`** | **Tambah Kontak (Create)** | Berisi Form HTML untuk input data kontak baru. Mengimplementasikan validasi dasar (`empty()` check) dan sanitasi input sebelum menyimpan data ke dalam `$_SESSION['kontak']`. |
| **`edit.php`** | **Ubah Kontak (Update)** | Memproses permintaan edit dari `index.php`. Memuat data kontak spesifik ke dalam form, memproses perubahan melalui POST, dan memperbarui data di `$_SESSION['kontak']` setelah validasi. |
| **`hapus.php`** | **Hapus Kontak (Delete)** | Berfungsi sebagai *endpoint* (titik akhir) untuk menghapus kontak. Mengambil ID kontak melalui parameter GET dan menghapusnya dari `$_SESSION['kontak']` menggunakan `unset()`, kemudian diarahkan kembali ke `index.php`. |

---
