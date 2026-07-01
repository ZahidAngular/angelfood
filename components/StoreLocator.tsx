"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, LocateFixed, Package } from "lucide-react";

type Store = {
  name: string;
  town: string;
  lat: number;
  lng: number;
};

const STORES: Store[] = [
  { name: "PAK'nSAVE Albany", town: "Auckland", lat: -36.728, lng: 174.7 },
  { name: "Woolworths Ponsonby", town: "Auckland", lat: -36.8585, lng: 174.743 },
  { name: "New World Victoria Park", town: "Auckland", lat: -36.847, lng: 174.756 },
  { name: "Woolworths Newmarket", town: "Auckland", lat: -36.87, lng: 174.777 },
  { name: "PAK'nSAVE Mt Albert", town: "Auckland", lat: -36.889, lng: 174.716 },
  { name: "Woolworths Whangārei", town: "Whangārei", lat: -35.7251, lng: 174.3237 },
  { name: "New World Hamilton", town: "Hamilton", lat: -37.787, lng: 175.2793 },
  { name: "PAK'nSAVE Tauranga", town: "Tauranga", lat: -37.6878, lng: 176.1651 },
  { name: "New World Rotorua", town: "Rotorua", lat: -38.1368, lng: 176.2497 },
  { name: "New World Taupō", town: "Taupō", lat: -38.6857, lng: 176.0702 },
  { name: "Woolworths Gisborne", town: "Gisborne", lat: -38.664, lng: 178.0177 },
  { name: "Woolworths Napier", town: "Napier", lat: -39.4928, lng: 176.912 },
  { name: "PAK'nSAVE New Plymouth", town: "New Plymouth", lat: -39.0556, lng: 174.0752 },
  { name: "New World Palmerston North", town: "Palmerston North", lat: -40.3523, lng: 175.6082 },
  { name: "New World Wellington City", town: "Wellington", lat: -41.2924, lng: 174.7787 },
  { name: "PAK'nSAVE Kilbirnie", town: "Wellington", lat: -41.319, lng: 174.796 },
  { name: "FreshChoice Tawa", town: "Wellington", lat: -41.1664, lng: 174.825 },
  { name: "New World Nelson City", town: "Nelson", lat: -41.2706, lng: 173.284 },
  { name: "FreshChoice Blenheim", town: "Blenheim", lat: -41.5134, lng: 173.9612 },
  { name: "PAK'nSAVE Riccarton", town: "Christchurch", lat: -43.53, lng: 172.579 },
  { name: "Woolworths Christchurch", town: "Christchurch", lat: -43.532, lng: 172.6306 },
  { name: "Woolworths Timaru", town: "Timaru", lat: -44.396, lng: 171.254 },
  { name: "FreshChoice Queenstown", town: "Queenstown", lat: -45.0312, lng: 168.6626 },
  { name: "New World Dunedin", town: "Dunedin", lat: -45.8788, lng: 170.5028 },
  { name: "PAK'nSAVE Invercargill", town: "Invercargill", lat: -46.4132, lng: 168.3538 },
];

export function StoreLocator() {
  const mapEl = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<{ store: Store; marker: any }[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(`${STORES.length} stockists across Aotearoa`);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapEl.current || mapRef.current) return;
      LRef.current = L;

      const map = L.map(mapEl.current, {
        scrollWheelZoom: false,
        attributionControl: true,
      });
      mapRef.current = map;

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        }
      ).addTo(map);

      const pin = L.divIcon({
        className: "af-pin",
        html: `<span style="display:block;width:26px;height:26px;border-radius:50% 50% 50% 0;background:#2c7a4f;border:2px solid #fffdf7;transform:rotate(-45deg);box-shadow:0 6px 12px rgba(0,0,0,.3)"><span style="position:absolute;top:7px;left:7px;width:8px;height:8px;border-radius:50%;background:#fffdf7"></span></span>`,
        iconSize: [26, 26],
        iconAnchor: [13, 26],
        popupAnchor: [0, -24],
      });

      markersRef.current = STORES.map((store) => {
        const marker = L.marker([store.lat, store.lng], { icon: pin })
          .addTo(map)
          .bindPopup(
            `<strong style="font-weight:700">${store.name}</strong><br/>${store.town}`
          );
        return { store, marker };
      });

      const group = L.featureGroup(markersRef.current.map((m) => m.marker));
      map.fitBounds(group.getBounds().pad(0.15));
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  function runSearch(e?: React.FormEvent) {
    e?.preventDefault();
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;
    const q = query.trim().toLowerCase();

    if (!q) {
      const group = L.featureGroup(markersRef.current.map((m) => m.marker));
      map.fitBounds(group.getBounds().pad(0.15));
      setStatus(`${STORES.length} stockists across Aotearoa`);
      return;
    }

    const matched = markersRef.current.filter(
      ({ store }) =>
        store.town.toLowerCase().includes(q) ||
        store.name.toLowerCase().includes(q)
    );

    if (matched.length === 0) {
      setStatus(`No stockists found for “${query}” — try a nearby city`);
      return;
    }

    const group = L.featureGroup(matched.map((m) => m.marker));
    map.fitBounds(group.getBounds().pad(0.4), { maxZoom: 13 });
    if (matched.length === 1) matched[0].marker.openPopup();
    setStatus(
      `${matched.length} stockist${matched.length > 1 ? "s" : ""} near “${query}”`
    );
  }

  function nearMe() {
    const map = mapRef.current;
    if (!map || !navigator.geolocation) {
      setStatus("Location isn't available in this browser");
      return;
    }
    setStatus("Finding stockists near you…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.setView([pos.coords.latitude, pos.coords.longitude], 11);
        setStatus("Showing your area — green pins are stockists");
      },
      () => setStatus("Couldn't get your location — try searching a town")
    );
  }

  return (
    <section className="bg-cream pb-24 sm:pb-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-line bg-paper shadow-[0_30px_80px_-40px_rgba(20,66,44,0.4)]">
          {/* control bar */}
          <form
            onSubmit={runSearch}
            className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5"
          >
            <div className="flex flex-1 items-center gap-3 rounded-full bg-cream px-5 py-3">
              <Search size={18} className="shrink-0 text-green" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter a town, city, or store"
                className="w-full bg-transparent text-ink outline-none placeholder:text-ink-soft/60"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="rounded-full bg-green px-6 py-3 text-sm font-semibold uppercase tracking-wide text-cream transition-transform hover:scale-[1.03]"
              >
                Search
              </button>
              <button
                type="button"
                onClick={nearMe}
                className="inline-flex items-center gap-2 rounded-full border border-green/30 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-green transition-colors hover:bg-cream"
              >
                <LocateFixed size={16} /> Near me
              </button>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition-transform hover:scale-[1.03]"
              >
                <Package size={16} /> Find a product
              </Link>
            </div>
          </form>

          <div className="px-5 pt-3 text-sm font-medium text-ink-soft">
            {status}
          </div>

          {/* map */}
          <div ref={mapEl} className="h-[460px] w-full sm:h-[560px]" />
        </div>
      </div>
    </section>
  );
}
