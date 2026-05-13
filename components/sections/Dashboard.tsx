"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Incident } from "@/lib/api";

const TYPE_COLOR: Record<string, string> = {
  traffic_congestion: "#e74c3c",
  burst_water_pipe: "#3498db",
  electrical_fault: "#f39c12",
  weak_bridge: "#8e44ad",
  pothole_bad_road: "#d35400",
  illegal_dumping: "#27ae60",
  streetlight_outage: "#2c3e50",
  open_manhole: "#16a085",
  noise_complaint: "#c0392b",
  other: "#7f8c8d",
};

/**
 * Dashboard Map: Renders interactive Mapbox visualization for community issues.
 */
export default function Dashboard({ incidents }: { incidents: Incident[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-0.418, 5.533], // Kasoa center
      zoom: 12,
    });
    mapInstance.current.addControl(new mapboxgl.NavigationControl());
    return () => mapInstance.current?.remove();
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    document.querySelectorAll(".cerp-marker").forEach((m) => m.remove());

    incidents.forEach((inc) => {
      if (!inc.latitude || !inc.longitude) return;
      const color = TYPE_COLOR[inc.type] || "#7f8c8d";
      const el = document.createElement("div");
      el.className = "cerp-marker";
      el.style.cssText = `width:14px;height:14px;border-radius:50%;background:${color};border:2px solid rgba(0,0,0,0.5);box-shadow:0 0 10px ${color};cursor:pointer;`;

      const popup = new mapboxgl.Popup({ offset: 10 }).setHTML(`
        <div style="font-family:sans-serif;padding:6px;font-size:12px;color:#333">
          <strong style="display:block;margin-bottom:4px">${inc.type.replace(/_/g, " ").toUpperCase()}</strong>
          <p style="margin:0 0 4px;opacity:0.8">${inc.description}</p>
          <span style="opacity:0.5">${inc.region} · ${inc.status}</span>
        </div>
      `);

      new mapboxgl.Marker(el).setLngLat([inc.longitude, inc.latitude]).setPopup(popup).addTo(mapInstance.current!);
    });
  }, [incidents]);

  return <div ref={mapRef} className="w-full h-full min-h-125 rounded-2xl overflow-hidden grayscale-20 contrast-110" />;
}