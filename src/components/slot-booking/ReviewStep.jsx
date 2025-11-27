import React from 'react';
import { Info } from 'lucide-react';

const ReviewStep = ({ isActive, temple, date, timeSlot, memberCount }) => {
    if (!isActive) return null;

    return (
        <div id="step-3" className="step-content p-6 md:p-10 animate-slide-up flex-grow">
            <h2 className="text-2xl font-bold text-navy-900 mb-6 font-serif text-center">
                Review Booking
            </h2>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-6 max-w-sm mx-auto">
                <div className="flex justify-between mb-3 pb-3 border-b border-gray-200">
                    <span className="text-gray-500 text-sm">Temple</span>
                    <span className="font-bold text-navy-900" id="reviewTemple">
                        {temple || '--'}
                    </span>
                </div>
                <div className="flex justify-between mb-3 pb-3 border-b border-gray-200">
                    <span className="text-gray-500 text-sm">Date</span>
                    <span className="font-bold text-navy-900" id="reviewDate">
                        {date || '--'}
                    </span>
                </div>
                <div className="flex justify-between mb-3 pb-3 border-b border-gray-200">
                    <span className="text-gray-500 text-sm">Time Slot</span>
                    <span className="font-bold text-orange-600" id="reviewTime">
                        {timeSlot || '--'}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Total Members</span>
                    <span className="font-bold text-navy-900" id="reviewCount">
                        {memberCount} Person(s)
                    </span>
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-xs text-blue-800 leading-relaxed">
                    Booking details, ID, and Password will be sent to the provided{' '}
                    <b>Email IDs</b>. Please verify all contact details.
                </p>
            </div>
        </div>
    );
};

export default ReviewStep;
