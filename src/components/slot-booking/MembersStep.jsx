import React from 'react';
import { Plus } from 'lucide-react';
import MemberCard from './MemberCard';

const MembersStep = ({ isActive, members, onAddMember, onRemoveMember, onUpdateMember, onVerifyAadhaar }) => {
    if (!isActive) return null;

    return (
        <div id="step-2" className="step-content p-6 md:p-10 animate-slide-up flex-grow">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-navy-900 font-serif">
                        Add Devotees
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Enter details & Aadhaar for verification.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onAddMember}
                    className="text-xs bg-orange-50 text-orange-700 px-3 py-2 rounded-lg font-bold hover:bg-orange-100 border border-orange-200 flex items-center gap-1 transition"
                >
                    <Plus className="w-4 h-4" /> Add
                </button>
            </div>

            <div
                id="membersContainer"
                className="space-y-6 max-h-[400px] overflow-y-auto pr-2 pb-4"
            >
                {members.map((member, index) => (
                    <MemberCard
                        key={member.id}
                        member={member}
                        index={index}
                        onRemove={onRemoveMember}
                        onUpdate={onUpdateMember}
                        onVerify={onVerifyAadhaar}
                    />
                ))}
            </div>
        </div>
    );
};

export default MembersStep;
