import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, LayersControl, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Somnath Mandir Coordinates
const CENTER_POSITION = [20.8880, 70.4010];

// Lane Paths (Single Device Points)
// Adapted for numeric IDs 1-8
const LANE_PATHS = {
    1: [20.8882, 70.4012], // Lane 1 (Queue Area)
    2: [20.8880, 70.4010], // Lane 2 (Main Gate - Pin Point)
    3: [20.8885, 70.4000], // Lane 3
    4: [20.8888, 70.4008], // Lane 4
    5: [20.8880, 70.4015], // Lane 5
    6: [20.8875, 70.4010], // Lane 6
    7: [20.8885, 70.4018], // Lane 7
    8: [20.8890, 70.4012]  // Lane 8
};

const MapDashboard = ({ lanes, className = "h-[600px] w-full" }) => {
    const getLaneColor = (lane) => {
        if (lane.status === 'RED') return '#E53E3E'; // Red
        if (lane.status === 'YELLOW') return '#D69E2E'; // Yellow
        return '#38A169'; // Green
    };

    const createPopIcon = () => L.divIcon({
        className: 'custom-sos-icon',
        html: `<div class="relative">
                 <div class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div>
                 <div class="relative inline-flex rounded-full h-8 w-8 bg-red-600 items-center justify-center border-2 border-white shadow-lg">
                    <i class="fas fa-user-injured text-white text-sm"></i>
                 </div>
               </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
    });

    return (
        <div className={`${className} rounded-xl overflow-hidden border-2 border-border shadow-lg relative z-0`}>
            <MapContainer
                center={CENTER_POSITION}
                zoom={19}
                maxZoom={22} // Allow very close zoom
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="Standard">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            maxNativeZoom={19}
                            maxZoom={22}
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Satellite">
                        <TileLayer
                            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            maxNativeZoom={19}
                            maxZoom={22}
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>

                {lanes.map((lane) => {
                    // Use dynamic location if available, else fallback to hardcoded
                    let pos = null;
                    if (lane.location && lane.location.lat && lane.location.lng) {
                        pos = [lane.location.lat, lane.location.lng];
                    } else {
                        pos = LANE_PATHS[lane.laneId];
                    }

                    if (!pos) return null;

                    const color = getLaneColor(lane);
                    // Only show SOS marker if explicitly isSos is true. Do NOT change color based on SOS.
                    const isSos = lane.isSos;

                    return (
                        <React.Fragment key={lane.laneId}>
                            <CircleMarker
                                center={pos}
                                pathOptions={{
                                    color: color,
                                    fillColor: color,
                                    fillOpacity: 0.6,
                                    stroke: false
                                }}
                                radius={12}
                            >
                                <Popup>
                                    <div className="p-2 min-w-[150px]">
                                        <h3 className="font-bold text-lg mb-2">Lane {lane.laneId}</h3>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <span className="text-gray-600">Temp:</span>
                                            <span className="font-semibold">{lane.temperature || '--'}°C</span>
                                            <span className="text-gray-600">Humidity:</span>
                                            <span className="font-semibold">{lane.humidity || '--'}%</span>
                                            <span className="text-gray-600">Crowd:</span>
                                            <span className="font-semibold">{lane.crowdCount || 0}</span>
                                            <span className="text-gray-600">Status:</span>
                                            <span className={`font-bold ${color === '#E53E3E' ? 'text-red-600' : color === '#D69E2E' ? 'text-yellow-600' : 'text-green-600'}`}>
                                                {lane.status || (lane.crowdCount > 150 ? 'OVERCROWDED' : lane.crowdCount > 50 ? 'MODERATE' : 'NORMAL')}
                                            </span>
                                        </div>
                                    </div>
                                </Popup>
                            </CircleMarker>

                            {/* SOS Pop Person Marker */}
                            {isSos && (
                                <Marker position={pos} icon={createPopIcon()}>
                                    <Popup>
                                        <div className="text-center">
                                            <strong className="text-red-600">SOS ALERT!</strong><br />
                                            Lane {lane.laneId}<br />
                                            <button className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-xs">Resolve</button>
                                        </div>
                                    </Popup>
                                </Marker>
                            )}
                        </React.Fragment>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default MapDashboard;
