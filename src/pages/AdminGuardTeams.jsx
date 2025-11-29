import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import AdminHeader from '../components/admin/AdminHeader';
import TeamList from '../components/admin/guard/TeamList';
import TeamDetails from '../components/admin/guard/TeamDetails';
import GuardMap from '../components/admin/guard/GuardMap';
import AssignTaskModal from '../components/admin/guard/AssignTaskModal';
import Toast from '../components/admin/Toast';
import '../styles/admin.css';
import '../styles/admin-guard.css';

const INITIAL_TEAMS = [
    {
        id: 't1', name: 'Team Alpha', status: 'Active', color: 'var(--status-active)',
        loc: [20.8885, 70.4015],
        lastUpdate: 'Now', tasksToday: 12, tasksTotal: 145,
        members: [{ name: 'Ramesh Singh', role: 'Lead' }, { name: 'Suresh K.', role: 'Guard' }]
    },
    {
        id: 't2', name: 'Team Beta', status: 'Busy', color: 'var(--status-busy)',
        loc: [20.8878, 70.4008],
        lastUpdate: '1m ago', tasksToday: 8, tasksTotal: 92,
        members: [{ name: 'Vikram R.', role: 'Lead' }, { name: 'Amit P.', role: 'Guard' }]
    },
    {
        id: 't3', name: 'Team Gamma', status: 'Free', color: 'var(--status-free)',
        loc: [20.8882, 70.4020],
        lastUpdate: '5m ago', tasksToday: 2, tasksTotal: 34,
        members: [{ name: 'Deepak S.', role: 'Lead' }, { name: 'Rahul T.', role: 'Guard' }]
    },
    {
        id: 't4', name: 'Team Delta', status: 'Rest', color: 'var(--status-rest)',
        loc: [20.8890, 70.4000],
        lastUpdate: '10m ago', tasksToday: 5, tasksTotal: 110,
        members: [{ name: 'Arjun M.', role: 'Lead' }]
    },
    {
        id: 't5', name: 'Team Echo', status: 'Offline', color: 'var(--status-offline)',
        loc: [20.8870, 70.4030],
        lastUpdate: '1h ago', tasksToday: 0, tasksTotal: 22,
        members: [{ name: 'Karan J.', role: 'Lead' }]
    }
];

const AdminGuardTeams = () => {
    const [teams, setTeams] = useState(INITIAL_TEAMS);
    const [selectedTeamId, setSelectedTeamId] = useState(INITIAL_TEAMS[0].id);
    const [toast, setToast] = useState({ show: false, message: '', isError: false });
    const [modal, setModal] = useState({ isOpen: false, isNearest: false });
    const [clickTargetLoc, setClickTargetLoc] = useState(null);


    useEffect(() => {
        const interval = setInterval(() => {
            setTeams(prev => prev.map(t => {
                if (t.status === 'Active' || t.status === 'Busy') {
                    const newLoc = [
                        t.loc[0] + (Math.random() - 0.5) * 0.0001,
                        t.loc[1] + (Math.random() - 0.5) * 0.0001
                    ];
                    return { ...t, loc: newLoc };
                }
                return t;
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const showToast = (msg, isError = false) => {
        setToast({ show: true, message: msg, isError });
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "/";
        }
    };

    const handleMapClick = (latlng) => {
        setClickTargetLoc(latlng);

        let nearest = null;
        let minDist = Infinity;

        teams.forEach(t => {
            if (t.status === 'Active' || t.status === 'Free') {
                const dist = Math.sqrt(Math.pow(t.loc[0] - latlng.lat, 2) + Math.pow(t.loc[1] - latlng.lng, 2));
                if (dist < minDist) {
                    minDist = dist;
                    nearest = t;
                }
            }
        });

        if (nearest) {
            setSelectedTeamId(nearest.id);
            setModal({ isOpen: true, isNearest: true });
        } else {
            showToast('No available teams nearby!', true);
        }
    };

    const handleAssignConfirm = (jobType) => {
        setTeams(prev => prev.map(t => {
            if (t.id === selectedTeamId) {
                return {
                    ...t,
                    status: 'Busy',
                    tasksToday: t.tasksToday + 1,
                    tasksTotal: t.tasksTotal + 1
                };
            }
            return t;
        }));

        const team = teams.find(t => t.id === selectedTeamId);
        showToast(`${team.name} dispatched for ${jobType}`);
        setModal({ isOpen: false, isNearest: false });
        setClickTargetLoc(null);
    };

    const handleUpdateStatus = (id, status) => {
        setTeams(prev => prev.map(t => t.id === id ? { ...t, status } : t));
        showToast(`Status updated to ${status}`);
    };

    const handleToggleRest = (id) => {
        const team = teams.find(t => t.id === id);
        const newStatus = team.status === 'Rest' ? 'Active' : 'Rest';
        handleUpdateStatus(id, newStatus);
        showToast(newStatus === 'Rest' ? `${team.name} is now resting` : `${team.name} back to duty`);
    };

    const handleSendMessage = (msg) => {
        showToast(`Message sent: "${msg}"`);
    };

    const selectedTeam = teams.find(t => t.id === selectedTeamId);

    return (
        <div className="bg-lumine-bg text-gray-800 overflow-hidden h-screen flex flex-col">
            <AdminHeader onLogout={handleLogout} />

            <div className="guard-layout">
                <TeamList
                    teams={teams}
                    selectedTeamId={selectedTeamId}
                    onSelectTeam={setSelectedTeamId}
                    onAddTeam={() => showToast('Feature coming soon')}
                />

                <GuardMap
                    teams={teams}
                    selectedTeamId={selectedTeamId}
                    onMapClick={handleMapClick}
                    onMarkerClick={setSelectedTeamId}
                    clickTargetLoc={clickTargetLoc}
                />

                <TeamDetails
                    team={selectedTeam}
                    onUpdateStatus={handleUpdateStatus}
                    onAssign={() => setModal({ isOpen: true, isNearest: false })}
                    onToggleRest={handleToggleRest}
                    onLocate={() => showToast('Locating team on map...')}
                    onRemove={() => showToast('Feature coming soon', true)}
                    onSendMessage={handleSendMessage}
                />
            </div>

            <AssignTaskModal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                onConfirm={handleAssignConfirm}
                teamName={selectedTeam?.name}
                isNearest={modal.isNearest}
            />

            <Toast
                message={toast.message}
                show={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};

export default AdminGuardTeams;
