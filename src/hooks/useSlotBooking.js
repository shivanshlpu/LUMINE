import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useSlotBooking = () => {
    // const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [temple, setTemple] = useState('');
    const [date, setDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [members, setMembers] = useState([
        { id: 1, name: '', age: '', gender: '', mobile: '', email: '', blood_group: '', aadhaar: '', verified: false }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const totalSteps = 3;

    const handleTempleChange = (e) => setTemple(e.target.value);
    const handleDateChange = (e) => setDate(e.target.value);
    const handleTimeChange = (e) => setTimeSlot(e.target.value);

    const addMember = () => {
        const newId = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1;
        setMembers([...members, {
            id: newId,
            name: '', age: '', gender: '', mobile: '', email: '', blood_group: '', aadhaar: '', verified: false
        }]);
    };

    const removeMember = (id) => {
        setMembers(members.filter(m => m.id !== id));
    };

    const updateMember = (id, field, value) => {
        setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m));
    };

    const verifyAadhaar = (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                setMembers(members.map(m => m.id === id ? { ...m, verified: true } : m));
                resolve(true);
            }, 1500);
        });
    };

    const validateStep1 = () => {
        if (!temple || !date || !timeSlot) {
            alert("Please select Temple, Date, and Time.");
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        let isValid = true;
        members.forEach(m => {
            if (!m.name || !m.mobile || !m.email) {
                isValid = false;
            }
        });

        if (!isValid) {
            alert("Please fill Name, Mobile, and Email for all members.");
            return false;
        }
        return true;
    };

    const nextStep = () => {
        if (currentStep === 1 && !validateStep1()) return;
        if (currentStep === 2 && !validateStep2()) return;

        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const submitBooking = () => {
        setIsSubmitting(true);

        setTimeout(() => {
            const finalMembers = members.map(m => {
                const tempId = "LUM-" + Math.floor(1000 + Math.random() * 9000);
                const tempPass = Math.random().toString(36).slice(-8);

                if (m.email) {
                    console.log(`[Server Log] Sending Email to: ${m.email}`);
                    console.log(`[Email Content] Dear ${m.name}, your booking is confirmed. ID: ${tempId}, Pass: ${tempPass}`);
                }

                return {
                    name: m.name,
                    age: m.age,
                    gender: m.gender,
                    mobile: m.mobile,
                    email: m.email,
                    blood_group: m.blood_group || "N/A",
                    aadhaar_mask: "XXXX-" + (m.aadhaar.slice(-4) || "0000"),
                    login_id: tempId,
                    login_pass: tempPass
                };
            });

            const bookingData = {
                booking_id: "BK-" + Math.floor(100000 + Math.random() * 900000),
                temple: temple,
                date: date,
                time_slot: timeSlot,
                members: finalMembers,
                timestamp: new Date().toISOString()
            };

            localStorage.setItem('lumine_active_booking', JSON.stringify(bookingData));

            setIsSubmitting(false);
            setShowSuccess(true);
        }, 2000);
    };

    return {
        currentStep,
        totalSteps,
        temple,
        date,
        timeSlot,
        members,
        isSubmitting,
        showSuccess,
        handleTempleChange,
        handleDateChange,
        handleTimeChange,
        addMember,
        removeMember,
        updateMember,
        verifyAadhaar,
        nextStep,
        prevStep,
        submitBooking
    };
};

export default useSlotBooking;
