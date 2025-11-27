import React, { useState } from 'react';

const LaneControlPanel = () => {
    const [lanes, setLanes] = useState(
        Array.from({ length: 8 }, (_, i) => {
            const id = i + 1;
            const state = (id === 3 || id === 8) ? 'busy' : 'open';
            return { id, state };
        })
    );

    const toggleLane = (index) => {
        setLanes(prev => {
            const newLanes = [...prev];
            const lane = newLanes[index];
            let newState;
            if (lane.state === 'open') newState = 'busy';
            else if (lane.state === 'busy') newState = 'closed';
            else newState = 'open';

            newLanes[index] = { ...lane, state: newState };
            return newLanes;
        });
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
