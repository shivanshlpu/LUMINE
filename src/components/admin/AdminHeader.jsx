import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminHeader = ({ onLogout }) => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? 'nav-pill active' : 'nav-pill';

    return (
        <header className="top-header">
            <div className="brand-area">
                <div className="brand-icon">🏛️</div>
                <div className="brand-text">
                    <h2>Lumine</h2>
                    <span>Somnath Mandir</span>
                </div>
            </div>

            <div className="nav-pills">
                <Link to="/admin/dashboard" className={isActive('/admin/dashboard')}>Dashboard</Link>
                <Link to="/admin/heatmap" className={isActive('/admin/heatmap')}>Live Heatmap</Link>
                <Link to="/admin/guard" className={isActive('/admin/guard')}>Guard Teams</Link>
                <Link to="/admin/lane" className={isActive('/admin/lane')}>Lane Control</Link>
                <Link to="#" className="nav-pill">Settings</Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '35px', height: '35px', background: 'var(--primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>
                    A
                </div>
                <button onClick={onLogout} className="logout-btn">Logout ↪</button>
            </div>
        </header>
    );
};

export default AdminHeader;
