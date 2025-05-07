import { createI18n, I18nOptions } from "vue-i18n";
import en from "@/Localization/en/en.json";
import en_form from "@/Localization/en/en_form.json";
import ar_form from "@/Localization/ar/ar_form.json";
import ar from "@/Localization/ar/ar.json";

const messages: any = {
  en: {
    ...en,
    ...en_form,
  },
  ar:{
    ...ar,
    ...ar_form,
  }, 
};
 
const options:  I18nOptions = {
   legacy: true,
  globalInjection: true,
  locale: localStorage.getItem("locale") || "en",
  fallbackLocale: "en",
  messages,
};

const i18n = createI18n(options);

export default i18n;
