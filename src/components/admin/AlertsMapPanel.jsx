import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const AlertsMapPanel = ({ alerts, guards, onAlertClick, activeAlertId, onMapReady }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef({});
    const guardMarkersRef = useRef({});

    useEffect(() => {
        if (!mapRef.current) return;

        const CENTER_COORDS = [20.8881, 70.4012];

        const mapStyleNormal = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: 'Lumine', maxZoom: 21
        });
        const mapStyleSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri', maxZoom: 21
        });

        const map = L.map(mapRef.current, {
            zoomControl: true,
            layers: [mapStyleNormal]
        }).setView(CENTER_COORDS, 18);

        mapInstanceRef.current = map;

        const alertMapLayers = {
            "Map View": mapStyleNormal,
            "Satellite": mapStyleSatellite
        };
        L.control.layers(alertMapLayers, null, { position: 'topright' }).addTo(map);

        if (onMapReady) onMapReady(map);

        return () => {
            map.remove();
        };
    }, []);

    useEffect(() => {
        if (!mapInstanceRef.current) return;
        const map = mapInstanceRef.current;

        alerts.forEach(a => {
            if (!markersRef.current[a.id]) {
                const icon = L.divIcon({
                    className: 'custom-div-icon',
                    html: `<div class="pulse-marker">${a.icon}</div>`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                });
                const marker = L.marker([a.lat, a.lon], { icon: icon }).addTo(map);
                marker.on('click', () => onAlertClick(a));
                markersRef.current[a.id] = marker;
            }
        });

    }, [alerts, onAlertClick]);

    useEffect(() => {
        if (!mapInstanceRef.current) return;
        const map = mapInstanceRef.current;

        guards.forEach(g => {
            if (guardMarkersRef.current[g.id]) {
                guardMarkersRef.current[g.id].setLatLng([g.lat, g.lon]);
            } else {
                const marker = L.circleMarker([g.lat, g.lon], {
                    radius: 5, color: '#012a4a', fillColor: '#012a4a', fillOpacity: 1
                }).addTo(map).bindTooltip(g.name);
                guardMarkersRef.current[g.id] = marker;
            }
        });
    }, [guards]);

    return (
        <div className="panel alert-map-panel">
            <div className="panel-head">
                <span className="panel-title">SOS & Alerts Map View</span>
                <span className="badge" style={{ background: 'var(--navy)', color: 'white' }}>INTERACTIVE</span>
            </div>
            <div id="alertmap-container" ref={mapRef}></div>
        </div>
    );
};

export default AlertsMapPanel;
