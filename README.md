# Attendance BE

Repository ini adalah sebuah monorepo yang terdiri atas 3 microservice:

- Service Auth
- Service Karyawan
- Service Absensi

Masing-masing service memiliki database sendiri.

## Cara Menjalankan

### Prerequisite

- Pastikan Docker dan Docker Compose sudah terinstall

### Langkah-langkah

1. Clone repository ini
2. Masuk ke folder attendance-be

```bash
cd attendance-be
```

3. Copy .env.example ke file .env

```bash
cp .env.example .env
```

4. Pada file `.env`, isi environment variable yang kosong dan ganti password pada DB connection URL sesuai password yang ditentukan

```
Contoh:
ATTENDANCE_DB_PASSWORD=attendance_db_pass
...

ATTENDANCE_DB_URL=mysql://attendance_svc:attendance_db_pass@mysql:3306/attendance_db
```

5. Start Docker Compose

```bash
docker compose up -d
```

### Detail Compose

- Backend API akan tersedia pada `http://localhost:8080/api`.

- Ketiga microservice berada di belakang sebuah NGINX server sebagai simple API Gateway
