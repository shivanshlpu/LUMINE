import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    const TRANSLATIONS = {
        en: {
            // Header & Common
            welcomeMain: "Welcome —",
            welcomeSub: "Seva & Management",
            heroSubtitle: "Seva, Darshan & Management — one dashboard for the entire mandir ecosystem.",
            signIn: "Sign In",
            labelUserId: "User ID / Email",
            labelPassword: "Password",
            rememberMe: "Remember me",
            forgotPass: "Forgot password?",
            loginBtn: "Secure Login",
            newHere: "New here?",
            registerLink: "Register as Devotee",
            logout: "Logout",
            support: "Support",

            // Sidebar
            navDashboard: "Dashboard",
            navSlotBooking: "Slot Booking",
            navMyVisits: "My Visits",
            navLaneStatus: "Lane Status",
            navAdminNotices: "Admin Notices",
            navDevoteeQr: "Devotee QR ID",
            navEmergency: "Emergency Help (SOS)",

            // Dashboard
            namaste: "Namaste,",
            dashboardSubtitle: "Manage your darshan bookings and profile.",
            today: "Today",
            primaryDevotee: "Primary Devotee",

            // Cards
            card1Title: "Devotee Services",
            card1Desc: "Book poojas & donate instantly.",
            card2Title: "Secure Access",
            card2Desc: "Role-based gates for staff.",

            // Admin
            adminDashboard: "Dashboard",
            adminHeatmap: "Live Heatmap",
            adminGuard: "Guard Teams",
            adminLane: "Lane Control",
            adminSettings: "Settings"
        },
        hi: {
            // Header & Common
            welcomeMain: "स्वागत है —",
            welcomeSub: "सेवा और प्रबंधन",
            heroSubtitle: "सेवा, दर्शन और प्रबंधन — पूरे मंदिर पारिस्थितिकी तंत्र के लिए एक डैशबोर्ड।",
            signIn: "लॉग इन करें",
            labelUserId: "यूज़र आईडी / ईमेल",
            labelPassword: "पासवर्ड",
            rememberMe: "मुझे याद रखें",
            forgotPass: "पासवर्ड भूल गए?",
            loginBtn: "सुरक्षित लॉगिन",
            newHere: "नए हैं?",
            registerLink: "भक्त के रूप में पंजीकरण करें",
            logout: "लॉग आउट",
            support: "सहायता",

            // Sidebar
            navDashboard: "डैशबोर्ड",
            navSlotBooking: "स्लॉट बुकिंग",
            navMyVisits: "मेरी यात्राएँ",
            navLaneStatus: "लेन स्थिति",
            navAdminNotices: "प्रशासनिक सूचनाएं",
            navDevoteeQr: "भक्त क्यूआर आईडी",
            navEmergency: "आपातकालीन सहायता (SOS)",

            // Dashboard
            namaste: "नमस्ते,",
            dashboardSubtitle: "अपनी दर्शन बुकिंग और प्रोफ़ाइल प्रबंधित करें।",
            today: "आज",
            primaryDevotee: "मुख्य भक्त",

            // Cards
            card1Title: "भक्त सेवाएँ",
            card1Desc: "पूजा बुक करें और तुरंत दान करें।",
            card2Title: "सुरक्षित प्रवेश",
            card2Desc: "कर्मचारियों के लिए भूमिका-आधारित लॉगिन।",

            // Admin
            adminDashboard: "डैशबोर्ड",
            adminHeatmap: "लाइव हीटमैप",
            adminGuard: "गार्ड टीमें",
            adminLane: "लेन नियंत्रण",
            adminSettings: "सेटिंग्स"
        }
    };

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
