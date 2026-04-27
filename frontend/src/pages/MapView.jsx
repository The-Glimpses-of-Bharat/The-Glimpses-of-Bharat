import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../api/axios";
import "./MapView.css";

// Fix default marker icons in Leaflet + webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom marker icons
const createIcon = (color) =>
  L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 28px; height: 28px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      position: relative;
    "><div style="
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 0; height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 8px solid ${color};
    "></div></div>`,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
  });

const saffronIcon = createIcon("#ff9933");
const greenIcon = createIcon("#138808");

// Component to fit map bounds
function FitBounds({ locations }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map((l) => [l.lat, l.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 7 });
    }
  }, [locations, map]);

  return null;
}

export default function MapView() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.get("/quiz/locations");
        if (res.data?.locations) {
          setLocations(res.data.locations);
        }
      } catch (err) {
        console.error("Failed to load locations", err);
      }
      setLoading(false);
    };
    fetchLocations();
  }, []);

  const filteredLocations = useMemo(() => {
    if (filter === "all") return locations;
    return locations.filter((l) => l.type === filter);
  }, [locations, filter]);

  const birthplaceCount = locations.filter((l) => l.type === "birthplace").length;
  const eventCount = locations.filter((l) => l.type === "event").length;

  const indiaCenter = [22.5937, 78.9629];

  if (loading) {
    return (
      <div className="map-page">
        <div className="map-loading">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="map-page">
      <div className="map-page-header">
        <h1>📍 Heritage Map</h1>
        <div className="map-filter-pills">
          {[
            { key: "all", label: "All Locations", dotClass: "all" },
            { key: "birthplace", label: "Birthplaces", dotClass: "birthplace" },
            { key: "event", label: "Historic Events", dotClass: "event" },
          ].map((f) => (
            <button
              key={f.key}
              className={`map-filter-pill ${filter === f.key ? "active" : ""}`}
              onClick={() => setFilter(f.key)}
              id={`map-filter-${f.key}`}
            >
              <span className={`map-filter-dot ${f.dotClass}`} />
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="map-wrapper">
        <MapContainer
          center={indiaCenter}
          zoom={5}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitBounds locations={filteredLocations} />

          {filteredLocations.map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={loc.type === "birthplace" ? saffronIcon : greenIcon}
            >
              <Popup maxWidth={280} minWidth={220}>
                <div className="map-popup">
                  <div className="map-popup-header">
                    {loc.image ? (
                      <img
                        src={loc.image}
                        alt={loc.name}
                        className="map-popup-avatar"
                      />
                    ) : (
                      <div className="map-popup-avatar-placeholder">
                        {loc.name?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="map-popup-title">{loc.name}</div>
                      <div className="map-popup-place">📍 {loc.place}</div>
                    </div>
                  </div>
                  <div className={`map-popup-type ${loc.type}`}>
                    {loc.type === "birthplace" ? "🏠 Birthplace" : "⚔️ Historic Event"}
                  </div>
                  <div className="map-popup-significance">{loc.significance}</div>
                  {loc.born && (
                    <div className="map-popup-years">
                      📅 {loc.born}{loc.died ? ` — ${loc.died}` : ""}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Legend overlay */}
          <div className="map-legend">
            <div className="map-legend-item">
              <span className="map-legend-dot birthplace" />
              Birthplace
            </div>
            <div className="map-legend-item">
              <span className="map-legend-dot event" />
              Historic Event
            </div>
          </div>
        </MapContainer>
      </div>

      {/* Stats */}
      <div className="map-stats-strip">
        <div className="map-stat-card">
          <div className="map-stat-icon blue">📍</div>
          <div>
            <div className="map-stat-value">{locations.length}</div>
            <div className="map-stat-label">Total Locations</div>
          </div>
        </div>
        <div className="map-stat-card">
          <div className="map-stat-icon saffron">🏠</div>
          <div>
            <div className="map-stat-value">{birthplaceCount}</div>
            <div className="map-stat-label">Birthplaces</div>
          </div>
        </div>
        <div className="map-stat-card">
          <div className="map-stat-icon green">⚔️</div>
          <div>
            <div className="map-stat-value">{eventCount}</div>
            <div className="map-stat-label">Historic Events</div>
          </div>
        </div>
      </div>
    </div>
  );
}
