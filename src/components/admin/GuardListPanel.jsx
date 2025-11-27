import React from 'react';

const GuardListPanel = ({ guards, highlightedGuardId }) => {
    return (
        <div className="panel right-col">
            <div className="panel-head">
                <span className="panel-title">Deployed Teams</span>
                <span style={{ color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer' }}>+ Add Team</span>
            </div>
            <div className="guard-list" id="guard-list">
                {guards.map(g => {
                    const color = g.status === 'Available' ? '#10b981' : '#ef4444';
                    return (
                        <div
                            key={g.id}
                            className={`guard-card ${highlightedGuardId === g.id ? 'highlight' : ''}`}
                            id={`guard-card-${g.id}`}
                        >
                            <div className="guard-header">
                                <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{g.name}</span>
                                <span style={{ fontSize: '0.75rem', color: color, fontWeight: 600 }}>
                                    <span className="status-dot" style={{ background: color }}></span>{g.status}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                                <span>📍 {g.lat.toFixed(4)}, {g.lon.toFixed(4)}</span>
                                <span>{g.dist === 'Calculating...' ? '' : g.dist}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GuardListPanel;
