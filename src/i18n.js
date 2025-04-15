import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enJSON from "./locale/en.json";
import cnJSON from "./locale/cn.json";

i18n.use(initReactI18next).init({
    resources: {
        cn: { ...cnJSON },
        en: { ...enJSON }
    },
    lng: localStorage.getItem("i18nextLng") || "cn",
    fallbackLng: "cn",
    interpolation: {
        escapeValue: false,
    },
});