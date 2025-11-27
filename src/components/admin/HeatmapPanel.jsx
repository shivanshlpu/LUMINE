import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.heat';

const HeatmapPanel = () => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const heatLayerRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const CENTER_COORDS = [20.8881, 70.4012];

        const heatMapStyleClean = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
            attribution: 'Lumine', maxZoom: 21
        });
        const heatMapStyleSat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri', maxZoom: 21
        });

        const map = L.map(mapRef.current, {
            zoomControl: true,
            layers: [heatMapStyleClean]
        }).setView(CENTER_COORDS, 20);

        mapInstanceRef.current = map;

        const heatmapLayers = {
            "Clean Map": heatMapStyleClean,
            "Satellite": heatMapStyleSat
        };
        L.control.layers(heatmapLayers, null, { position: 'topright' }).addTo(map);

        const generateLaneFeature = (index) => {
            const latBase = 20.8883 - (index * 0.00006);
            const lngStart = 70.4016;
            const lngEnd = 70.4008;
            return {
                "properties": {
                    "id": `L0${index + 1}`, "capacity": 300,
                    "current": 50 + Math.floor(Math.random() * 50)
                },
                "geometry": {
                    "coordinates": [[
                        [lngStart, latBase], [lngEnd, latBase],
                        [lngEnd, latBase - 0.00004], [lngStart, latBase - 0.00004],
                        [lngStart, latBase]
                    ]]
                }
            };
        };

        const lanesData = Array.from({ length: 8 }, (_, i) => generateLaneFeature(i));
        lanesData[1].properties.current = 280;
        lanesData[2].properties.current = 295;

        const generateLaneBasedPoints = () => {
            const points = [];
            const AGGREGATION_FACTOR = 20;
            lanesData.forEach(lane => {
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
        const heatLayer = L.heatLayer(heatPoints, {
            radius: 5, blur: 6, minOpacity: 0.6,
            gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
        }).addTo(map);

        heatLayerRef.current = heatLayer;

        const interval = setInterval(() => {
            const newPoints = generateLaneBasedPoints();
            heatLayer.setLatLngs(newPoints);
            lanesData.forEach(l => {
                let change = Math.floor(Math.random() * 5) - 2;
                if (l.properties.id === 'L02' || l.properties.id === 'L03') {
                    if (l.properties.current < 250) change = 5;
                }
                l.properties.current += change;
            });
        }, 2000);

        return () => {
            clearInterval(interval);
            map.remove();
        };
    }, []);

    return (
        <div className="panel left-col">
            <div className="panel-head">
                <span className="panel-title">Real-Time Heatmap View</span>
                <span className="badge badge-live">LIVE FEED</span>
            </div>
            <div id="heatmap-container" ref={mapRef}></div>
        </div>
    );
};

export default HeatmapPanel;
