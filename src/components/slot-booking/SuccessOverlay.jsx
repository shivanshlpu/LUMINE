import React from 'react';
import { Link } from 'react-router-dom';
import { Check, LayoutGrid } from 'lucide-react';

const SuccessOverlay = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <div
            id="successMessage"
            className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center animate-slide-up"
        >
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-green-100 rounded-full blur-xl opacity-70"></div>
                <div className="relative w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                    <Check className="w-12 h-12" />
                </div>
            </div>
            <h2 className="text-3xl font-bold text-navy-900 mb-2 font-serif">
                Booking Confirmed!
            </h2>
            <p className="text-gray-500 mt-2 mb-2 max-w-xs mx-auto">
                Your slot has been reserved.
            </p>
            <p className="text-orange-600 text-xs font-semibold mb-8">
                📧 Email with Login ID sent to registered email(s).
            </p>

            <Link
                to="/dashboard"
                className="bg-navy-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-navy-800 transition shadow-lg flex items-center gap-2"
            >
                <LayoutGrid className="w-4 h-4" /> Go to Dashboard
            </Link>
        </div>
    );
};

export default SuccessOverlay;
