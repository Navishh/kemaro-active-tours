import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SRI_LANKA_CENTER, type City, type Hotel, type LatLng, type Place } from "@/lib/sriLanka/data";

// Pin factory — `tone` controls colour:
//   "neutral" = ivory/gold default
//   "selected" = vivid yellow (highlighted)
//   "focus"    = larger gold star ring
const pin = (emoji: string, tone: "neutral" | "selected" | "focus") => {
  const colors = {
    neutral: { bg: "#d4a84c", fg: "#1a1407", ring: "#000000aa", border: "#f0d78c" },
    selected: { bg: "#fde047", fg: "#1a1407", ring: "#facc15bb", border: "#fff7a8" },
    focus: { bg: "#facc15", fg: "#1a1407", ring: "#facc1599", border: "#fff7a8" },
  }[tone];
  const size = tone === "focus" ? 44 : 32;
  return L.divIcon({
    className: `kemaro-pin-${tone}`,
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:9999px;
      background:${colors.bg};color:${colors.fg};
      display:flex;align-items:center;justify-content:center;
      font-size:${tone === "focus" ? 18 : 15}px;font-weight:700;
      box-shadow:0 0 0 ${tone === "focus" ? 6 : 3}px ${colors.ring}, 0 8px 22px -8px rgba(0,0,0,.55);
      border:2px solid ${colors.border};
    ">${emoji}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

function FlyTo({ target, zoom }: { target: LatLng | null; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, zoom, { duration: 1.2 });
    else map.flyTo(SRI_LANKA_CENTER, 7.4, { duration: 1.2 });
  }, [target?.[0], target?.[1], zoom, map]);
  return null;
}

export type MapMode = "places" | "hotels";

export type SriLankaMapProps = {
  cities: City[];
  places: Place[];
  hotels: Hotel[];
  selectedCityIds: string[];
  selectedPlaceIds: string[];
  selectedHotelIds: string[];
  focus: { kind: "city" | "place" | "hotel"; id: string } | null;
  mode: MapMode;
  onPickPlace?: (p: Place) => void;
  onPickHotel?: (h: Hotel) => void;
};

const SriLankaMap = ({
  cities, places, hotels,
  selectedCityIds, selectedPlaceIds, selectedHotelIds,
  focus, mode, onPickPlace, onPickHotel,
}: SriLankaMapProps) => {
  const visibleCityIds = useMemo(() => new Set(selectedCityIds), [selectedCityIds]);

  const visiblePlaces = useMemo(
    () => (mode === "places" ? places.filter((p) => visibleCityIds.has(p.city)) : []),
    [mode, places, visibleCityIds],
  );
  const visibleHotels = useMemo(
    () => (mode === "hotels" ? hotels.filter((h) => visibleCityIds.has(h.city)) : []),
    [mode, hotels, visibleCityIds],
  );

  const focusTarget: LatLng | null = useMemo(() => {
    if (!focus) {
      if (selectedCityIds.length === 1) {
        const c = cities.find((c) => c.id === selectedCityIds[0]);
        return c ? c.coords : null;
      }
      return null;
    }
    if (focus.kind === "city") return cities.find((c) => c.id === focus.id)?.coords ?? null;
    if (focus.kind === "place") return places.find((p) => p.id === focus.id)?.coords ?? null;
    return hotels.find((h) => h.id === focus.id)?.coords ?? null;
  }, [focus, selectedCityIds, cities, places, hotels]);

  const focusZoom = focus?.kind === "city" ? 11 : focus ? 14 : selectedCityIds.length === 1 ? 11 : 7.4;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md border border-border/60 shadow-elegant">
      <MapContainer
        center={SRI_LANKA_CENTER}
        zoom={7.4}
        scrollWheelZoom
        className="h-full w-full"
      >
        {/* Colourful Google-Maps-like base layer (CARTO Voyager) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <FlyTo target={focusTarget} zoom={focusZoom} />

        {cities.filter((c) => visibleCityIds.has(c.id)).map((c) => (
          <Marker
            key={c.id}
            position={c.coords}
            icon={focus?.kind === "city" && focus.id === c.id ? pin("◆", "focus") : pin("◆", "neutral")}
          >
            <Popup>
              <strong>{c.name}</strong>
              <br />
              <span style={{ opacity: 0.7 }}>{c.region} Province</span>
            </Popup>
          </Marker>
        ))}

        {visiblePlaces.map((p) => {
          const sel = selectedPlaceIds.includes(p.id);
          const isFocus = focus?.kind === "place" && focus.id === p.id;
          return (
            <Marker
              key={p.id}
              position={p.coords}
              icon={isFocus ? pin("✦", "focus") : sel ? pin("✦", "selected") : pin("✦", "neutral")}
              eventHandlers={{ click: () => onPickPlace?.(p) }}
            >
              <Popup>
                <strong>{p.name}</strong>
                <br />
                <span style={{ opacity: 0.7 }}>{p.type}{sel ? " · selected" : ""}</span>
              </Popup>
            </Marker>
          );
        })}

        {visibleHotels.map((h) => {
          const sel = selectedHotelIds.includes(h.id);
          const isFocus = focus?.kind === "hotel" && focus.id === h.id;
          return (
            <Marker
              key={h.id}
              position={h.coords}
              icon={isFocus ? pin("⌂", "focus") : sel ? pin("⌂", "selected") : pin("⌂", "neutral")}
              eventHandlers={{ click: () => onPickHotel?.(h) }}
            >
              <Popup>
                <strong>{h.name}</strong>
                <br />
                <span style={{ opacity: 0.7 }}>{"★".repeat(h.stars)}{sel ? " · selected" : ""}</span>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default SriLankaMap;
