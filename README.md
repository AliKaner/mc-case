# User Management Dashboard

Bu proje, kullanıcıların listelenmesi, filtrelenmesi ve düzenlenmesini sağlayan bir **Next.js 14+ (App Router)** tabanlı yönetim panelidir.  
Case projesi kapsamında modern frontend prensipleri (React Query, Debounce, Responsive tasarım, State management) uygulanmıştır.

## Zamanım Olsa Eklemek İsteyeceğim Şeyler

Daha kaliteli, merkezi bir API istek yapısı
Kendi backend servisimin entegrasyonu
Çoklu dil desteği (i18n)
Tema / renk yönetimi sistemi (dark-light mod + renk varyantları)
Auth ve role-based access control sistemi

**Canlı Proje Linki:** [https://mc-case-um1l.vercel.app/](https://mc-case-um1l.vercel.app/)  
 **Kişisel Web Sitem:** [https://alikaner.com](https://alikaner.com)

---

## Amaç

- Next.js App Router yapısını etkin şekilde kullanmak
- API’den alınan kullanıcı verilerini kart ve tablo görünümünde listelemek
- Debounce’lu arama ile performanslı filtreleme sağlamak
- Reusable component mimarisi ile sürdürülebilir kod yazmak
- Responsive bir kullanıcı deneyimi oluşturmak

---

## Kullanılan Teknolojiler

- **Next.js 14 (App Router)** – modern routing yapısı
- **React Query** – veri yönetimi ve caching
- **Formik + Yup** – form yönetimi ve doğrulama
- **SCSS Modules** – component bazlı stillendirme
- **Custom Hooks (useDebounce, useModal)** – tekrar kullanılabilir mantık
- **Lucide React** – sade ikon seti

---

## Kurulum

```bash
git clone https://github.com/alikaner/frontend-case.git
cd frontend-case
npm install
npm run dev
```

Ardından tarayıcıdan http://localhost:3000 adresine gidin.

## Klasör yapısı

Klasör yapısı için kendi Medium yazımdan esinlendim.
**Yazı Linki:** [https://medium.com/@alikaner.dev/organizing-next-js-project-folder-structure-b87f1e10f844](https://medium.com/@alikaner.dev/organizing-next-js-project-folder-structure-b87f1e10f844)

src/
┣ app/
┃ ┣ users/
┃ ┣ new/
┃ ┗ layout.tsx
┣ components/
┃ ┣ common/
┃ ┣ forms/
┃ ┗ modals/
┣ hooks/
┣ services/
┣ constants/
┣ styles/
┗ utils/

Her modül kendi index.tsx ve module.scss dosyalarıyla birlikte gelir. Aynı zamanda da Componentlerin her biri yine kendi Medium yazım olan yapı ile yazılmıştır.
**Yazı Linki:** [https://medium.com/@alikaner.dev/coding-perfect-component-870d6920ee2b](https://medium.com/@alikaner.dev/coding-perfect-component-870d6920ee2b)
