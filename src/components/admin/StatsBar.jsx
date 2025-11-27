import React from 'react';

const StatsBar = () => {
    return (
        <div className="stats-bar">
            <div className="stat-card">
                <div className="stat-label">Live Head Count</div>
                <div className="stat-val">12,450</div>
            </div>
            <div className="stat-card">
                <div className="stat-label">App Registered</div>
                <div className="stat-val">4,102</div>
            </div>
            <div className="stat-card">
                <div className="stat-label">Window Users</div>
                <div className="stat-val">842</div>
            </div>
            <div className="stat-card">
                <div className="stat-label">Alerts Active</div>
                <div className="stat-val" style={{ color: 'var(--red)' }}>03</div>
            </div>
        </div>
    );
};

export default StatsBar;
