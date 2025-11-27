import React, { createContext, useState, useContext } from 'react';

const TRANSLATIONS = {
    en: {
        welcomeMain: "Welcome —",
        welcomeSub: "स्वागत है",
        heroSubtitle: "Seva, Darshan & Management — one dashboard for the entire mandir ecosystem.",
        card1Title: "Devotee Services",
        card1Desc: "Book poojas & donate instantly.",
        card2Title: "Secure Access",
        card2Desc: "Role-based gates for staff.",
        signIn: "Sign In",
        labelUserId: "User ID / Email",
        labelPassword: "Password",
        rememberMe: "Remember me",
        forgotPass: "Forgot password?",
        loginBtn: "Secure Login",
        newHere: "New here?",
        registerLink: "Register as Devotee"
    },
    hi: {
        welcomeMain: "स्वागत है —",
        welcomeSub: "Welcome",
        heroSubtitle: "सेवा, दर्शन और प्रबंधन — पूरे मंदिर पारिस्थितिकी तंत्र के लिए एक डैशबोर्ड।",
        card1Title: "भक्त सेवाएँ",
        card1Desc: "पूजा बुक करें और तुरंत दान करें।",
        card2Title: "सुरक्षित प्रवेश",
        card2Desc: "कर्मचारियों के लिए भूमिका-आधारित लॉगिन।",
        signIn: "लॉग इन करें",
        labelUserId: "यूज़र आईडी / ईमेल",
        labelPassword: "पासवर्ड",
        rememberMe: "मुझे याद रखें",
        forgotPass: "पासवर्ड भूल गए?",
        loginBtn: "सुरक्षित लॉगिन",
        newHere: "नए हैं?",
        registerLink: "भक्त के रूप में पंजीकरण करें"
    }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    const t = (key) => {
        return TRANSLATIONS[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => useContext(LanguageContext);
