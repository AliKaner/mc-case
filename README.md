# User Management Dashboard

Bu proje, kullanıcıların listelenmesi, filtrelenmesi ve düzenlenmesini sağlayan bir **Next.js 14+ (App Router)** tabanlı yönetim panelidir.  
Case projesi kapsamında modern frontend prensipleri (React Query, Debounce, Responsive tasarım, State management) uygulanmıştır.

## Zamanım Olsa Eklemek İsteyeceğim Şeyler

Daha kaliteli, merkezi bir API istek yapısı
Kendi backend servisimin entegrasyonu
Çoklu dil desteği (i18n)
Tema / renk yönetimi sistemi (dark-light mod + renk varyantları)
Auth ve role-based access control sistemi

## Yaşadığım Zorluklar

Genel olarak gerçek bir backend yapısı olmadığı için localstorage'a bağlı birazcık daha spagetti bir yapı yazmam gerekti bu da genel olarak eventleri kontrol etme konusunda biraz sorun yarattı ayrıca Uzun zamandır TS kullandığım için JS bir proje yazarken biraz afalladım.

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
**Yazı Linki:** [Organizing Next.js Project Folder Structure](https://medium.com/@alikaner.dev/organizing-next-js-project-folder-structure-b87f1e10f844)

```
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
```

Her modül kendi `index.tsx` ve `module.scss` dosyalarıyla birlikte gelir.  
Ayrıca component yapısı da kendi Medium yazımda açıkladığım yapıyı takip eder.  
**Yazı Linki:** [Coding Perfect Component Structure](https://medium.com/@alikaner.dev/coding-perfect-component-870d6920ee2b)

# Görseller:

## Linkler:

### Twitter Link:
<img width="439" height="235" alt="image" src="https://github.com/user-attachments/assets/75b691a2-3621-46ab-8259-6d6626ef4fad" />

### WhatsApp Link:
<img width="776" height="96" alt="image" src="https://github.com/user-attachments/assets/c980cb37-cfae-4e99-a7aa-bb77a5f6a800" />

## Featurelar

### Kullanıcı Listeleme
<img width="1188" height="689" alt="image" src="https://github.com/user-attachments/assets/eddc613e-48f1-45a7-b3e9-d80250d2dc7e" />
<img width="1309" height="698" alt="image" src="https://github.com/user-attachments/assets/a42a8470-c075-4ada-b1c2-947f1a15e336" />
<img width="1157" height="307" alt="image" src="https://github.com/user-attachments/assets/03ee4227-f4e1-4b23-ab4e-f449aa58abd2" />
<img width="336" height="218" alt="image" src="https://github.com/user-attachments/assets/9f8599c1-67a5-4845-b8c6-38daf43dc83d" />
<img width="323" height="179" alt="image" src="https://github.com/user-attachments/assets/2c9025b5-2242-4a9e-8cb5-11cbe2952bde" />
<img width="469" height="243" alt="image" src="https://github.com/user-attachments/assets/14950329-6a80-49c7-9053-f6fd320620ca" />
<img width="769" height="198" alt="image" src="https://github.com/user-attachments/assets/2e26c1d9-6ecb-4546-8dc0-2b796f12007b" />

### Mobil:
<img width="403" height="643" alt="image" src="https://github.com/user-attachments/assets/e302c05a-82ec-47a9-8a05-b03a26a79de5" />
<img width="462" height="259" alt="image" src="https://github.com/user-attachments/assets/c7b8df2e-e26f-491d-85e1-909154b58071" />
<img width="544" height="454" alt="image" src="https://github.com/user-attachments/assets/0fd1f35e-b277-4d7c-9fe2-06782038abb0" />

context: Table yana doğru scroll olabiliyor.

### Kullanıcı Detayı
<img width="730" height="761" alt="image" src="https://github.com/user-attachments/assets/5abb3cda-6e8d-4875-a5ad-8da3f398779b" />
<img width="527" height="744" alt="image" src="https://github.com/user-attachments/assets/ab3317f1-5b70-413b-a1db-f2e14e8a31d6" />
<img width="1016" height="254" alt="image" src="https://github.com/user-attachments/assets/ee346c3b-0070-41a5-819b-769a9e42f26b" />

### Kullanıcı Ekleme
<img width="573" height="675" alt="image" src="https://github.com/user-attachments/assets/b80cc80f-d2e3-4db8-8c76-b47480b116f4" />
<img width="576" height="123" alt="image" src="https://github.com/user-attachments/assets/a646e6f0-6536-4c77-893e-80bb49b2f039" />
<img width="317" height="221" alt="image" src="https://github.com/user-attachments/assets/4a17b81c-1a89-43eb-8e7e-7080528bee63" />
<img width="536" height="92" alt="image" src="https://github.com/user-attachments/assets/761d5a26-f583-4e5c-a4e5-6bab38a380c2" />
<img width="534" height="97" alt="image" src="https://github.com/user-attachments/assets/6e1757c1-d823-4b24-8d20-8e70508cdea1" />
<img width="569" height="86" alt="image" src="https://github.com/user-attachments/assets/7c419d05-f79b-4d00-9cb3-1b549cca08ef" />
<img width="514" height="84" alt="image" src="https://github.com/user-attachments/assets/b53fedf4-3a60-4461-8877-ca31316ceb88" />
<img width="507" height="89" alt="image" src="https://github.com/user-attachments/assets/63f4ff16-f638-4b95-8e63-67296dd5924b" />
<img width="591" height="644" alt="image" src="https://github.com/user-attachments/assets/2c5e696b-d742-42a0-94ff-31aaa4fa75e7" />
<img width="787" height="244" alt="image" src="https://github.com/user-attachments/assets/7834e9f9-116d-48e7-abd1-3be57ab01b50" />


### Kullanıcı Silme
<img width="486" height="295" alt="image" src="https://github.com/user-attachments/assets/1b28be1b-20ce-4d02-85b7-0683573f5d8f" />
<img width="955" height="163" alt="image" src="https://github.com/user-attachments/assets/8fbb73c5-3b06-4358-8c04-bcc7aff36002" />








