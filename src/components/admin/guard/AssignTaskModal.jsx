import React, { useState } from 'react';

const AssignTaskModal = ({ isOpen, onClose, onConfirm, teamName, isNearest }) => {
    const [jobType, setJobType] = useState('Crowd Control');
    const [note, setNote] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(jobType, note);
        setNote('');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h3 style={{ fontFamily: "'Laila', serif", color: 'var(--navy)', marginBottom: '15px' }}>Assign New Job</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '15px' }}>
                    {isNearest
                        ? `📍 Location Selected. Assigning nearest team: ${teamName}`
                        : `Assigning new task to ${teamName}`
                    }
                </p>

                <label style={{ fontSize: '0.75rem', fontWeight: '600', display: 'block', marginBottom: '5px' }}>Job Type</label>
                <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: 'var(--border)', borderRadius: '8px', marginBottom: '15px' }}
                >
                    <option value="Crowd Control">Crowd Control (High Density)</option>
                    <option value="Queue Check">Queue Check</option>
                    <option value="Medical Assist">Medical Assist</option>
                    <option value="Lost Child">Lost Child Search</option>
                    <option value="VIP Escort">VIP Escort</option>
                </select>

                <label style={{ fontSize: '0.75rem', fontWeight: '600', display: 'block', marginBottom: '5px' }}>Instructions (Optional)</label>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows="3"
                    style={{ width: '100%', padding: '10px', border: 'var(--border)', borderRadius: '8px', marginBottom: '20px' }}
                ></textarea>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '10px', background: 'var(--gray-200)', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={handleConfirm} style={{ flex: 1, padding: '10px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Dispatch</button>
                </div>
            </div>
        </div>
    );
};

export default AssignTaskModal;
