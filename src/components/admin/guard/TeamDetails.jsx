import React, { useState } from 'react';

const TeamDetails = ({ team, onUpdateStatus, onAssign, onToggleRest, onLocate, onRemove, onSendMessage }) => {
    const [message, setMessage] = useState('');

    if (!team) return <div className="col-right"><div className="panel-body">Select a team</div></div>;

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <div className="col-right" id="detail-panel">
            <div className="panel-header">
                <h2 className="detail-name">{team.name}</h2>
                <select
                    className="detail-status-select"
                    value={team.status}
                    onChange={(e) => onUpdateStatus(team.id, e.target.value)}
                >
                    <option value="Active">Active (Patrolling)</option>
                    <option value="Busy">Busy (On Task)</option>
                    <option value="Rest">On Rest</option>
                    <option value="Free">Free (Standby)</option>
                </select>
                <div className="stats-grid">
                    <div className="stat-box">
                        <span className="stat-num">{team.tasksToday}</span>
                        <span className="stat-lbl">Tasks Today</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-num">{team.tasksTotal}</span>
                        <span className="stat-lbl">Lifetime</span>
                    </div>
                </div>
            </div>

            <div className="panel-body">
                <h5 className="section-title">Members</h5>
                <ul className="member-list">
                    {team.members.map((m, idx) => (
                        <li key={idx} className="member-item">
                            <div className="member-avatar">{m.name.charAt(0)}</div>
                            <div className="member-info">
                                <h5>{m.name}</h5>
                                <span>{m.role} • <span style={{ color: 'var(--status-active)' }}>Online</span></span>
                            </div>
                        </li>
                    ))}
                </ul>

                <h5 className="section-title">Message Team</h5>
                <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Radio command..."
                        style={{ flex: 1, padding: '8px', border: 'var(--border)', borderRadius: '6px', fontSize: '0.8rem' }}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                        onClick={handleSend}
                        style={{ background: 'var(--navy)', color: 'white', border: 'none', padding: '0 12px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>

                <div className="action-grid">
                    <button className="action-btn" onClick={() => onAssign(team.id)}>
                        <i className="fas fa-clipboard-check" style={{ color: 'var(--primary)' }}></i> Assign Job
                    </button>
                    <button className="action-btn" onClick={() => onToggleRest(team.id)}>
                        <i className="fas fa-coffee" style={{ color: 'var(--text-muted)' }}></i> Toggle Rest
                    </button>
                    <button className="action-btn" onClick={() => onLocate(team.id)}>
                        <i className="fas fa-crosshairs" style={{ color: 'var(--status-free)' }}></i> Locate
                    </button>
                    <button className="action-btn danger" onClick={() => onRemove(team.id)}>
                        <i className="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeamDetails;
