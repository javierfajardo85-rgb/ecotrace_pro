"use client";

import { useEffect, useId, useMemo, useState } from "react";

type Props = {
  className?: string;
  backendUrl?: string;
  storePublicId?: string;
  weightKg?: number;
  originZip?: string;
  destinationZip?: string;
  theme?: "light" | "dark";
  variant?: "compact" | "large";
};

export function EcoTraceWidgetDemo({
  className,
  backendUrl = "https://ecotrace-gx1q.onrender.com",
  storePublicId = "demo_store",
  weightKg = 1.4,
  originZip = "28001",
  destinationZip = "08001",
  theme = "light",
  variant = "large",
}: Props) {
  const mountId = "ecotrace-widget-demo";
  const scriptId = useId();
  const [ready, setReady] = useState(false);

  const scriptSrc = useMemo(() => {
    // Served from Next public/ so it works in production deployments.
    return "/widget/widget.js";
  }, []);

  useEffect(() => {
    const mount = document.getElementById(mountId);
    if (!mount) return;

    // Clear previous mounts to avoid duplicates on hot reload.
    mount.innerHTML = "";

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.setAttribute("data-backend", backendUrl);
    script.setAttribute("data-store", storePublicId);
    script.setAttribute("data-weight", String(weightKg));
    script.setAttribute("data-origin-zip", originZip);
    script.setAttribute("data-destination-zip", destinationZip);
    script.setAttribute("data-theme", theme);
    script.dataset.instance = scriptId;

    script.onload = () => setReady(true);
    script.onerror = () => setReady(false);

    // Important: widget relies on document.currentScript, so we must append the script node itself.
    mount.appendChild(script);

    return () => {
      try {
        mount.innerHTML = "";
      } catch (_) {}
    };
  }, [backendUrl, destinationZip, originZip, scriptId, scriptSrc, storePublicId, theme, weightKg]);

  return (
    <div className={className}>
      <div
        className={
          variant === "compact"
            ? "rounded-2xl border border-slate-200 bg-white p-4 shadow-soft"
            : "rounded-3xl border border-slate-200 bg-white p-6 shadow-soft"
        }
      >
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-theme-green">Live widget demo</div>
          <div className="text-xs font-semibold text-slate-500">{ready ? "Loaded" : "Loading"}</div>
        </div>
        <div className="mt-5" id={mountId} />
      </div>
    </div>
  );
}

