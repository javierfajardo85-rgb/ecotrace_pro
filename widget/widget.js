(function () {
  const script = document.currentScript;
  if (!script) return;

  const backendUrl = script.getAttribute("data-backend") || "http://127.0.0.1:8000";
  const storePublicId = script.getAttribute("data-store") || "";
  const weightKg = parseFloat(script.getAttribute("data-weight") || "0");
  const originZip = script.getAttribute("data-origin-zip") || script.getAttribute("data-zip") || "";
  const destinationZip = script.getAttribute("data-destination-zip") || "";
  const offsetFeeEur = 0.5;

  const mount = document.getElementById("ecotrace-widget");
  if (!mount) return;

  const styles = `
    .et-card{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;display:flex;gap:10px;align-items:flex-start;
      border:1px solid rgba(16,185,129,.35);background:linear-gradient(180deg, rgba(16,185,129,.10), rgba(16,185,129,.06));
      padding:14px 14px;border-radius:14px;color:#064e3b;max-width:380px;box-shadow:0 18px 40px -30px rgba(0,0,0,.35)}
    .et-icon{width:22px;height:22px;flex:0 0 auto;margin-top:2px;transform-origin:50% 50%}
    .et-pulse{animation:etPulse 1.9s ease-in-out infinite}
    @keyframes etPulse{0%,100%{transform:scale(1);filter:drop-shadow(0 0 0 rgba(16,185,129,0))}
      50%{transform:scale(1.06);filter:drop-shadow(0 6px 10px rgba(16,185,129,.25))}}
    .et-title{font-size:13px;font-weight:700;line-height:1.2;margin:0}
    .et-row{font-size:13px;line-height:1.35;margin:2px 0 0 0}
    .et-co2{font-weight:800}
    .et-muted{opacity:.85}
    .et-tip{position:relative;display:inline-block;margin-left:6px;cursor:help}
    .et-tip > span{border-bottom:1px dotted rgba(6,78,59,.6)}
    .et-tip:hover .et-pop{display:block}
    .et-pop{display:none;position:absolute;z-index:9999;left:0;top:18px;width:260px;padding:10px 10px;border-radius:10px;
      border:1px solid rgba(6,78,59,.25);background:#fff;color:#064e3b;box-shadow:0 10px 30px rgba(0,0,0,.12);font-size:12px;line-height:1.35}
    .et-err{border-color:rgba(220,38,38,.4);background:rgba(220,38,38,.06);color:#7f1d1d}
    .et-offset{margin-top:10px;border-top:1px solid rgba(6,95,70,.18);padding-top:10px}
    .et-check{display:flex;gap:10px;align-items:flex-start}
    .et-check input{margin-top:2px;accent-color:#10b981}
    .et-sub{font-size:12px;line-height:1.35;color:rgba(6,78,59,.86);margin-top:6px}
    .et-badge{display:none;margin-top:10px}
    .et-badge span{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:800;
      background:linear-gradient(180deg, rgba(16,185,129,.18), rgba(16,185,129,.10));border:1px solid rgba(16,185,129,.35);color:#064e3b}
    .et-badge i{display:inline-block;width:8px;height:8px;border-radius:999px;background:linear-gradient(180deg,#f59e0b,#10b981)}
  `;

  function leafSvg() {
    return `
      <svg class="et-icon et-pulse" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20 4c-7.5.5-13 4.8-14.8 9.2C3.7 16.4 5.5 20 10 20c6 0 10-6.2 10-16Z" fill="#10b981" opacity=".9"/>
        <path d="M6 18c3-5 8-8 14-10" stroke="#065f46" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    `;
  }

  mount.innerHTML = `<style>${styles}</style>
    <div class="et-card" role="status" aria-live="polite">
      ${leafSvg()}
      <div>
        <p class="et-title">EcoTrace Carbon Footprint</p>
        <p class="et-row et-muted">Calculating…</p>
        <div class="et-offset" hidden>
          <label class="et-check">
            <input id="et-offset" type="checkbox" />
            <div>
              <div class="et-row"><b>Neutralize</b> this shipment for <b>€${offsetFeeEur.toFixed(2)}</b></div>
              <div class="et-sub">Your contribution supports certified reforestation projects (UN Gold Standard).</div>
            </div>
          </label>
          <div class="et-badge" id="et-badge"><span><i></i> Carbon Neutral</span></div>
        </div>
      </div>
    </div>`;

  if (!storePublicId || !originZip || !destinationZip || !weightKg) {
    const msg =
      "Missing attributes. Provide data-store, data-weight, data-origin-zip and data-destination-zip on the script tag.";
    mount.querySelector(".et-card").classList.add("et-err");
    mount.querySelector(".et-row").textContent = msg;
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
      is_offset_purchased: false
    }),
  })
    .then(async (r) => {
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.detail || "Request failed");
      return data;
    })
    .then((data) => {
      const co2 = Number(data.co2_kg || 0).toFixed(2);
      const row = mount.querySelector(".et-row");
      row.innerHTML = `<span class="et-co2">${co2} kg CO₂e</span> <span class="et-muted">(est.)</span>
        <span class="et-tip" aria-label="Learn more">
          <span>Learn more</span>
          <span class="et-pop">
            This estimate supports 2026 EU Green Claims-style transparency by showing shipment CO₂e at checkout.
            Source: <b>${String(data.source || "fallback")}</b>. Distance: <b>${Number(data.distance_km || 0).toFixed(
        1
      )} km</b>.
          </span>
        </span>`;

      const offsetWrap = mount.querySelector(".et-offset");
      offsetWrap.hidden = false;

      const checkbox = mount.querySelector("#et-offset");
      const badge = mount.querySelector("#et-badge");

      function emit(checked) {
        // Simulate sending to the store: publish an event the checkout can listen for.
        window.dispatchEvent(
          new CustomEvent("ecotrace:offset-change", {
            detail: {
              store_public_id: storePublicId,
              is_offset_purchased: Boolean(checked),
              offset_fee_eur: offsetFeeEur,
              co2_kg: Number(data.co2_kg || 0),
              distance_km: Number(data.distance_km || 0),
            },
          })
        );
      }

      checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
          badge.style.display = "block";
        } else {
          badge.style.display = "none";
        }
        emit(checkbox.checked);
      });

      emit(false);
    })
    .catch((e) => {
      mount.querySelector(".et-card").classList.add("et-err");
      mount.querySelector(".et-row").textContent = `EcoTrace unavailable: ${e.message}`;
    });
})();

