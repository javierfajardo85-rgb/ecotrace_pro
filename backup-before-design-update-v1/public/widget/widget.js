(function () {
  const script = document.currentScript;
  if (!script) return;

  const backendUrl = script.getAttribute("data-backend") || "https://ecotrace-gx1q.onrender.com";
  const storePublicId = script.getAttribute("data-store") || "";
  const weightKg = parseFloat(script.getAttribute("data-weight") || "0");
  const originZip = script.getAttribute("data-origin-zip") || script.getAttribute("data-zip") || "";
  const destinationZip = script.getAttribute("data-destination-zip") || "";
  const productCategory = (script.getAttribute("data-product-category") || "general").trim().toLowerCase();

  const mount = document.getElementById("ecotrace-widget") || document.getElementById("ecotrace-widget-demo");
  if (!mount) return;

  const STYLE_TAG_ID = "ecotrace-widget-style";
  if (!document.getElementById(STYLE_TAG_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_TAG_ID;
    style.textContent = `
      :root { --et-ease: cubic-bezier(.22,1,.36,1); }
      #ecotrace-widget { font-feature-settings: "ss01" 1, "cv10" 1, "liga" 1; }
      #ecotrace-widget-demo { font-feature-settings: "ss01" 1, "cv10" 1, "liga" 1; }
      @keyframes etFadeUp { from { opacity: 0; transform: translateY(10px); filter: blur(6px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
      @keyframes etPop { 0% { transform: translateY(6px) scale(.985); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
      .et-anim-in { animation: etFadeUp .55s var(--et-ease) both; }
      .et-anim-pop { animation: etPop .45s var(--et-ease) both; }
      .et-sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
    `;
    document.head.appendChild(style);
  }

  function leafSvg() {
    return `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="h-5 w-5">
        <path
          d="M20.5 3.5C12.4 4.2 6.7 9 5 14c-1.3 3.8.8 6.5 4.4 6.5 6.7 0 11.1-6.6 11.1-17Z"
          fill="url(#etLeafFill)"
          opacity=".92"
        />
        <path
          d="M6.4 18.4c2.6-4.4 7.3-7.7 13.3-10"
          stroke="rgba(16,185,129,.85)"
          stroke-width="1.7"
          stroke-linecap="round"
        />
        <defs>
          <linearGradient id="etLeafFill" x1="6" y1="6" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <stop stop-color="#10b981" />
            <stop offset="1" stop-color="#14532d" />
          </linearGradient>
        </defs>
      </svg>
    `;
  }

  const THEME_KEY = "ecotrace_widget_theme";
  function getTheme() {
    const forced = String(script.getAttribute("data-theme") || "").toLowerCase();
    if (forced === "light" || forced === "dark") return forced;
    const stored = String(localStorage.getItem(THEME_KEY) || "").toLowerCase();
    if (stored === "light" || stored === "dark") return stored;
    return "dark";
  }

  function setTheme(next) {
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (_) {}
  }

  const initialTheme = getTheme();

  mount.innerHTML = `
    <div class="${initialTheme === "dark" ? "dark" : ""}">
      <section
        class="group relative max-w-[420px] rounded-2xl border border-white/10 bg-slate-950/75 p-4 text-slate-50 shadow-[0_30px_80px_-55px_rgba(0,0,0,.9)] backdrop-blur transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_40px_100px_-60px_rgba(16,185,129,.45)] dark:border-white/10 dark:bg-slate-950/75 dark:text-slate-50
               border-slate-900/10 bg-white/70 text-slate-900 shadow-[0_30px_80px_-55px_rgba(2,6,23,.25)] backdrop-blur
               dark:[&.et-light]:border-slate-900/10 dark:[&.et-light]:bg-white/70 dark:[&.et-light]:text-slate-900"
        role="status"
        aria-live="polite"
        data-et-card
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-3">
            <div class="mt-0.5 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-emerald-300 dark:border-white/10 dark:bg-white/5 dark:text-emerald-300
                        border-emerald-200/60 bg-white/70 text-emerald-700 dark:[&.et-light]:border-emerald-200/60 dark:[&.et-light]:bg-white/70 dark:[&.et-light]:text-emerald-700" data-et-iconwrap>
              ${leafSvg()}
            </div>
            <div class="min-w-0">
              <p class="text-xs font-semibold tracking-wide text-white/75 dark:text-white/75 text-slate-600 dark:[&.et-light]:text-slate-600">
                EcoTrace emissions
              </p>
              <h3 class="mt-1 text-sm font-semibold text-white dark:text-white text-slate-950 dark:[&.et-light]:text-slate-950">
                Shipping footprint
              </h3>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white/90 transition duration-300 ease-out hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-emerald-500/20
                     dark:border-white/10 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10
                     border-slate-900/10 bg-white/70 text-slate-800 hover:bg-white focus:ring-emerald-600/20 dark:[&.et-light]:border-slate-900/10 dark:[&.et-light]:bg-white/70 dark:[&.et-light]:text-slate-800"
              aria-label="Toggle theme"
              aria-pressed="${initialTheme === "light" ? "true" : "false"}"
              data-et-theme
            >
              <span class="et-sr-only">Theme</span>
              <span class="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(16,185,129,.16)]"></span>
              <span data-et-theme-label>${initialTheme === "dark" ? "Dark" : "Light"}</span>
            </button>
          </div>
        </div>

        <div class="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 dark:border-white/10 dark:bg-white/5
                    border-slate-900/10 bg-white/60 dark:[&.et-light]:border-slate-900/10 dark:[&.et-light]:bg-white/60">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="text-xs font-semibold uppercase tracking-wide text-white/60 dark:text-white/60 text-slate-600 dark:[&.et-light]:text-slate-600">CO₂e</div>
              <div class="mt-2 text-3xl font-semibold tracking-tight text-white dark:text-white text-slate-950 dark:[&.et-light]:text-slate-950" data-et-value>
                —
              </div>
              <div class="mt-1 text-xs text-white/60 dark:text-white/60 text-slate-600 dark:[&.et-light]:text-slate-600" data-et-sub>
                Calculating…
              </div>
            </div>

            <div class="flex flex-col items-end gap-2">
              <span class="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200 dark:border-emerald-400/25 dark:bg-emerald-500/10 dark:text-emerald-200
                           border-emerald-700/20 bg-emerald-600/10 text-emerald-800 dark:[&.et-light]:border-emerald-700/20 dark:[&.et-light]:bg-emerald-600/10 dark:[&.et-light]:text-emerald-800">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                Powered by EcoTrace
              </span>

              <div class="relative">
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 transition duration-300 ease-out hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-emerald-500/20
                         dark:border-white/10 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10
                         border-slate-900/10 bg-white/70 text-slate-800 hover:bg-white focus:ring-emerald-600/20 dark:[&.et-light]:border-slate-900/10 dark:[&.et-light]:bg-white/70 dark:[&.et-light]:text-slate-800"
                  aria-describedby="et-tip"
                  aria-label="How this is calculated"
                  data-et-tip-btn
                >
                  <span class="text-emerald-300 dark:text-emerald-300 text-emerald-700 dark:[&.et-light]:text-emerald-700">i</span>
                  Method
                </button>

                <div
                  id="et-tip"
                  role="tooltip"
                  class="pointer-events-none absolute right-0 top-11 z-50 w-72 origin-top-right rounded-2xl border border-white/10 bg-slate-950/85 p-3 text-xs leading-5 text-white/80 shadow-[0_30px_80px_-55px_rgba(0,0,0,.95)] backdrop-blur opacity-0 transition duration-200 ease-out
                         dark:border-white/10 dark:bg-slate-950/85 dark:text-white/80
                         border-slate-900/10 bg-white/90 text-slate-700 dark:[&.et-light]:border-slate-900/10 dark:[&.et-light]:bg-white/90 dark:[&.et-light]:text-slate-700"
                  data-et-tip
                >
                  <div class="font-semibold text-white dark:text-white text-slate-900 dark:[&.et-light]:text-slate-900">Audit-ready estimate</div>
                  <div class="mt-1">
                    Source: <span class="font-semibold" data-et-source>—</span> · Distance: <span class="font-semibold" data-et-distance>—</span>
                  </div>
                  <div class="mt-2 text-white/70 dark:text-white/70 text-slate-600 dark:[&.et-light]:text-slate-600">
                    EcoTrace stores inputs, emission factor source, and assumptions per transaction for transparency.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 border-t border-white/10 pt-4 dark:border-white/10 border-slate-900/10 dark:[&.et-light]:border-slate-900/10" hidden data-et-offset-wrap>
          <label class="flex cursor-pointer items-start gap-3">
            <input
              id="et-offset"
              type="checkbox"
              class="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 text-emerald-500 transition duration-300 ease-out focus:ring-4 focus:ring-emerald-500/20 dark:border-white/20 dark:bg-white/10
                     border-slate-900/20 bg-white text-emerald-600 focus:ring-emerald-600/20 dark:[&.et-light]:border-slate-900/20 dark:[&.et-light]:bg-white dark:[&.et-light]:text-emerald-600"
              aria-label="Neutralize this shipment"
            />
            <div class="min-w-0">
              <div class="text-sm font-semibold text-white dark:text-white text-slate-950 dark:[&.et-light]:text-slate-950">
                Neutralize this shipment
              </div>
              <div class="mt-1 text-sm text-white/70 dark:text-white/70 text-slate-600 dark:[&.et-light]:text-slate-600">
                Add <span class="font-semibold" data-et-offset-fee>—</span> (compensation + EcoTrace service, itemised in API).
              </div>
              <div class="mt-3" data-et-neutral-badge hidden>
                <span class="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200 dark:border-emerald-400/25 dark:bg-emerald-500/10 dark:text-emerald-200
                             border-emerald-700/20 bg-emerald-600/10 text-emerald-800 dark:[&.et-light]:border-emerald-700/20 dark:[&.et-light]:bg-emerald-600/10 dark:[&.et-light]:text-emerald-800">
                  <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  Carbon neutralized
                </span>
              </div>
            </div>
          </label>
        </div>
      </section>
    </div>
  `;

  const root = mount.firstElementChild;
  const card = mount.querySelector("[data-et-card]");
  const themeBtn = mount.querySelector("[data-et-theme]");
  const themeLabel = mount.querySelector("[data-et-theme-label]");
  const valueEl = mount.querySelector("[data-et-value]");
  const subEl = mount.querySelector("[data-et-sub]");
  const offsetWrap = mount.querySelector("[data-et-offset-wrap]");
  const neutralBadge = mount.querySelector("[data-et-neutral-badge]");
  const tipBtn = mount.querySelector("[data-et-tip-btn]");
  const tip = mount.querySelector("[data-et-tip]");
  const tipSource = mount.querySelector("[data-et-source]");
  const tipDistance = mount.querySelector("[data-et-distance]");

  function applyTheme(theme) {
    if (theme === "dark") {
      root.classList.add("dark");
      card.classList.remove("et-light");
    } else {
      root.classList.remove("dark");
      card.classList.add("et-light");
    }
    themeLabel.textContent = theme === "dark" ? "Dark" : "Light";
    themeBtn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    setTheme(theme);
  }

  themeBtn.addEventListener("click", function () {
    const next = root.classList.contains("dark") ? "light" : "dark";
    applyTheme(next);
  });

  function showTip() {
    tip.classList.remove("pointer-events-none", "opacity-0");
    tip.classList.add("opacity-100");
  }
  function hideTip() {
    tip.classList.add("pointer-events-none", "opacity-0");
    tip.classList.remove("opacity-100");
  }
  tipBtn.addEventListener("mouseenter", showTip);
  tipBtn.addEventListener("mouseleave", hideTip);
  tipBtn.addEventListener("focus", showTip);
  tipBtn.addEventListener("blur", hideTip);

  applyTheme(initialTheme);

  if (!storePublicId || !originZip || !destinationZip || !weightKg) {
    const msg =
      "Missing attributes. Provide data-store, data-weight, data-origin-zip and data-destination-zip on the script tag.";
    subEl.textContent = msg;
    card.classList.add("border-red-500/30");
    return;
  }

  fetch(`${backendUrl.replace(/\/$/, "")}/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      store_public_id: storePublicId,
      origin_zip: originZip,
      destination_zip: destinationZip,
      weight_kg: weightKg,
      vehicle_type: "truck",
      primary_category: productCategory,
      is_offset_purchased: false,
    }),
  })
    .then(async (r) => {
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.detail || "Request failed");
      return data;
    })
    .then((data) => {
      const co2 = Number(data.co2_kg || 0);
      const co2Ida = Number(data.co2_ida_kg != null ? data.co2_ida_kg : co2);
      const co2Ret = Number(data.co2_returns_estimated_kg || 0);
      const distanceKm = Number(data.distance_km || 0);
      const source = String(data.source || "fallback");
      const totalFee = Number(data.total_tasa_cliente || 0);
      const feeEl = mount.querySelector("[data-et-offset-fee]");
      if (feeEl) feeEl.textContent = `€${totalFee.toFixed(2)}`;

      valueEl.textContent = `${co2.toFixed(2)} kg CO₂e`;
      subEl.textContent = `Outbound ${co2Ida.toFixed(2)} kg + expected returns ${co2Ret.toFixed(2)} kg. Audited.`;
      valueEl.classList.add("et-anim-pop");
      subEl.classList.add("et-anim-in");

      tipSource.textContent = source;
      tipDistance.textContent = `${distanceKm.toFixed(1)} km`;

      offsetWrap.hidden = false;

      const checkbox = mount.querySelector("#et-offset");

      function emit(checked) {
        window.dispatchEvent(
          new CustomEvent("ecotrace:offset-change", {
            detail: {
              store_public_id: storePublicId,
              is_offset_purchased: Boolean(checked),
              offset_fee_eur: totalFee,
              tasa_compensation_eur: Number(data.tasa_1_eur || 0),
              tasa_service_eur: Number(data.tasa_2_eur || 0),
              co2_kg: Number(data.co2_kg || 0),
              co2_ida_kg: Number(data.co2_ida_kg != null ? data.co2_ida_kg : data.co2_kg || 0),
              co2_returns_estimated_kg: Number(data.co2_returns_estimated_kg || 0),
              distance_km: Number(data.distance_km || 0),
            },
          })
        );
      }

      checkbox.addEventListener("change", function () {
        neutralBadge.hidden = !checkbox.checked;
        emit(checkbox.checked);
      });

      emit(false);
    })
    .catch((e) => {
      subEl.textContent = `EcoTrace unavailable: ${e.message}`;
      card.classList.add("border-red-500/30");
    });
})();

