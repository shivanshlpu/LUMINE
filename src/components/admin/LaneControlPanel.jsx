import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const LaneControlPanel = () => {
    const [lanes, setLanes] = useState([]);

    useEffect(() => {
        const fetchLaneStatus = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/lane-status');
                const data = await response.json();

                // Only show active lanes with numeric IDs
                const formattedLanes = data
                    .filter(l => !isNaN(l.laneId))
                    .map(lane => ({
                        id: lane.laneId,
                        state: lane.status === 'RED' ? 'closed' : (lane.status === 'YELLOW' ? 'busy' : 'open')
                    }));
                setLanes(formattedLanes);
            } catch (error) {
                console.error('Error fetching lane status:', error);
            }
        };

        fetchLaneStatus();

        // Real-time updates
        const socket = io('http://localhost:3000');
        socket.on('lane-update', (updatedLane) => {
            setLanes(prev => prev.map(lane => {
                if (lane.id == updatedLane.laneId) {
                    return {
                        ...lane,
                        state: updatedLane.status === 'RED' ? 'closed' : (updatedLane.status === 'YELLOW' ? 'busy' : 'open')
                    };
                }
                return lane;
            }));
        });

        return () => socket.disconnect();
    }, []);

    const toggleLane = (index) => {
        // Toggle logic disabled as status comes from backend
        // In a real app, this would send a POST request to update status
        console.log('Toggle disabled in live mode');
    };

    return (
        <div className="panel lane-panel">
            <div className="panel-head">
                <span className="panel-title">Lane Control (Public View)</span>
            </div>
            <div className="lane-grid" id="lane-grid">
                {lanes.map((lane, index) => (
                    <div
                        key={lane.id}
                        className={`lane-btn ${lane.state}`}
                        onClick={() => toggleLane(index)}
                    >
                        <h5>L-{lane.id}</h5>
                        <span>{lane.state.toUpperCase()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LaneControlPanel;
