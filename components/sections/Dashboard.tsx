"use client";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Incident } from "@/lib/api";

const TYPE_COLOR = {
  flood: "#2e86ff",
  fire: "#ff3b3b",
  accident: "#ff8c00",
};

export default function Dashboard({ incidents }: { incidents: Incident[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Set your Mapbox token
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    // Create the map centred on Kasoa
    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-0.418, 5.533], // Kasoa coordinates
      zoom: 12,
    });

    // Add navigation controls
    mapInstance.current.addControl(new mapboxgl.NavigationControl());

    return () => mapInstance.current?.remove();
  }, []);

  // Add markers whenever incidents change
  useEffect(() => {
    if (!mapInstance.current) return;

    // Remove old markers
    document.querySelectorAll(".cerp-marker").forEach((m) => m.remove());

    // Add a marker for each incident that has coordinates
    incidents.forEach((inc) => {
      if (!inc.latitude || !inc.longitude) return;

      // Create the marker element
      const el = document.createElement("div");
      el.className = "cerp-marker";
      el.style.cssText = `
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: ${TYPE_COLOR[inc.type as keyof typeof TYPE_COLOR]};
        border: 2px solid rgba(10,12,16,0.8);
        box-shadow: 0 0 8px ${TYPE_COLOR[inc.type as keyof typeof TYPE_COLOR]};
        cursor: pointer;
      `;

      // Add popup with incident details
      const popup = new mapboxgl.Popup({ offset: 10 }).setHTML(`
        <div style="font-family:sans-serif;padding:4px">
          <strong>${inc.type.toUpperCase()}</strong><br/>
          ${inc.description}<br/>
          <span style="color:#888;font-size:11px">${inc.region} · ${inc.status}</span>
        </div>
      `);

      // Place the marker on the map
      new mapboxgl.Marker(el)
        .setLngLat([inc.longitude, inc.latitude])
        .setPopup(popup)
        .addTo(mapInstance.current!);
    });
  }, [incidents]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "100%", minHeight: "400px" }}
    />
  );
}