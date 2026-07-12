1. Proje Özeti:
Şirketlerin personel verilerini, izinlerini ve genel durumlarını yönetebileceği, modern, hızlı ve responsive bir web arayüzü.

2. Temel Modüller (MVP - Minimum Viable Product):

Kimlik Doğrulama (Auth): Giriş, çıkış, şifre sıfırlama (Admin ve Çalışan rolleri).

Dashboard (Özet Ekranı): Toplam çalışan sayısı, onay bekleyen izinler, yaklaşan doğum günleri/resmi tatiller (Grafiksel gösterimler eklenebilir).

Personel Yönetimi:

Çalışan listeleme (Arama, filtreleme, sayfalama).

Yeni çalışan ekleme / düzenleme / silme (CRUD işlemleri).

Çalışan detay sayfası (Kişisel bilgiler, departman, maaş vb.).

İzin Yönetimi: İzin talebi oluşturma, geçmiş izinleri görüntüleme, admin için onay/red mekanizması.

3. Teknik Gereksinimler:

Framework: Vue 3 (Composition API & <script setup> syntax).

State Management: Pinia (Kullanıcı oturumu, personel listesi önbelleği için).

HTTP İstemcisi: Axios (Backend istekleri ve interceptor'lar üzerinden token yönetimi).

UI / Stil: PrimeVue (DataTable, Dialog, Toast, Card vb.) ve PrimeFlex (Grid sistemi ve margin/padding ayarları için).duction

```sh
npm run build
```
