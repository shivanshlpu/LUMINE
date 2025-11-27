import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const GuardMap = ({ teams, selectedTeamId, onMapClick, onMarkerClick, clickTargetLoc }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef({});
    const polylineRef = useRef(null);

    const MAP_CENTER = [20.8881, 70.4012];
    const ZOOM_LEVEL = 19;

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
            layers: [mapStyleNormal]
        });

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        const baseMaps = {
            "Map View": mapStyleNormal,
            "Satellite": mapStyleSatellite
        };
        L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map);

        map.on('click', (e) => {
            onMapClick(e.latlng);
        });

        mapInstanceRef.current = map;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!mapInstanceRef.current) return;
        const map = mapInstanceRef.current;

        Object.values(markersRef.current).forEach(marker => map.removeLayer(marker));
        markersRef.current = {};

        teams.forEach(t => {
            if (t.status === 'Offline') return;

            const iconClass = `guard-marker ${t.status.toLowerCase()}`;
            const icon = L.divIcon({
                className: 'custom-map-icon',
                html: `<div class="${iconClass}"><i class="fas fa-user-shield"></i></div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            const marker = L.marker(t.loc, { icon: icon }).addTo(map);
            marker.bindTooltip(t.name, { offset: [0, -10], direction: 'top' });

            marker.on('click', (e) => {
                L.DomEvent.stopPropagation(e); // Prevent map click
                onMarkerClick(t.id);
            });

            markersRef.current[t.id] = marker;
        });

    }, [teams]);

    useEffect(() => {
        if (!mapInstanceRef.current || !selectedTeamId) return;
        const team = teams.find(t => t.id === selectedTeamId);
        if (team && team.status !== 'Offline') {
            mapInstanceRef.current.flyTo(team.loc, 20);
        }
    }, [selectedTeamId]);

    useEffect(() => {
        if (!mapInstanceRef.current) return;

        if (polylineRef.current) {
            mapInstanceRef.current.removeLayer(polylineRef.current);
            polylineRef.current = null;
        }

    }, []);

    useEffect(() => {
        if (!mapInstanceRef.current) return;
    }, []);

    return (
        <div className="col-center">
            <div className="map-overlay-controls">
                <i className="fas fa-satellite-dish text-green-500 animate-pulse"></i> GPS Live
            </div>
            <div id="map" ref={mapRef} style={{ width: '100%', height: '100%', zIndex: 1 }}></div>
        </div>
    );
};

export default GuardMap;
