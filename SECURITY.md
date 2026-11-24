# Kebijakan Keamanan (Security Policy)

## Melaporkan Kerentanan Keamanan

Jika Anda menemukan celah keamanan, tautan rusak/mencurigakan, atau masalah privasi pada halaman resmi **Pesantren Boarding School Al-Wafa Setu**, mohon jangan membukanya sebagai issue publik. Silakan laporkan langsung ke:

- **Email:** humasalwafa@gmail.com

Sertakan informasi berikut dalam laporan Anda:
1. Deskripsi singkat masalah keamanan yang ditemukan.
2. Langkah-langkah reproduksi (jika ada).
3. Dampak potensial atau saran perbaikan.

## Perlindungan Keamanan yang Diterapkan

- **Content Security Policy (CSP)** ketat (`default-src 'none'`, tanpa inline script/style, sumber font & aset dibatasi ketat).
- **Referrer Policy** `no-referrer` untuk melindungi privasi pengunjung.
- **Perlindungan Reverse Tabnabbing** (`rel="noopener noreferrer"`) pada seluruh tautan eksternal.
- **Zero `innerHTML` / DOM XSS Hardening** pada skrip JavaScript serta validasi protokol `https:` pada fitur salin tautan.
- **Metadata gambar (EXIF/IPTC)** dibersihkan dari aset statis.
