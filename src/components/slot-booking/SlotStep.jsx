import React from 'react';
import { Calendar, Clock, Building2 } from 'lucide-react';

const SlotStep = ({ isActive, temple, date, timeSlot, onTempleChange, onDateChange, onTimeChange }) => {
    if (!isActive) return null;

    return (
        <div id="step-1" className="step-content p-6 md:p-10 animate-slide-up flex-grow">
            <h2 className="text-2xl font-bold text-navy-900 mb-2 font-serif">
                Select Darshan Slot
            </h2>
            <p className="text-gray-500 text-sm mb-8">
                Choose a convenient date and time for your visit.
            </p>

            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                        Select Temple
                    </label>
                    <div className="relative">
                        <select
                            id="templeSelect"
                            className="lumine-input pl-10"
                            value={temple}
                            onChange={onTempleChange}
                        >
                            <option value="">-- Select Temple --</option>
                            <option value="Somnath Temple">Somnath Temple</option>
                            <option value="Dwarika Temple">Dwarika Temple</option>
                            <option value="Ambaji Temple">Ambaji Temple</option>
                        </select>
                        <Building2 className="w-5 h-5 text-orange-600 absolute left-3 top-3" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                        Darshan Date
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            id="dateInput"
                            className="lumine-input pl-10"
                            value={date}
                            onChange={onDateChange}
                        />
                        <Calendar className="w-5 h-5 text-orange-600 absolute left-3 top-3" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                        Time Slot
                    </label>
                    <div className="relative">
                        <select
                            id="timeSlot"
                            className="lumine-input pl-10 disabled:opacity-60"
                            disabled={!date}
                            value={timeSlot}
                            onChange={onTimeChange}
                        >
                            <option value="">-- Select Date First --</option>
                            <option value="06:00 AM - 08:00 AM">
                                Morning Aarti (06:00 - 08:00)
                            </option>
                            <option value="09:00 AM - 12:00 PM">
                                Mid-Morning (09:00 - 12:00)
                            </option>
                            <option value="04:00 PM - 06:00 PM">
                                Evening Darshan (16:00 - 18:00)
                            </option>
                            <option value="07:00 PM - 08:00 PM">
                                Evening Aarti (19:00 - 20:00)
                            </option>
                        </select>
                        <Clock className="w-5 h-5 text-orange-600 absolute left-3 top-3" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlotStep;
