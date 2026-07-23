"use client";

import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  LocateFixed,
  X,
  MapPin,
  Navigation,
  Clock,
  Store as StoreIcon,
  SlidersHorizontal,
  List,
  Map as MapIcon,
  Loader2,
} from "lucide-react";
import { BANNERS, type Store, type StoreData } from "@/lib/stores";

/* eslint-disable @typescript-eslint/no-explicit-any */

const BANNER_COLOR = Object.fromEntries(
  BANNERS.map((b) => [b.name, b.color])
) as Record<string, string>;

const NZ_CENTER: [number, number] = [-41.0, 173.5];

type Center = { lat: number; lng: number; label: string };
type Suggestion = { label: string; lat: number; lng: number };

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) *
      Math.cos((bLat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );

function pinSvg(color: string, dimmed = false) {
  return `<span style="display:block;width:26px;height:26px;border-radius:50% 50% 50% 0;background:${color};border:2.5px solid #fffdf7;transform:rotate(-45deg);box-shadow:0 6px 14px rgba(20,66,44,.35);opacity:${
    dimmed ? 0.5 : 1
  }"><span style="position:absolute;top:8px;left:8px;width:8px;height:8px;border-radius:50%;background:#fffdf7"></span></span>`;
}

function popupHtml(store: Store, dist: number | null, origin: Center | null) {
  const dest = `${store.lat},${store.lng}`;
  const directions = `https://www.google.com/maps/dir/?api=1${
    origin ? `&origin=${origin.lat},${origin.lng}` : ""
  }&destination=${dest}&travelmode=driving`;

  const products = store.products.length
    ? `<div class="af-pop-sec"><span class="af-pop-label">Stocks ${store.products.length} product${
        store.products.length > 1 ? "s" : ""
      }</span><div class="af-pop-chips">${store.products
        .map((p) => `<span class="af-pop-chip">${escapeHtml(p)}</span>`)
        .join("")}</div></div>`
    : "";

  return `
    <div class="af-pop">
      <span class="af-pop-banner" style="background:${BANNER_COLOR[store.banner]}">${escapeHtml(
        store.banner
      )}</span>
      <h3 class="af-pop-title">${escapeHtml(store.name)}</h3>
      <p class="af-pop-addr">${escapeHtml(store.address)}</p>
      ${store.hours ? `<p class="af-pop-hours">${escapeHtml(store.hours)}</p>` : ""}
      ${dist !== null ? `<p class="af-pop-dist">${dist.toFixed(1)} km away</p>` : ""}
      ${products}
      <a class="af-pop-btn" href="${directions}" target="_blank" rel="noopener noreferrer">Get directions</a>
    </div>`;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function StoreLocator({ data }: { data: StoreData }) {
  const { stores, products, regions } = data;

  /* ---------------- filter state ---------------- */
  const [query, setQuery] = useState("");
  const [banners, setBanners] = useState<string[]>([]);
  const [product, setProduct] = useState("");
  const [region, setRegion] = useState("");
  const [radius, setRadius] = useState(25);
  const [center, setCenter] = useState<Center | null>(null);
  const [notice, setNotice] = useState("");
  const [locating, setLocating] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const [visible, setVisible] = useState(40);

  /* ---------------- geocode autocomplete ---------------- */
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);

  /* ---------------- map refs ---------------- */
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const clusterLayer = useRef<any>(null);
  const overlayLayer = useRef<any>(null);
  const [ready, setReady] = useState(false);

  /* ---------------- derived: filtered + sorted ---------------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = stores.filter((s) => {
      if (banners.length && !banners.includes(s.banner)) return false;
      if (product && !s.products.includes(product)) return false;
      if (region && s.region !== region) return false;
      if (
        q &&
        !s.name.toLowerCase().includes(q) &&
        !s.address.toLowerCase().includes(q) &&
        !s.postcode.includes(q) &&
        !s.region.toLowerCase().includes(q)
      )
        return false;
      if (center && distanceKm(center.lat, center.lng, s.lat, s.lng) > radius)
        return false;
      return true;
    });

    if (center) {
      return list
        .map((s) => ({ s, d: distanceKm(center.lat, center.lng, s.lat, s.lng) }))
        .sort((a, b) => a.d - b.d)
        .map(({ s, d }) => ({ store: s, dist: d }));
    }
    return list.map((s) => ({ store: s, dist: null as number | null }));
  }, [stores, query, banners, product, region, center, radius]);

  // Reset pagination when the filters change. Adjusting state during render is
  // React's documented alternative to a reset-in-effect.
  const filterKey = `${query}|${banners.join()}|${product}|${region}|${center?.lat ?? ""},${center?.lng ?? ""}|${radius}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setVisible(40);
  }

  const activeFilters =
    (query ? 1 : 0) + banners.length + (product ? 1 : 0) + (region ? 1 : 0) + (center ? 1 : 0);

  /** Suggestions for a query the user has since shortened are stale — drop them. */
  const shownSuggestions = query.trim().length >= 3 ? suggestions : [];

  /* ---------------- init map ---------------- */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapEl.current || mapRef.current) return;
      LRef.current = L;

      const map = L.map(mapEl.current, {
        scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: true,
      }).setView(NZ_CENTER, 5);
      mapRef.current = map;

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        }
      ).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);
      map.on("click", () => setShowSuggest(false));

      clusterLayer.current = L.layerGroup().addTo(map);
      overlayLayer.current = L.layerGroup().addTo(map);

      setReady(true);
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      setReady(false);
    };
  }, []);

  /* ---------------- open a store popup ---------------- */
  const openStore = useCallback(
    (store: Store, dist: number | null, fly = true) => {
      const L = LRef.current;
      const map = mapRef.current;
      if (!L || !map) return;

      if (fly) map.flyTo([store.lat, store.lng], Math.max(map.getZoom(), 14), { duration: 0.8 });

      L.popup({
        className: "af-popup",
        maxWidth: 360,
        minWidth: 272,
        autoPanPadding: [24, 24],
        offset: [0, -18],
      })
        .setLatLng([store.lat, store.lng])
        .setContent(popupHtml(store, dist, center))
        .openOn(map);

      setMobileView("map");
    },
    [center]
  );

  /* ---------------- render markers + clusters ---------------- */
  const draw = useCallback(() => {
    const L = LRef.current;
    const map = mapRef.current;
    const layer = clusterLayer.current;
    if (!L || !map || !layer) return;

    layer.clearLayers();

    // Grid-cluster in screen space so dense cities stay legible.
    const CELL = 62;
    const cells = new Map<string, { items: typeof filtered; x: number; y: number }>();

    for (const entry of filtered) {
      const pt = map.latLngToContainerPoint([entry.store.lat, entry.store.lng]);
      const key = `${Math.floor(pt.x / CELL)}:${Math.floor(pt.y / CELL)}`;
      const cell = cells.get(key);
      if (cell) {
        cell.items.push(entry);
      } else {
        cells.set(key, { items: [entry], x: pt.x, y: pt.y });
      }
    }

    for (const cell of cells.values()) {
      if (cell.items.length === 1) {
        const { store, dist } = cell.items[0];
        L.marker([store.lat, store.lng], {
          icon: L.divIcon({
            className: "af-pin",
            html: pinSvg(BANNER_COLOR[store.banner] ?? "#2c7a4f"),
            iconSize: [26, 26],
            iconAnchor: [13, 26],
          }),
          title: store.name,
          riseOnHover: true,
        })
          .on("click", () => openStore(store, dist, false))
          .addTo(layer);
        continue;
      }

      // Cluster bubble at the group's average position.
      const lat =
        cell.items.reduce((t, e) => t + e.store.lat, 0) / cell.items.length;
      const lng =
        cell.items.reduce((t, e) => t + e.store.lng, 0) / cell.items.length;
      const n = cell.items.length;
      const size = n > 50 ? 56 : n > 15 ? 48 : 40;

      L.marker([lat, lng], {
        icon: L.divIcon({
          className: "af-cluster",
          html: `<span style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:9999px;background:rgba(20,66,44,.92);color:#f6efe1;font-weight:700;font-size:${
            n > 99 ? 13 : 15
          }px;border:3px solid #fffdf7;box-shadow:0 8px 20px rgba(20,66,44,.35)">${n}</span>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        }),
      })
        .on("click", () => {
          map.flyTo([lat, lng], Math.min(map.getZoom() + 3, 16), { duration: 0.7 });
        })
        .addTo(layer);
    }
  }, [filtered, openStore]);

  useEffect(() => {
    if (!ready) return;
    draw();
    const map = mapRef.current;
    map.on("zoomend moveend", draw);
    return () => {
      map?.off("zoomend moveend", draw);
    };
  }, [ready, draw]);

  /* ---------------- centre marker + radius ring ---------------- */
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    const layer = overlayLayer.current;
    if (!ready || !L || !map || !layer) return;

    layer.clearLayers();
    if (!center) return;

    L.circle([center.lat, center.lng], {
      radius: radius * 1000,
      color: "#14422c",
      weight: 1.5,
      opacity: 0.5,
      fillColor: "#2c7a4f",
      fillOpacity: 0.07,
    }).addTo(layer);

    L.marker([center.lat, center.lng], {
      icon: L.divIcon({
        className: "af-me",
        html: `<span style="display:block;width:18px;height:18px;border-radius:9999px;background:#e16348;border:3px solid #fffdf7;box-shadow:0 0 0 6px rgba(225,99,72,.22)"></span>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      }),
      zIndexOffset: 1000,
    })
      .bindTooltip(center.label, { direction: "top", offset: [0, -12] })
      .addTo(layer);
  }, [ready, center, radius]);

  /* ---------------- fit bounds when results change ---------------- */
  const fitKey = `${filtered.length}:${center?.lat ?? ""}:${radius}:${product}:${region}:${banners.join()}`;
  const lastFit = useRef("");
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!ready || !L || !map || lastFit.current === fitKey) return;
    lastFit.current = fitKey;

    if (center) {
      // NB: L.circle(...).getBounds() reads `this._map`, so it throws for a
      // circle that was never added to the map. LatLng.toBounds needs no map;
      // it takes the full box size, hence radius * 2.
      map.flyToBounds(L.latLng(center.lat, center.lng).toBounds(radius * 2000), {
        duration: 0.8,
        maxZoom: 14,
      });
    } else if (filtered.length) {
      map.flyToBounds(
        L.latLngBounds(filtered.map((e) => [e.store.lat, e.store.lng])).pad(0.12),
        { duration: 0.8, maxZoom: 13 }
      );
    }
  }, [ready, fitKey, center, radius, filtered]);

  /* ---------------- geocoding (Nominatim, same as the Angular app) ---------------- */
  useEffect(() => {
    const q = query.trim();
    // Anything shorter isn't worth a geocode round-trip; stale results are
    // filtered out at render time rather than cleared from here.
    if (q.length < 3) return;

    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const params = new URLSearchParams({
          format: "json",
          addressdetails: "1",
          countrycodes: "nz",
          limit: "6",
          "accept-language": "en",
        });
        if (/^\d{3,4}$/.test(q)) params.set("postalcode", q);
        else params.set("q", q);

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?${params}`,
          { signal: ctrl.signal }
        );
        const json = (await res.json()) as any[];
        setSuggestions(
          json.map((r) => ({
            label: r.display_name as string,
            lat: parseFloat(r.lat),
            lng: parseFloat(r.lon),
          }))
        );
      } catch {
        /* aborted or offline — the text filter still works */
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => {
      ctrl.abort();
      clearTimeout(timer);
    };
  }, [query]);

  /* ---------------- actions ---------------- */
  function pickSuggestion(s: Suggestion) {
    setCenter({ lat: s.lat, lng: s.lng, label: s.label.split(",")[0] });
    setQuery("");
    setSuggestions([]);
    setShowSuggest(false);
    setNotice("");
    if (radius > 50) setRadius(25);
  }

  function nearMe() {
    if (!navigator.geolocation) {
      setNotice("Your browser doesn't support location sharing.");
      return;
    }
    setLocating(true);
    setNotice("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setCenter({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: "Your location",
        });
        setQuery("");
        setRadius(25);
      },
      (err) => {
        setLocating(false);
        setNotice(
          err.code === err.PERMISSION_DENIED
            ? "Location access denied — try searching a town instead."
            : "Couldn't get your location — try searching a town instead."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function clearAll() {
    setQuery("");
    setBanners([]);
    setProduct("");
    setRegion("");
    setCenter(null);
    setRadius(25);
    setNotice("");
  }

  const toggleBanner = (name: string) =>
    setBanners((prev) =>
      prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name]
    );

  /* ---------------- render ---------------- */
  return (
    <section className="bg-cream pb-24 sm:pb-28">
      <div className="mx-auto max-w-[100rem] px-5 sm:px-8">
        {!data.ok && (
          <p className="mb-6 rounded-2xl border border-coral/30 bg-coral/10 px-5 py-4 text-sm font-medium text-ink">
            We couldn&apos;t reach the stockist service just now. Please try again
            shortly, or <a className="underline" href="/contact">get in touch</a>.
          </p>
        )}

        {/* `isolate` traps the map's and the overlays' z-index inside this card
            so nothing paints over the fixed navbar while scrolling. */}
        <div className="isolate overflow-hidden rounded-[2rem] border border-line bg-paper shadow-[0_30px_80px_-40px_rgba(20,66,44,0.4)]">
          {/* ---------- mobile view switch ---------- */}
          <div className="flex gap-2 border-b border-line p-3 lg:hidden">
            {(["list", "map"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setMobileView(v)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors ${
                  mobileView === v
                    ? "bg-green text-cream"
                    : "bg-cream text-ink-soft"
                }`}
              >
                {v === "list" ? <List size={16} /> : <MapIcon size={16} />}
                {v === "list" ? "Stores" : "Map"}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-[minmax(0,26rem)_1fr] xl:grid-cols-[minmax(0,30rem)_1fr]">
            {/* ============ LEFT: filters + results ============ */}
            <aside
              className={`flex min-w-0 flex-col border-line lg:border-r ${
                mobileView === "list" ? "" : "hidden lg:flex"
              }`}
            >
              {/* -- search -- */}
              <div className="border-b border-line p-4 sm:p-5">
                <div className="relative">
                  <div className="flex items-center gap-3 rounded-full bg-cream px-5 py-3.5">
                    <Search size={18} className="shrink-0 text-green" />
                    <input
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggest(true);
                      }}
                      onFocus={() => setShowSuggest(true)}
                      placeholder="Search a town, suburb or postcode"
                      className="w-full bg-transparent text-ink outline-none placeholder:text-ink-soft/60"
                    />
                    {searching && (
                      <Loader2 size={16} className="shrink-0 animate-spin text-green/60" />
                    )}
                    {query && !searching && (
                      <button
                        onClick={() => {
                          setQuery("");
                          setSuggestions([]);
                        }}
                        aria-label="Clear search"
                        className="shrink-0 text-ink-soft/60 hover:text-ink"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {showSuggest && shownSuggestions.length > 0 && (
                    <ul className="absolute z-[1200] mt-2 w-full overflow-hidden rounded-2xl border border-line bg-paper shadow-xl">
                      {shownSuggestions.map((s, i) => (
                        <li key={i}>
                          <button
                            onClick={() => pickSuggestion(s)}
                            className="flex w-full items-start gap-2.5 px-4 py-3 text-left text-sm text-ink-soft transition-colors hover:bg-cream"
                          >
                            <MapPin size={15} className="mt-0.5 shrink-0 text-coral" />
                            <span className="line-clamp-2">{s.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={nearMe}
                    disabled={locating}
                    className="inline-flex items-center gap-2 rounded-full bg-green px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-cream transition-transform hover:scale-[1.03] disabled:opacity-60"
                  >
                    {locating ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <LocateFixed size={15} />
                    )}
                    Near me
                  </button>
                  {activeFilters > 0 && (
                    <button
                      onClick={clearAll}
                      className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-ink-soft transition-colors hover:bg-cream"
                    >
                      <X size={15} /> Clear ({activeFilters})
                    </button>
                  )}
                </div>

                {notice && (
                  <p className="mt-3 text-sm font-medium text-coral">{notice}</p>
                )}
              </div>

              {/* -- filters -- */}
              <div className="space-y-4 border-b border-line p-4 sm:p-5">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-green">
                  <SlidersHorizontal size={14} /> Filter
                </p>

                {/* banner chips */}
                <div className="flex flex-wrap gap-2">
                  {BANNERS.map((b) => {
                    const on = banners.includes(b.name);
                    return (
                      <button
                        key={b.id}
                        onClick={() => toggleBanner(b.name)}
                        aria-pressed={on}
                        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition-all ${
                          on
                            ? "border-transparent text-cream shadow-sm"
                            : "border-line bg-paper text-ink-soft hover:bg-cream"
                        }`}
                        style={on ? { background: b.color } : undefined}
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: on ? "#fffdf7" : b.color }}
                        />
                        {b.name}
                      </button>
                    );
                  })}
                </div>

                {/* product + region */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
                      Product
                    </span>
                    <select
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      className="w-full rounded-xl border border-line bg-cream px-3.5 py-2.5 text-sm text-ink outline-none focus:border-green"
                    >
                      <option value="">Any product</option>
                      {products.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
                      Region
                    </span>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full rounded-xl border border-line bg-cream px-3.5 py-2.5 text-sm text-ink outline-none focus:border-green"
                    >
                      <option value="">All of Aotearoa</option>
                      {regions.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {/* radius */}
                <div className={center ? "" : "opacity-45"}>
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                      Within
                    </span>
                    <span className="text-sm font-bold text-green">{radius} km</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={200}
                    step={1}
                    value={radius}
                    disabled={!center}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="af-range w-full"
                  />
                  <p className="mt-1.5 text-xs text-ink-soft/70">
                    {center
                      ? `of ${center.label}`
                      : "Pick a location or tap “Near me” to filter by distance"}
                  </p>
                </div>
              </div>

              {/* -- results -- */}
              <div className="flex items-center justify-between px-4 py-3 sm:px-5">
                <p className="text-sm font-bold text-ink">
                  {filtered.length}{" "}
                  <span className="font-medium text-ink-soft">
                    {filtered.length === 1 ? "stockist" : "stockists"}
                  </span>
                </p>
                {center && (
                  <p className="text-xs font-medium text-ink-soft">
                    nearest first
                  </p>
                )}
              </div>

              <div className="max-h-[34rem] flex-1 overflow-y-auto border-t border-line lg:max-h-[38rem]">
                {filtered.length === 0 ? (
                  <div className="px-5 py-14 text-center">
                    <StoreIcon size={28} className="mx-auto mb-3 text-line" />
                    <p className="font-semibold text-ink">No stockists match</p>
                    <p className="mt-1 text-sm text-ink-soft">
                      Try widening the radius or clearing a filter.
                    </p>
                    {activeFilters > 0 && (
                      <button
                        onClick={clearAll}
                        className="mt-4 rounded-full bg-green px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-cream"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <ul className="divide-y divide-line">
                      {filtered.slice(0, visible).map(({ store, dist }) => (
                        <li key={store.id}>
                          <button
                            onClick={() => openStore(store, dist)}
                            className="group flex w-full items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-cream sm:px-5"
                          >
                            <span
                              className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{ background: BANNER_COLOR[store.banner] }}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block font-semibold text-ink group-hover:text-green">
                                {store.name}
                              </span>
                              <span className="mt-0.5 block text-sm text-ink-soft">
                                {store.address}
                              </span>
                              <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft/80">
                                {store.hours && (
                                  <span className="inline-flex items-center gap-1">
                                    <Clock size={12} /> {store.hours}
                                  </span>
                                )}
                                {store.products.length > 0 && (
                                  <span className="inline-flex items-center gap-1">
                                    <StoreIcon size={12} /> {store.products.length} product
                                    {store.products.length > 1 ? "s" : ""}
                                  </span>
                                )}
                              </span>
                            </span>
                            {dist !== null && (
                              <span className="shrink-0 rounded-full bg-cream px-2.5 py-1 text-xs font-bold text-green">
                                {dist < 10 ? dist.toFixed(1) : Math.round(dist)} km
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                    {visible < filtered.length && (
                      <div className="p-4 text-center">
                        <button
                          onClick={() => setVisible((v) => v + 60)}
                          className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-green transition-colors hover:bg-cream"
                        >
                          Show more ({filtered.length - visible} left)
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </aside>

            {/* ============ RIGHT: map ============ */}
            <div
              className={`relative min-w-0 ${
                mobileView === "map" ? "" : "hidden lg:block"
              }`}
            >
              <div
                ref={mapEl}
                className="h-[30rem] w-full bg-cream-deep sm:h-[36rem] lg:h-full lg:min-h-[46rem]"
              />

              {/* legend */}
              <div className="pointer-events-none absolute left-3 top-3 z-[500] rounded-2xl border border-line/70 bg-paper/92 px-3.5 py-2.5 shadow-lg backdrop-blur-sm">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft">
                  Stocked at
                </p>
                <ul className="space-y-1">
                  {BANNERS.map((b) => (
                    <li key={b.id} className="flex items-center gap-2 text-xs font-medium text-ink">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: b.color }}
                      />
                      {b.name}
                    </li>
                  ))}
                </ul>
              </div>

              {center && (
                <button
                  onClick={() => {
                    const map = mapRef.current;
                    if (map) map.flyTo([center.lat, center.lng], 12, { duration: 0.7 });
                  }}
                  className="absolute right-3 top-3 z-[500] inline-flex items-center gap-2 rounded-full bg-paper/92 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-green shadow-lg backdrop-blur-sm transition-colors hover:bg-paper"
                >
                  <Navigation size={14} /> Recentre
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-ink-soft/70">
          Stockist list updates hourly from Angel Food&apos;s live store data
          {data.skipped > 0 && ` · ${data.skipped} stores hidden pending location details`}.
          Ranges are straight-line distances — always call ahead for stock.
        </p>
      </div>
    </section>
  );
}
