# Bucket'ı Public Yapma Talimatları

## Sorun
`quote-attachments` bucket'ı şu anda private. Bu yüzden signed URL'ler alıyorsunuz ve bu URL'ler expire oluyor.

## Çözüm: Bucket'ı Public Yapmak

1. **Supabase Dashboard'a gidin**
   - https://supabase.com/dashboard
   - Projenizi seçin

2. **Storage'a gidin**
   - Sol menüden "Storage" seçin
   - "Buckets" sekmesine tıklayın

3. **quote-attachments bucket'ını bulun**
   - Bucket listesinde "quote-attachments" bucket'ını bulun

4. **Bucket ayarlarını açın**
   - Bucket'ın yanındaki "..." (üç nokta) menüsüne tıklayın
   - "Edit bucket" seçeneğine tıklayın

5. **Public yapın**
   - "Public bucket" seçeneğini işaretleyin (checkbox)
   - "Save" butonuna tıklayın

## Alternatif: Storage Policies ile Public Erişim

Eğer bucket'ı tamamen public yapmak istemiyorsanız, RLS policies ile public read erişimi verebilirsiniz:

```sql
-- Storage bucket için public read policy
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT
USING (bucket_id = 'quote-attachments');
```

Bu SQL'i Supabase SQL Editor'de çalıştırabilirsiniz.

## Bucket Public Yapıldıktan Sonra

Bucket public yapıldıktan sonra, yeni quote'lar için attachment URL'leri otomatik olarak doğru şekilde kaydedilecek.

**Not:** Mevcut quote'lardaki signed URL'ler expire olacak. Bu quote'ları admin panelden düzenleyip yeni public URL'lerle güncelleyebilirsiniz.

