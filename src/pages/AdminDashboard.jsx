import React, { useState, useRef } from 'react';
import '../styles/admin.css';
import AdminHeader from '../components/admin/AdminHeader';
import StatsBar from '../components/admin/StatsBar';
import HeatmapPanel from '../components/admin/HeatmapPanel';
import AlertsMapPanel from '../components/admin/AlertsMapPanel';
import AlertDetailPanel from '../components/admin/AlertDetailPanel';
import LaneControlPanel from '../components/admin/LaneControlPanel';
import GuardListPanel from '../components/admin/GuardListPanel';
import Toast from '../components/admin/Toast';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


const INITIAL_GUARDS = [
    { id: 'g1', name: 'Team Alpha', status: 'Available', lat: 20.8885, lon: 70.4005, dist: 'Calculating...' },
    { id: 'g2', name: 'Team Beta', status: 'Busy', lat: 20.8870, lon: 70.4020, dist: 'Calculating...' },
    { id: 'g3', name: 'Team Gamma', status: 'Available', lat: 20.8890, lon: 70.4015, dist: 'Calculating...' },
];

const INITIAL_ALERTS = [
    { id: 1, type: 'Crowd High Density', icon: '👥', loc: 'Gate 2', lat: 20.8882, lon: 70.4008, desc: 'Camera #42 detected > 100 people queue.' },
    { id: 2, type: 'Medical Assistance', icon: '🚑', loc: 'Queue Complex', lat: 20.8875, lon: 70.4012, desc: 'Devotee SOS: Fainting reported.' },
    { id: 3, type: 'Lost Child', icon: '👶', loc: 'Shoe Counter', lat: 20.8888, lon: 70.4002, desc: 'Blue shirt, 5 years old.' }
];

const AdminDashboard = () => {
    const [guards, setGuards] = useState(INITIAL_GUARDS);
    const [alerts] = useState(INITIAL_ALERTS);
    const [activeAlert, setActiveAlert] = useState(null);
    const [highlightedGuardId, setHighlightedGuardId] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '' });
    const mapInstanceRef = useRef(null);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "/";
        }
    };

    const handleAlertClick = (alert) => {
        setActiveAlert(alert);
        if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([alert.lat, alert.lon], 21, {
                animate: true,
                duration: 1.5
            });
        }
    };

    const handleCloseAlert = () => {
        setActiveAlert(null);
    };

    const handleAssignGuard = () => {
        if (!activeAlert) return;

        let nearest = null;
        let minDist = Infinity;

        guards.forEach(g => {
            if (g.status === 'Available') {
                const d = Math.sqrt(Math.pow(g.lat - activeAlert.lat, 2) + Math.pow(g.lon - activeAlert.lon, 2));
                if (d < minDist) {
                    minDist = d;
                    nearest = g;
                }
            }
        });

        if (nearest) {

            if (mapInstanceRef.current) {
                const path = [[nearest.lat, nearest.lon], [activeAlert.lat, activeAlert.lon]];
                L.polyline(path, { color: 'var(--navy)', dashArray: '5, 10', weight: 3 }).addTo(mapInstanceRef.current);
            }

            setHighlightedGuardId(nearest.id);
            setToast({ show: true, message: `✅ ${nearest.name} dispatched to ${activeAlert.loc}` });


            setGuards(prev => prev.map(g => g.id === nearest.id ? { ...g, status: 'Busy' } : g));

        } else {
            alert("No available guard teams nearby!");
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg-body)' }}>
            <AdminHeader onLogout={handleLogout} />
            <StatsBar />

            <main className="main-layout">
                <HeatmapPanel />

                <div className="center-col">
                    <div style={{ flex: 2, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                        <AlertsMapPanel
                            alerts={alerts}
                            guards={guards}
                            onAlertClick={handleAlertClick}
                            activeAlertId={activeAlert?.id}
                            onMapReady={(map) => mapInstanceRef.current = map}
                        />
                        <AlertDetailPanel
                            activeAlert={activeAlert}
                            onClose={handleCloseAlert}
                            onAssign={handleAssignGuard}
                        />
                    </div>

                    <LaneControlPanel />
                </div>

                <GuardListPanel guards={guards} highlightedGuardId={highlightedGuardId} />
            </main>

            <Toast
                message={toast.message}
                show={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};

export default AdminDashboard;
