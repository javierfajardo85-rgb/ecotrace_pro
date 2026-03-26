(() => {
  const script = document.currentScript;
  if (!script) return;

  const mount = document.getElementById("ecotrace-seal");
  if (!mount) return;

  const merchantId = script.getAttribute("data-merchant-id") || script.getAttribute("data-store") || "—";

  const styles = `
    .ets-wrap{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial}
    .ets-btn{cursor:pointer;user-select:none;display:inline-flex;align-items:center;gap:12px;padding:12px 14px;border-radius:999px;
      border:1px solid rgba(15,23,42,.14);background:linear-gradient(180deg,#ffffff,#f8fafc);color:#0f172a;
      box-shadow:0 16px 50px -38px rgba(2,6,23,.35);transition:transform .15s ease, box-shadow .15s ease, border-color .15s ease}
    .ets-btn:hover{transform:translateY(-1px);box-shadow:0 22px 70px -44px rgba(2,6,23,.45);border-color:rgba(245,158,11,.55)}
    .ets-medal{width:54px;height:54px;border-radius:999px;position:relative;flex:0 0 auto;
      background:radial-gradient(circle at 30% 30%, rgba(16,185,129,.22), rgba(16,185,129,.06) 55%, rgba(2,6,23,.04) 100%);
      border:1px solid rgba(16,185,129,.35);box-shadow:inset 0 0 0 1px rgba(255,255,255,.6)}
    .ets-medal:after{content:"";position:absolute;inset:-1px;border-radius:999px;pointer-events:none;
      background:linear-gradient(135deg, rgba(245,158,11,.0), rgba(245,158,11,.0));
      transition:opacity .15s ease;opacity:0}
    .ets-btn:hover .ets-medal:after{opacity:1;background:linear-gradient(135deg, rgba(245,158,11,.55), rgba(16,185,129,.22))}
    .ets-leaf{position:absolute;inset:0;display:grid;place-items:center}
    .ets-icon{width:26px;height:26px;transform-origin:50% 50%}
    .ets-pulse{animation:etsPulse 1.9s ease-in-out infinite}
    @keyframes etsPulse{0%,100%{transform:scale(1);filter:drop-shadow(0 0 0 rgba(16,185,129,0))}
      50%{transform:scale(1.08);filter:drop-shadow(0 8px 14px rgba(16,185,129,.25))}}
    .ets-text{min-width:0}
    .ets-title{font-weight:900;letter-spacing:-.01em;font-size:13px;line-height:1.1}
    .ets-sub{margin-top:3px;font-size:12px;line-height:1.2;color:rgba(15,23,42,.72)}
    .ets-id{margin-top:6px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:11px;color:rgba(15,23,42,.6)}
    .ets-chip{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:4px 10px;font-size:11px;font-weight:800;
      border:1px solid rgba(16,185,129,.25);background:rgba(16,185,129,.10);color:#065f46}
    /* modal */
    .ets-modal-backdrop{position:fixed;inset:0;background:rgba(2,6,23,.55);backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;z-index:99999;padding:18px}
    .ets-modal{width:min(760px,100%);border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,.12);
      background:linear-gradient(180deg, rgba(255,255,255,.98), rgba(248,250,252,.98));color:#0f172a;
      box-shadow:0 40px 120px -70px rgba(0,0,0,.65)}
    .ets-modal-h{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:18px 18px 0 18px}
    .ets-modal-t{font-weight:950;letter-spacing:-.02em;font-size:16px}
    .ets-modal-x{cursor:pointer;border-radius:12px;border:1px solid rgba(15,23,42,.12);background:rgba(15,23,42,.04);
      padding:8px 10px;font-weight:900}
    .ets-modal-b{padding:14px 18px 18px 18px}
    .ets-grid{display:grid;gap:12px}
    .ets-box{border-radius:16px;border:1px solid rgba(15,23,42,.10);background:rgba(255,255,255,.6);padding:14px}
    .ets-box h4{margin:0 0 6px 0;font-size:13px;font-weight:900}
    .ets-box p{margin:0;color:rgba(15,23,42,.72);font-size:13px;line-height:1.45}
    .ets-foot{margin-top:12px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between}
    .ets-link{font-size:12px;color:rgba(15,23,42,.72)}
  `;

  const leafSvg = `
    <svg class="ets-icon ets-pulse" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 4c-7.5.5-13 4.8-14.8 9.2C3.7 16.4 5.5 20 10 20c6 0 10-6.2 10-16Z" fill="#10b981" opacity=".92"/>
      <path d="M6 18c3-5 8-8 14-10" stroke="#065f46" stroke-width="1.6" stroke-linecap="round"/>
    </svg>
  `;

  const modalId = `ets-modal-${Math.random().toString(16).slice(2)}`;

  mount.innerHTML = `
    <style>${styles}</style>
    <div class="ets-wrap">
      <div class="ets-btn" role="button" tabindex="0" aria-haspopup="dialog" aria-controls="${modalId}">
        <div class="ets-medal" aria-hidden="true">
          <div class="ets-leaf">${leafSvg}</div>
        </div>
        <div class="ets-text">
          <div class="ets-title">EcoTrace Verified</div>
          <div class="ets-sub">
            <span class="ets-chip">2026 Climate Compliant</span>
          </div>
          <div class="ets-id">Merchant ID: <span id="ets-mid">${String(merchantId)}</span></div>
        </div>
      </div>

      <div class="ets-modal-backdrop" id="${modalId}" role="dialog" aria-modal="true" aria-label="EcoTrace verification details">
        <div class="ets-modal">
          <div class="ets-modal-h">
            <div>
              <div class="ets-modal-t">EcoTrace transparency & certification</div>
              <div class="ets-link">Merchant ID: <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace">${String(
                merchantId
              )}</span></div>
            </div>
            <button class="ets-modal-x" type="button" aria-label="Close">Close</button>
          </div>
          <div class="ets-modal-b">
            <div class="ets-grid">
              <div class="ets-box">
                <h4>Calculation transparency</h4>
                <p>
                  Emissions are estimated from shipment inputs (weight and distance). When available, EcoTrace uses verified
                  factors from Carbon Interface to compute CO₂e for shipping activity. If a verification provider is unavailable,
                  EcoTrace falls back to a conservative, documented emissions factor.
                </p>
              </div>
              <div class="ets-box">
                <h4>2026 Climate Compliant</h4>
                <p>
                  This seal indicates that checkout disclosure is enabled for shipment CO₂e, supporting transparent customer-facing
                  reporting aligned with 2026-style climate claims expectations.
                </p>
              </div>
              <div class="ets-box">
                <h4>Certified projects</h4>
                <p>
                  Where the merchant offers neutralization, contributions are intended to support certified reforestation projects
                  (UN Gold Standard). (MVP note: certificate verification display can be linked here in production.)
                </p>
              </div>
            </div>

            <div class="ets-foot">
              <div class="ets-link">Click outside to close.</div>
              <div class="ets-link">Powered by EcoTrace</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const btn = mount.querySelector(".ets-btn");
  const backdrop = mount.querySelector(`#${CSS.escape(modalId)}`);
  const closeBtn = mount.querySelector(".ets-modal-x");

  function open() {
    backdrop.style.display = "flex";
  }
  function close() {
    backdrop.style.display = "none";
  }

  btn.addEventListener("click", open);
  btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  });
  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();

