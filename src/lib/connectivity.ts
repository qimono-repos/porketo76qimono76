import { useEffect, useState } from "react";

const OFFLINE_KEY = "porketo.offline-since";
const TWO_MIN = 2 * 60 * 1000;
const DAY = 24 * 60 * 60 * 1000;

function readSince(): number | null {
  try {
    const raw = localStorage.getItem(OFFLINE_KEY);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

function writeSince(value: number | null) {
  try {
    if (value == null) localStorage.removeItem(OFFLINE_KEY);
    else localStorage.setItem(OFFLINE_KEY, String(value));
  } catch {
    /* ignore quota */
  }
}

export function useConnectivity() {
  const [online, setOnline] = useState(true);
  const [offlineSince, setOfflineSince] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const apply = (next: boolean) => {
      setOnline(next);
      setNow(Date.now());
      if (next) {
        writeSince(null);
        setOfflineSince(null);
        return;
      }
      const existing = readSince();
      const since = existing ?? Date.now();
      if (existing == null) writeSince(since);
      setOfflineSince(since);
    };
    apply(navigator.onLine);
    const on = () => apply(true);
    const off = () => apply(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    const tick = window.setInterval(() => {
      apply(navigator.onLine);
    }, 4000);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
      window.clearInterval(tick);
    };
  }, []);

  const offlineFor = offlineSince && !online ? now - offlineSince : 0;
  return {
    online,
    offlineSince,
    offlineFor,
    breakdownOffline: !online && offlineFor >= TWO_MIN,
    newsArchive: !online && offlineFor >= DAY,
  };
}
