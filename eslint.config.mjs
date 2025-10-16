import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    // Dosyaları ESLint kontrolünden hariç tut
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    // Kullanılmayan kod temizleme kuralları
    rules: {
      // KULLANILMAYAN DEĞİŞKENLER VE İMPORTLAR
      // Kullanılmayan değişkenleri tespit et ve hata ver
      "no-unused-vars": [
        "error",
        {
          // Fonksiyon parametrelerini kontrol et
          args: "after-used",
          // Destructuring'de kullanılmayan değişkenleri göz ardı et
          ignoreRestSiblings: true,
          // _ ile başlayan değişkenleri göz ardı et (geçici değişkenler için)
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          // Catch bloklarındaki hata parametrelerini göz ardı et
          caughtErrors: "none",
        },
      ],

      // KULLANILMAYAN FONKSİYONLAR VE TANIMLAR
      // Tanımlanmış ancak kullanılmayan fonksiyonları tespit et
      "no-unused-expressions": [
        "error",
        {
          // Kısa devre değerlendirmelerine izin ver (a && b())
          allowShortCircuit: true,
          // Ternary operatörlerine izin ver (a ? b() : c())
          allowTernary: true,
          // Tagged template literallerine izin ver
          allowTaggedTemplates: true,
        },
      ],

      // KULLANILMAYAN KOD BLOKLARI
      // Erişilemeyen kod bloklarını tespit et
      "no-unreachable": "error",

      // Kullanılmayan label'ları tespit et
      "no-unused-labels": "error",

      // Gereksiz return statement'ları tespit et
      "no-useless-return": "error",

      // CONSOLE VE DEBUG KODLARI
      // Production'da console.log'ları uyar
      "no-console": "warn",

      // Debugger statement'larını yasakla
      "no-debugger": "error",

      // Alert, confirm, prompt kullanımını uyar
      "no-alert": "warn",

      // GEREKSIZ KOD YAPILARI
      // Gereksiz else bloklarını tespit et
      "no-else-return": [
        "error",
        {
          allowElseIf: false,
        },
      ],

      // Gereksiz boolean cast'lerini tespit et
      "no-extra-boolean-cast": "error",

      // İMPORT/EXPORT KONTROLÜ
      // Duplicate import'ları tespit et
      "no-duplicate-imports": "error",

      // PERFORMANS VE OPTİMİZASYON
      // Gereksiz computed property key'leri tespit et
      "no-useless-computed-key": "error",

      // Gereksiz constructor'ları tespit et
      "no-useless-constructor": "error",

      // Gereksiz rename'leri tespit et
      "no-useless-rename": "error",

      // React Hooks kurallarını devre dışı bırak
      "react-hooks/exhaustive-deps": "off",
    },
  },
];

export default eslintConfig;
