"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin, Search } from "lucide-react";
import {
  searchNzAddresses,
  MIN_QUERY_LENGTH,
  type AddressSuggestion,
} from "@/lib/address-search";

/** Long enough that a typist isn't sending a lookup per keystroke. */
const DEBOUNCE_MS = 400;

/**
 * Type an address, pick it off the list, and the delivery fields fill
 * themselves in. It is a shortcut, never a gate: every field it fills stays
 * editable, and an address the geocoder has never heard of can still be typed
 * out by hand underneath.
 */
export function AddressSearch({
  onPick,
}: {
  onPick: (address: AddressSuggestion) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AddressSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  // Too short to be worth asking about. Nothing is cleared here — what's
  // rendered is derived from the query below, so stale matches can't show.
  const longEnough = query.trim().length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    const q = query.trim();
    if (q.length < MIN_QUERY_LENGTH) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const found = await searchNzAddresses(q, controller.signal);
        setResults(found);
        setActive(-1);
        setOpen(true);
      } catch (err) {
        // An abort is just the next keystroke arriving. Anything else means
        // the lookup is unavailable — the fields below still work.
        if (!controller.signal.aborted) {
          console.error("[checkout] address lookup failed:", err);
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  // A click anywhere else means they are done with the list.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function choose(suggestion: AddressSuggestion) {
    onPick(suggestion);
    setQuery("");
    setResults([]);
    setOpen(false);
    setActive(-1);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open || results.length === 0) return;

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((prev) => (prev + step + results.length) % results.length);
    } else if (e.key === "Enter" && active >= 0) {
      // Only swallow Enter when a suggestion is highlighted, so it still
      // submits the form the rest of the time.
      e.preventDefault();
      choose(results[active]);
    }
  }

  const showList = open && longEnough && results.length > 0;

  return (
    <div ref={boxRef} className="relative">
      <label
        htmlFor="address-search"
        className="mb-1.5 block text-sm font-semibold text-ink"
      >
        Find your address
        <span className="ml-1.5 font-normal text-ink-soft">(optional)</span>
      </label>

      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-green"
        />
        <input
          id="address-search"
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls="address-search-results"
          aria-autocomplete="list"
          aria-activedescendant={
            active >= 0 ? `address-search-option-${active}` : undefined
          }
          aria-describedby="address-search-hint"
          autoComplete="off"
          value={query}
          placeholder="Start typing a street address…"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="w-full rounded-xl border border-line bg-cream py-3 pl-10 pr-10 text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-green"
        />
        {searching && longEnough && (
          <Loader2
            size={16}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-green/60"
          />
        )}
      </div>

      <p id="address-search-hint" className="mt-1.5 text-xs text-ink-soft">
        Or just fill the fields in below.
      </p>

      {showList && (
        <ul
          id="address-search-results"
          role="listbox"
          aria-label="Matching addresses"
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-line bg-paper shadow-xl"
        >
          {results.map((result, i) => (
            <li
              key={result.label}
              id={`address-search-option-${i}`}
              role="option"
              aria-selected={i === active}
              // Pointer-down rather than click: a click would land after the
              // input's blur had already closed the list out from under it.
              onPointerDown={(e) => {
                e.preventDefault();
                choose(result);
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-start gap-2.5 px-4 py-3 text-left text-sm transition-colors ${
                i === active ? "bg-cream text-ink" : "text-ink-soft"
              }`}
            >
              <MapPin size={15} className="mt-0.5 shrink-0 text-coral" />
              <span className="line-clamp-2">{result.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
