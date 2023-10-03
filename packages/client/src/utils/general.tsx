import { useMemo, useState, useEffect, useContext, createContext } from "react";
import version from "../version.json";
import useLatestRef from "./useLatestRef";
import { useTheme } from "@mui/joy";
import useMountEffect from "./useMountEffect";
import { extractMediaQuery } from "./styles";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function compact<T>(array: (T | false | null | undefined | 0)[]) {
  return array.filter(Boolean) as T[];
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait = 200
) {
  let timer: number;

  return function (...args: Parameters<T>) {
    clearTimeout(timer);
    timer = window.setTimeout(() => func(...args), wait);
  };
}

export function rgbToHex([r, g, b]: RGB) {
  //eslint-disable-next-line
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function rgbToHS([r, g, b]: RGB) {
  let computedH = 0;
  let computedS = 0;

  r = r / 255;
  g = g / 255;
  b = b / 255;

  const minRGB = Math.min(r, Math.min(g, b));
  const maxRGB = Math.max(r, Math.max(g, b));

  // Black-gray-white
  if (minRGB === maxRGB) {
    return [0, 0];
  }

  // Colors other than black-gray-white:
  const d = r === minRGB ? g - b : b === minRGB ? r - g : b - r;
  const h = r === minRGB ? 3 : b === minRGB ? 1 : 5;

  computedH = 60 * (h - d / (maxRGB - minRGB));
  computedS = 100 * ((maxRGB - minRGB) / maxRGB);

  return [computedH, computedS];
}

export function hsvToRGB(h: number, s: number, v: number) {
  h /= 360;
  s /= 100;
  v /= 100;

  let r = 0;
  let g = 0;
  let b = 0;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }

  return [r * 255, g * 255, b * 255].map(Math.round) as RGB;
}

export function saveValue(key: string, value: any) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function clearValue(key: string) {
  window.localStorage.removeItem(key);
}

export function loadValue<T>(key: string): T | undefined {
  try {
    const data = window.localStorage.getItem(key);
    return data ? JSON.parse(data) : undefined;
  } catch (_) {
    return undefined;
  }
}

export function getSearchParam(key: string) {
  const url = new URL(window.location.href);
  return url.searchParams.get(key);
}

export function setSearchParam(map: { [key: string]: any }) {
  const url = new URL(window.location.href);

  Object.keys(map).forEach((key) => {
    const value = map[key];
    if (typeof value === "undefined") {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });

  return url;
}

export function removeParamsFromUrl(keys: string[]) {
  window.history.replaceState(
    null,
    "",
    setSearchParam(
      keys.reduce((acc, key) => ({ ...acc, [key]: undefined }), {})
    ).toString()
  );
}

export async function clearAllCachesAndReload() {
  const registration = await navigator.serviceWorker?.getRegistration();

  if (registration) {
    registration.unregister();
  }

  if (window.caches) {
    await window.caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => window.caches.delete(key)));
    });
  }

  window.location.assign(setSearchParam({ reload: Date.now() }));
}

export function autoUpdater() {
  if (process.env.NODE_ENV === "development") {
    return;
  }

  console.log(`Looking for a new version, current is ${version}`);

  fetch(`./latest.json?c=${Date.now()}`)
    .then((res) => res.json())
    .catch(() => undefined)
    .then(async (latest) => {
      if (latest && latest !== version) {
        console.log(`Loading the new version ${latest}`);
        clearAllCachesAndReload();
      }
    });
}

export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T
) {
  const callbackRef = useLatestRef(callback);

  return useMemo(() => {
    return debounce((...args) => {
      callbackRef.current(...args);
    });
  }, [callbackRef]) as T;
}

export const isTouchDevice =
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0 ||
  //@ts-expect-error Bad browser typings
  navigator.msMaxTouchPoints > 0;

export function formatNumericValue(
  value: string | number,
  suffix: string,
  decimalPlaces = 1
) {
  const decimalPlacesFactor = decimalPlaces > 0 ? decimalPlaces * 10 : 1;

  const formatted = (
    Math.round(Number(value) * decimalPlacesFactor) / decimalPlacesFactor
  ).toFixed(decimalPlaces);

  return `${formatted}${suffix}`;
}

export type RGB = [number, number, number];

export function getContrastColor(color: RGB) {
  // https://stackoverflow.com/a/3943023/112731
  return color[0] * 0.299 + color[1] * 0.587 + color[2] * 0.114 > 186
    ? "#000000"
    : "#FFFFFF";
}

export function useMediaQuery(query: string) {
  const [mql] = useState(() => window.matchMedia(extractMediaQuery(query)));
  const [matches, setMatches] = useState(mql.matches);

  useMountEffect(() => {
    function update() {
      setMatches(mql.matches);
    }

    mql.addEventListener("change", update);

    return () => {
      mql.removeEventListener("change", update);
    };
  });

  return matches;
}

const ResponsiveContext = createContext<
  { isMobile: boolean; isDesktop: boolean } | undefined
>(undefined);

export function ResponsiveProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    document.body.classList.toggle("mobile", mobile);
    document.body.classList.toggle("desktop", !mobile);
  }, [mobile]);

  const value = useMemo(() => {
    return { isMobile: mobile, isDesktop: !mobile };
  }, [mobile]);

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export function useResponsive() {
  const result = useContext(ResponsiveContext);

  if (!result) {
    throw new Error("Must be called inside a ResponsiveProvider");
  }

  return result;
}

export function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export const isNewTab = getSearchParam("newTab") === "true";