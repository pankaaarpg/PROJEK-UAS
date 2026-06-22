# 🌐 EL - Garden

> Aplikasi monitoring perangkat IoT berbasis web secara real-time.


---

## 📋 Deskripsi

**EL - Garden** adalah aplikasi web yang dikembangkan sebagai **Proyek UAS (Ujian Akhir Semester)** untuk memonitor perangkat IoT (*Internet of Things*) secara real-time. Aplikasi ini memungkinkan pengguna untuk memantau data sensor, status perangkat, dan visualisasi data dari berbagai perangkat IoT yang terhubung melalui dashboard yang intuitif.

---

## ✨ Fitur Utama

- 📊 **Dashboard Real-time** — Tampilan data sensor yang diperbarui secara langsung
- 📡 **Pemantauan Perangkat** — Monitoring status dan konektivitas perangkat IoT
- 📈 **Visualisasi Data** — Grafik dan chart untuk analisis data sensor
- 🔔 **Notifikasi & Alert** — Pemberitahuan ketika nilai sensor melewati batas yang ditentukan
- 🗂️ **Manajemen Perangkat** — Tambah, edit, dan hapus perangkat IoT
- 🔒 **Autentikasi Pengguna** — Sistem login untuk keamanan akses data

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Keterangan |
|-----------|------------|
| **TypeScript** | Bahasa pemrograman utama |
| **JavaScript** | Scripting pendukung |
| **Node.js** | Runtime environment |
| **React / Next.js** | Framework frontend |
| **MQTT / WebSocket** | Protokol komunikasi IoT |
| **Tailwind CSS** | Styling UI |

---

## 🚀 Cara Menjalankan Proyek

### Prasyarat

Pastikan sudah terinstall:
- [Node.js](https://nodejs.org/) (versi 18 atau lebih baru)
- [npm](https://www.npmjs.com/) atau [yarn](https://yarnpkg.com/)
- Git

### Langkah Instalasi

1. **Clone repository ini**
   ```bash
   git clone https://github.com/pankaaarpg/PROJEK-UAS.git
   cd PROJEK-UAS
   ```

2. **Masuk ke direktori aplikasi**
   ```bash
   cd iot-monitoring-app
   ```

3. **Install dependencies**
   ```bash
   npm install
   # atau
   yarn install
   ```

4. **Konfigurasi environment**
   ```bash
   cp .env.example .env
   # Edit file .env sesuai konfigurasi lokal Anda
   ```

5. **Jalankan aplikasi**
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

6. **Buka di browser**
   ```
   http://localhost:3000
   ```

---

## 📁 Struktur Proyek

```
PROJEK-UAS/
└── iot-monitoring-app/
    ├── src/
    │   ├── components/     # Komponen UI yang dapat digunakan ulang
    │   ├── pages/          # Halaman aplikasi
    │   ├── hooks/          # Custom React hooks
    │   ├── services/       # Layanan API dan komunikasi IoT
    │   ├── types/          # Type definitions TypeScript
    │   └── utils/          # Fungsi utilitas
    ├── public/             # Aset statis
    ├── package.json
    ├── tsconfig.json
    └── README.md
```

---

## 👥 Tim Pengembang

Proyek ini dikembangkan oleh mahasiswa sebagai bagian dari **Ujian Akhir Semester**.

| No | Nama | NIM |
|----|------|-----|
| 1 | **Kinan Radistya Oktavio** | 0923040030 |
| 2 | **Moch Raditya Putradiyasyah** | 0923040034 |
| 3 | **Devanka Alfahdiya Ivandika** | 0923040039 |

---

## 🤝 Kontribusi

Proyek ini merupakan tugas akademik. Namun jika ingin berkontribusi:

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b fitur/NamaFitur`)
3. Commit perubahan (`git commit -m 'Menambahkan fitur X'`)
4. Push ke branch (`git push origin fitur/NamaFitur`)
5. Buat Pull Request

---

## 📄 Lisensi

Didistribusikan di bawah **MIT License**. Lihat file `LICENSE` untuk informasi lebih lanjut.

---

<p align="center">
  Dibuat dengan ❤️ oleh Tim PROJEK-UAS &bull; 2025
</p>
