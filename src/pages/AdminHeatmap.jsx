import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.heat';
import 'leaflet.markercluster';
import '../styles/admin-heatmap.css';
import '../styles/admin.css';

import AdminHeader from '../components/admin/AdminHeader';
import ViewControls from '../components/admin/heatmap/ViewControls';
import DetailsPanel from '../components/admin/heatmap/DetailsPanel';
import ToastNotification from '../components/admin/heatmap/ToastNotification';

const AdminHeatmap = () => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const layersRef = useRef({ lanes: null, heat: null, cameras: null });

    const [showHeatmap, setShowHeatmap] = useState(true);
    const [showCameras, setShowCameras] = useState(true);
    const [selectedLane, setSelectedLane] = useState(null);
    const [lanesData, setLanesData] = useState(null);
    const [showToast, setShowToast] = useState(false);


    const MAP_CENTER = [20.8881, 70.4012];
    const ZOOM_LEVEL = 20;


    useEffect(() => {
        const generateLaneFeature = (index) => {
            const latBase = 20.8883 - (index * 0.00006);
            const lngStart = 70.4016;
            const lngEnd = 70.4008;

            return {
                "type": "Feature",
                "properties": {
                    "id": `L0${index + 1}`,
                    "name": `Queue Lane ${index + 1}`,
                    "capacity": 300,
                    "current": 50 + Math.floor(Math.random() * 50)
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [lngStart, latBase],
                        [lngEnd, latBase],
                        [lngEnd, latBase - 0.00004],
                        [lngStart, latBase - 0.00004],
                        [lngStart, latBase]
                    ]]
                }
            };
        };

        const initialData = {
            "type": "FeatureCollection",
            "features": Array.from({ length: 8 }, (_, i) => generateLaneFeature(i))
        };

        initialData.features[1].properties.current = 280;
        initialData.features[2].properties.current = 295;

        setLanesData(initialData);
    }, []);


    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const mapStyleNormal = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: 'Lumine', maxZoom: 21
        });
        const mapStyleSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri', maxZoom: 21
        });

        const map = L.map(mapRef.current, {
            center: MAP_CENTER,
            zoom: ZOOM_LEVEL,
            zoomControl: false,
            attributionControl: false,
            layers: [mapStyleNormal],
            maxBounds: [[20.8870, 70.4000], [20.8890, 70.4030]],
            maxBoundsViscosity: 1.0
        });

        mapInstanceRef.current = map;

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        const baseMaps = {
            "Map View": mapStyleNormal,
            "Satellite": mapStyleSatellite
        };
        L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map);

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);


    useEffect(() => {
        if (!mapInstanceRef.current || !lanesData) return;
        const map = mapInstanceRef.current;


        if (layersRef.current.lanes) map.removeLayer(layersRef.current.lanes);

        layersRef.current.lanes = L.geoJSON(lanesData, {
            style: { stroke: false, fill: false, opacity: 0, fillOpacity: 0 },
            onEachFeature: (feature, layer) => {
                layer.on('click', () => setSelectedLane(feature.properties));
            }
        }).addTo(map);


        if (!layersRef.current.heat) {
            const generateLaneBasedPoints = () => {
                const points = [];
                const AGGREGATION_FACTOR = 20;
                lanesData.features.forEach(lane => {
                    const totalPeople = lane.properties.current;
                    const dotsToShow = Math.ceil(totalPeople / AGGREGATION_FACTOR);
                    const coords = lane.geometry.coordinates[0];
                    const minLng = Math.min(coords[0][0], coords[1][0]);
                    const maxLng = Math.max(coords[0][0], coords[1][0]);
                    const minLat = Math.min(coords[0][1], coords[2][1]);
                    const maxLat = Math.max(coords[0][1], coords[2][1]);

                    for (let i = 0; i < dotsToShow; i++) {
                        const lat = minLat + Math.random() * (maxLat - minLat);
                        const lng = minLng + Math.random() * (maxLng - minLng);
                        points.push([lat, lng, totalPeople > 250 ? 1.0 : 0.8]);
                    }
                });
                return points;
            };

            const heatPoints = generateLaneBasedPoints();
            layersRef.current.heat = L.heatLayer(heatPoints, {
                radius: 5, blur: 6, minOpacity: 0.6,
                gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
            });

            if (showHeatmap) map.addLayer(layersRef.current.heat);
        }


        if (!layersRef.current.cameras) {
            const cameraMarkers = L.markerClusterGroup({
                showCoverageOnHover: false,
                zoomToBoundsOnClick: true,
                maxClusterRadius: 30
            });

            const icon = L.divIcon({
                className: 'custom-cam',
                html: `<div class="w-5 h-5 bg-gray-900 rounded-full text-white flex items-center justify-center text-[8px] shadow-sm border border-white"><i class="fas fa-video"></i></div>`,
                iconSize: [20, 20]
            });

            for (let i = 0; i < 52; i++) {
                const laneIdx = i % 8;
                const lane = lanesData.features[laneIdx];
                const coords = lane.geometry.coordinates[0];
                const t = Math.random();
                const lng = coords[0][0] + (coords[1][0] - coords[0][0]) * t;
                const lat = coords[0][1] + (coords[3][1] - coords[0][1]) * Math.random();

                const marker = L.marker([lat, lng], { icon: icon })
                    .bindPopup(`<b>Camera CAM-${1000 + i}</b><br>Status: Online<br>Count: ${Math.floor(Math.random() * 40)}`);
                cameraMarkers.addLayer(marker);
            }

            layersRef.current.cameras = cameraMarkers;
            if (showCameras) map.addLayer(layersRef.current.cameras);
        }

    }, [lanesData]);


    useEffect(() => {
        if (!mapInstanceRef.current) return;
        const map = mapInstanceRef.current;

        if (showHeatmap && layersRef.current.heat) {
            if (!map.hasLayer(layersRef.current.heat)) map.addLayer(layersRef.current.heat);
        } else if (layersRef.current.heat) {
            if (map.hasLayer(layersRef.current.heat)) map.removeLayer(layersRef.current.heat);
        }

        if (showCameras && layersRef.current.cameras) {
            if (!map.hasLayer(layersRef.current.cameras)) map.addLayer(layersRef.current.cameras);
        } else if (layersRef.current.cameras) {
            if (map.hasLayer(layersRef.current.cameras)) map.removeLayer(layersRef.current.cameras);
        }
    }, [showHeatmap, showCameras]);


    useEffect(() => {
        const interval = setInterval(() => {
            if (!lanesData) return;


            if (layersRef.current.heat) {
                const generateLaneBasedPoints = () => {
                    const points = [];
                    const AGGREGATION_FACTOR = 20;
                    lanesData.features.forEach(lane => {
                        const totalPeople = lane.properties.current;
                        const dotsToShow = Math.ceil(totalPeople / AGGREGATION_FACTOR);
                        const coords = lane.geometry.coordinates[0];
                        const minLng = Math.min(coords[0][0], coords[1][0]);
                        const maxLng = Math.max(coords[0][0], coords[1][0]);
                        const minLat = Math.min(coords[0][1], coords[2][1]);
                        const maxLat = Math.max(coords[0][1], coords[2][1]);

                        for (let i = 0; i < dotsToShow; i++) {
                            const lat = minLat + Math.random() * (maxLat - minLat);
                            const lng = minLng + Math.random() * (maxLng - minLng);
                            points.push([lat, lng, totalPeople > 250 ? 1.0 : 0.8]);
                        }
                    });
                    return points;
                };
                layersRef.current.heat.setLatLngs(generateLaneBasedPoints());
            }


            setLanesData(prev => {
                const newData = { ...prev };
                newData.features.forEach(lane => {
                    let change = Math.floor(Math.random() * 5) - 2;
                    if (lane.properties.id === 'L02' || lane.properties.id === 'L03') {
                        if (lane.properties.current < 250) change = 5;
                    }
                    lane.properties.current += change;
                });


                if (selectedLane) {
                    const updatedLane = newData.features.find(f => f.properties.id === selectedLane.id);
                    if (updatedLane) setSelectedLane({ ...updatedLane.properties });
                }

                return newData;
            });

        }, 2000);

        return () => clearInterval(interval);
    }, [lanesData, selectedLane]);

    const handleDeploy = () => {
        setShowToast(true);
        setSelectedLane(null);
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "/";
        }
    };

    return (
        <div className="bg-lumine-bg text-gray-800 overflow-hidden h-screen flex flex-col">
            <AdminHeader onLogout={handleLogout} />

            <div className="relative w-full flex-1">
                <ViewControls
                    showHeatmap={showHeatmap}
                    setShowHeatmap={setShowHeatmap}
                    showCameras={showCameras}
                    setShowCameras={setShowCameras}
                />

                <div id="map" ref={mapRef} className="w-full h-full bg-gray-100"></div>

                <DetailsPanel
                    selectedLane={selectedLane}
                    onClose={() => setSelectedLane(null)}
                    onDeploy={handleDeploy}
                />

                <ToastNotification
                    show={showToast}
                    laneName={selectedLane ? selectedLane.name : 'Lane 1'}
                    onClose={() => setShowToast(false)}
                />
            </div>
        </div>
    );
};

export default AdminHeatmap;
