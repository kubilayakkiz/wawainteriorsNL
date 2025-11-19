# Deployment Guide - GitHub & Vercel

Bu projeyi GitHub'a yükleyip Vercel'de deploy etmek için aşağıdaki adımları takip edin.

## 1. GitHub'a Yükleme

### Adım 1: GitHub'da Yeni Repository Oluşturun

1. GitHub.com'a gidin ve giriş yapın
2. Sağ üst köşedeki "+" butonuna tıklayın
3. "New repository" seçin
4. Repository adı: `wawainteriorsnl` (veya istediğiniz isim)
5. Description: "Wawa Interiors NL - Interior Design Website"
6. Public veya Private seçin
7. **"Initialize this repository with a README" seçeneğini İŞARETLEMEYİN**
8. "Create repository" butonuna tıklayın

### Adım 2: Projeyi GitHub'a Push Edin

Terminal'de şu komutları çalıştırın:

```bash
# Tüm dosyaları stage edin
git add .

# İlk commit yapın
git commit -m "Initial commit: Wawa Interiors NL website"

# GitHub repository URL'inizi ekleyin (kendi URL'inizi kullanın)
git remote add origin https://github.com/KULLANICI_ADINIZ/wawainteriorsnl.git

# Ana branch'i main olarak ayarlayın
git branch -M main

# GitHub'a push edin
git push -u origin main
```

**Not:** `KULLANICI_ADINIZ` yerine kendi GitHub kullanıcı adınızı yazın.

## 2. Vercel'de Deploy

### Adım 1: Vercel'e Giriş Yapın

1. https://vercel.com adresine gidin
2. "Sign Up" veya "Log In" yapın
3. GitHub hesabınızla giriş yapın (önerilir)

### Adım 2: Projeyi Import Edin

1. Vercel dashboard'da "Add New..." → "Project" seçin
2. GitHub repository'nizi seçin (`wawainteriorsnl`)
3. "Import" butonuna tıklayın

### Adım 3: Build Ayarları

Vercel otomatik olarak Next.js projesini algılayacak. Ayarlar şöyle olmalı:

- **Framework Preset:** Next.js
- **Root Directory:** `./` (boş bırakın)
- **Build Command:** `npm run build` (otomatik)
- **Output Directory:** `.next` (otomatik)
- **Install Command:** `npm install` (otomatik)

### Adım 4: Environment Variables (ÖNEMLİ!)

Vercel'de projenizi import ettikten sonra, **"Environment Variables"** bölümüne gidin ve şu değişkenleri ekleyin:

#### Gerekli Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://uokuwxhncxqahuudqoxt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=info@wawainteriors.nl
SMTP_PASSWORD=your_smtp_password_here
SMTP_FROM=info@wawainteriors.nl
SMTP_TO=info@kubilayakkiz.com,info@wawainteriors.nl
```

**Not:** 
- `your_anon_key_here` yerine Supabase Dashboard'dan aldığınız Anon Key'i yazın
- `your_service_role_key_here` yerine Supabase Dashboard'dan aldığınız Service Role Key'i yazın
- `your_smtp_password_here` yerine SMTP şifrenizi yazın (özel karakterler varsa tırnak içine almayın)

### Adım 5: Deploy

1. "Deploy" butonuna tıklayın
2. Build işlemi tamamlanana kadar bekleyin (2-3 dakika)
3. Deploy tamamlandığında bir URL alacaksınız (örn: `wawainteriorsnl.vercel.app`)

## 3. Custom Domain Ekleme (Opsiyonel)

### Adım 1: Domain Ayarları

1. Vercel dashboard'da projenize gidin
2. "Settings" → "Domains" sekmesine gidin
3. Domain'inizi ekleyin (örn: `wawainteriors.nl`)
4. Vercel size DNS kayıtlarını gösterecek

### Adım 2: DNS Ayarları

Domain sağlayıcınızın (hosting) DNS ayarlarına gidin ve Vercel'in verdiği kayıtları ekleyin:

- **A Record:** Vercel'in verdiği IP adresi
- **CNAME Record:** Vercel'in verdiği CNAME değeri

DNS değişikliklerinin yayılması 24-48 saat sürebilir.

## 4. Supabase Ayarları

### CORS Ayarları

Vercel domain'inizi Supabase'e eklemeniz gerekebilir:

1. Supabase Dashboard → Settings → API
2. "CORS" bölümüne Vercel URL'inizi ekleyin:
   - `https://wawainteriorsnl.vercel.app`
   - `https://www.wawainteriors.nl` (eğer custom domain kullanıyorsanız)

### Storage Bucket Ayarları

`quote-attachments` bucket'ının public olduğundan emin olun (zaten yaptınız).

## 5. Test

Deploy tamamlandıktan sonra:

1. Vercel URL'inizi ziyaret edin
2. Tüm sayfaların çalıştığını kontrol edin
3. Quote formunu test edin
4. Admin paneli test edin
5. Email gönderimini test edin

## Sorun Giderme

### Build Hatası

- Environment variables'ların doğru eklendiğinden emin olun
- `.env.local` dosyası Vercel'de kullanılamaz, environment variables kullanın

### Email Gönderim Hatası

- SMTP ayarlarını kontrol edin
- SMTP_PASSWORD'da özel karakterler varsa, Vercel'de tırnak içine almayın

### Supabase Bağlantı Hatası

- CORS ayarlarını kontrol edin
- Environment variables'ların doğru olduğundan emin olun

## İletişim

Sorun yaşarsanız, Vercel ve Supabase loglarını kontrol edin:
- Vercel: Dashboard → Deployments → Logs
- Supabase: Dashboard → Logs

