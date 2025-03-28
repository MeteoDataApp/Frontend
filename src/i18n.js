import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enJSON from "./locale/en.json";
import cnJSON from "./locale/cn.json";

i18n.use(initReactI18next).init({
    resources: {
        en: { ...enJSON },
        cn: { ...cnJSON },
    },
    lng: localStorage.getItem("i18nextLng") || "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});