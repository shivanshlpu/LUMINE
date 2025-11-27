export const ROLES = {
    devotee: {
        id: 'devotee',
        icon: 'HandsPraying', // String name for Phosphor component lookup
        redirect: 'dashboard.html',
        en: { label: 'Devotee', helper: "Login with phone or email to book darshan slot.", placeholder: "Phone number or Email" },
        hi: { label: 'भक्त', helper: "सेवा बुक के लिए फोन या ईमेल से लॉगिन करें।", placeholder: "फ़ोन नंबर या ईमेल" }
    },
    mandir_admin: {
        id: 'mandir_admin',
        icon: 'Crown',
        redirect: 'admindashboard.html',
        en: { label: 'Admin', helper: "Admin login for temple operations and reports.", placeholder: "Admin Username" },
        hi: { label: 'प्रशासक', helper: "मंदिर संचालन और रिपोर्ट के लिए एडमिन लॉगिन।", placeholder: "एडमिन यूज़रनेम" }
    },

    security_guard: {
        id: 'security_guard',
        icon: 'ShieldStar',
        redirect: '/guard/dashboard',
        en: { label: 'Security', helper: "Badge ID login for entry/exit logs and gate controls.", placeholder: "Badge ID (e.g. SEC-001)" },
        hi: { label: 'सुरक्षा', helper: "प्रवेश/निकास लॉग और गेट नियंत्रण के लिए बैज आईडी लॉगिन।", placeholder: "बैज आईडी (जैसे SEC-001)" }
    },
    parking_incharge: {
        id: 'parking_incharge',
        icon: 'Car',
        redirect: 'parking.html',
        en: { label: 'Parking', helper: "Login to manage parking slots and vehicle entries.", placeholder: "Employee ID" },
        hi: { label: 'पार्किंग', helper: "पार्किंग स्लॉट और वाहन प्रविष्टियों को प्रबंधित करने के लिए लॉगिन करें।", placeholder: "कर्मचारी आईडी" }
    }
};
