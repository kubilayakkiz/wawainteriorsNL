# Resim Kullanım Kılavuzu

## Klasör Yapısı

```
public/images/
├── hero/          # Ana sayfa hero slider görselleri
├── services/      # Hizmetler sayfası görselleri
├── projects/      # Projeler sayfası görselleri
├── blog/          # Blog yazıları görselleri
├── about/         # Hakkımızda sayfası görselleri
└── team/          # Takım görselleri
```

## Resim Yükleme

1. Resimlerinizi ilgili klasöre kopyalayın
2. Resim isimlerinde boşluk yerine tire (-) veya alt çizgi (_) kullanın
3. Önerilen formatlar: `.jpg`, `.jpeg`, `.png`, `.webp`
4. Önerilen boyutlar:
   - Hero görselleri: 1200x800px
   - Servis görselleri: 800x600px
   - Proje görselleri: 800x600px
   - Blog görselleri: 800x600px

## Kodda Kullanım

### Örnek 1: Ana Sayfa Hero Slider
```tsx
// app/[locale]/page.tsx içinde
const slides = [
  {
    title: 'Modern Interior Design Excellence',
    image: '/images/hero/slide-1.jpg', // public klasöründen başlar
  },
];
```

### Örnek 2: Servisler Sayfası
```tsx
// app/[locale]/services/page.tsx içinde
const services = [
  {
    id: 'residential',
    image: '/images/services/residential.jpg',
  },
];
```

### Örnek 3: Projeler Sayfası
```tsx
// app/[locale]/projects/page.tsx içinde
const projects = [
  {
    id: 1,
    image: '/images/projects/project-1.jpg',
  },
];
```

## Notlar

- `public` klasöründeki dosyalar doğrudan erişilebilir
- URL'ler `/images/...` şeklinde başlar (public klasörü root olarak kabul edilir)
- Next.js Image component kullanıldığında otomatik optimizasyon yapılır
- Resimler optimize edilmiş boyutlarda olmalı (performans için)





