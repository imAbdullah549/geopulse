import "maplibre-gl/dist/maplibre-gl.css";

import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import type { MapPointDto } from "@/shared/types/map";

function markerClass(severity: MapPointDto["severity"]) {
  if (severity === "high") return "bg-destructive ring-destructive/30";
  if (severity === "medium") return "bg-secondary ring-muted/40";
  return "bg-background ring-muted/50 border";
}

export function MapView({
  points,
  onSelect,
}: {
  points: MapPointDto[];
  onSelect: (p: MapPointDto) => void;
}) {
  return (
    <div className="h-full w-full overflow-hidden rounded-2xl border">
      <Map
        initialViewState={{ latitude: 60.1699, longitude: 24.9384, zoom: 10 }} // Helsinki default
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://demotiles.maplibre.org/style.json"
      >
        <NavigationControl position="top-left" />
        {points.map((p) => (
          <Marker key={p.id} latitude={p.lat} longitude={p.lng} anchor="center">
            <button
              type="button"
              onClick={() => onSelect(p)}
              className={[
                "h-3 w-3 rounded-full ring-4 transition-transform",
                "hover:scale-125 focus:scale-125 focus:outline-none",
                markerClass(p.severity),
              ].join(" ")}
              aria-label={`Open ${p.title}`}
              title={`${p.title} (${p.severity}, ${p.status})`}
            />
          </Marker>
        ))}
      </Map>
    </div>
  );
}
