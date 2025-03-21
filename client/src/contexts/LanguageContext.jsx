/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [isChinese, setIsChinese] = useState(false);

    const toggleLanguage = () => {
        setIsChinese(!isChinese);
    };

    return (
        <LanguageContext.Provider value={{ isChinese, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};