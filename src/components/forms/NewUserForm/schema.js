// Validation Schema for NewUserForm

// Imports
import * as Yup from "yup";

// Initial form values
export const initialFormValues = {
  id: "",
  name: "",
  username: "",
  email: "",
  phone: "",
  companyName: "",
};

// Validation Schema
export const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Ad Soyad en az 3 karakter olmalıdır")
    .max(50, "Ad Soyad en fazla 50 karakter olmalıdır")
    .matches(
      /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/,
      "Ad Soyad sadece harf ve boşluk içerebilir"
    )
    .required("Ad Soyad zorunludur"),
  username: Yup.string()
    .min(3, "Kullanıcı adı en az 3 karakter olmalıdır")
    .max(20, "Kullanıcı adı en fazla 20 karakter olmalıdır")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir"
    )
    .required("Kullanıcı adı zorunludur"),
  email: Yup.string()
    .email("Geçersiz e-posta formatı")
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Lütfen geçerli bir e-posta adresi girin"
    )
    .required("E-posta zorunludur"),
  phone: Yup.string()
    .min(10, "Telefon numarası en az 10 karakter olmalıdır")
    .required("Telefon numarası zorunludur"),
  companyName: Yup.string()
    .min(2, "Şirket adı en az 2 karakter olmalıdır")
    .required("Şirket adı zorunludur"),
});

// User object structure template
export const createUserObject = (formValues, id) => ({
  id,
  name: formValues.name,
  username: formValues.username,
  email: formValues.email,
  phone: formValues.phone,
  website: "",
  address: {
    street: "",
    suite: "",
    city: "",
    zipcode: "",
    geo: {
      lat: "",
      lng: "",
    },
  },
  company: {
    name: formValues.companyName,
    catchPhrase: "",
    bs: "",
  },
});
