import React, { useState, useEffect } from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import LaneCard from '../components/admin/lane/LaneCard';
import LiveCamModal from '../components/admin/lane/LiveCamModal';
import GuardAssignModal from '../components/admin/lane/GuardAssignModal';
import Toast from '../components/admin/Toast';
import '../styles/admin.css';
import '../styles/admin-lane.css';

const AdminLaneControl = () => {
    const [lanesData, setLanesData] = useState([]);
    const [totalCapacity, setTotalCapacity] = useState(0);
    const [toast, setToast] = useState({ show: false, message: '', isError: false });
    const [activeCamLane, setActiveCamLane] = useState(null);
    const [activeGuardLane, setActiveGuardLane] = useState(null);


    useEffect(() => {
        const initialData = Array.from({ length: 8 }, (_, i) => ({
            id: i + 1,
            name: `Lane ${i + 1}`,
            camId: `CAM-0${i + 1}`,
            location: { lat: 20.8880 + (i * 0.0001), lng: 70.4010 + (i * 0.0001) },
            rawHeadCount: 250 + Math.floor(Math.random() * 250),
            capacity: 300,
            throughput: 12 + Math.floor(Math.random() * 10),
            lastMove: Date.now(),
            status: 'OPEN',
            manualOverride: false,
            temp: 30 + Math.floor(Math.random() * 5),
            humidity: 60 + Math.floor(Math.random() * 15),
            history: Array(15).fill(10).map(() => Math.floor(Math.random() * 20)),
            isJammed: false
        }));
        setLanesData(initialData);
    }, []);


    useEffect(() => {
        const interval = setInterval(() => {
            setLanesData(prevLanes => {
                let newTotal = 0;
                const newLanes = prevLanes.map(lane => {
                    const newLane = { ...lane, history: [...lane.history] };

                    if (newLane.status === 'CLOSED') {
                        if (newLane.rawHeadCount > 0) newLane.rawHeadCount -= Math.floor(Math.random() * 5);
                        newLane.throughput = 0;
                    } else {
                        const change = Math.floor(Math.random() * 25) - 10;
                        if (newLane.id === 3 && newLane.isJammed) {
                            newLane.rawHeadCount += 15;
                            newLane.throughput = 0;
                            if ((newLane.rawHeadCount / 5) > 50 && !newLane.manualOverride) newLane.status = 'STUCK';
                        } else {
                            newLane.rawHeadCount = Math.max(0, newLane.rawHeadCount + change);
                            newLane.throughput = Math.max(0, 12 + Math.floor(Math.random() * 8) - 4);

                            if (newLane.status === 'STUCK' && !newLane.isJammed && !newLane.manualOverride) newLane.status = 'OPEN';
                        }
                    }

                    newLane.history.shift();
                    newLane.history.push(newLane.throughput);

                    newTotal += Math.ceil(newLane.rawHeadCount / 5);
                    return newLane;
                });
                setTotalCapacity(newTotal);
                return newLanes;
            });
        }, 2000);
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

    const handleStatusChange = (id, newStatus) => {
        setLanesData(prev => prev.map(lane => {
            if (lane.id === id) {
                const updated = { ...lane, status: newStatus, manualOverride: true };
                if (newStatus === 'OPEN') {
                    updated.manualOverride = false;
                    showToast(`${lane.name} is set to AUTO/OPEN`);
                } else {
                    showToast(`${lane.name} marked as ${newStatus}`, newStatus === 'STUCK' || newStatus === 'CLOSED');
                }
                return updated;
            }
            return lane;
        }));
    };

    const handleSimulateJam = () => {
        setLanesData(prev => prev.map(lane => {
            if (lane.id === 3) {
                showToast("Simulating Jam on Lane 3...", true);
                return { ...lane, isJammed: true, rawHeadCount: 1200, throughput: 0 };
            }
            return lane;
        }));
    };

    const handleGuardAssignConfirm = () => {
        showToast(`Alpha Team dispatched to ${activeGuardLane.name}`);
        setActiveGuardLane(null);
    };

    return (
        <div className="bg-lumine-bg text-gray-800 overflow-hidden h-screen flex flex-col">
            <AdminHeader onLogout={handleLogout} />

            <div className="flex-1 overflow-hidden relative bg-[#F8FAFC] p-6 overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-2xl font-bold brand-font text-gray-800">Lane Status Overview</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Control lane availability and view live occupancy.
                            <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold ml-2 border border-blue-100">Logic: 5 Heads = 1 Unit</span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleSimulateJam} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-xs font-bold border border-red-200 hover:bg-red-100 transition shadow-sm">
                            <i className="fas fa-bug mr-1"></i> Sim Jam (L-3)
                        </button>
                        <div className="text-right bg-white p-2 rounded-lg border border-gray-200 shadow-sm px-4">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Total Effective Capacity</p>
                            <p className="text-xl font-bold text-lumine-orange">{totalCapacity} / {lanesData.length * 300}</p>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                    {lanesData.map(lane => (
                        <LaneCard
                            key={lane.id}
                            lane={lane}
                            onStatusChange={handleStatusChange}
                            onOpenCam={setActiveCamLane}
                            onAssignGuard={setActiveGuardLane}
                        />
                    ))}
                </div>
            </div>

            <LiveCamModal
                lane={activeCamLane}
                onClose={() => setActiveCamLane(null)}
            />

            <GuardAssignModal
                lane={activeGuardLane}
                onClose={() => setActiveGuardLane(null)}
                onConfirm={handleGuardAssignConfirm}
            />

            <Toast
                message={toast.message}
                show={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};

export default AdminLaneControl;
