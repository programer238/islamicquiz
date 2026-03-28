const REGION_MAP = {
    littoral: ["02","06","09","15","16","18","21","23","27","31","35","36","42","46"],
    plateaux: ["03","04","05","10","12","14","17","19","20","22","24","25","26","28","29",
               "32","34","38","40","41","43","44","45","48","59","60","61","62","63","64",
               "65","66","67","68","69"],
    oasis:    ["07","30","39","47","51","52","55","57","58"],
    sud:      ["01","08","11","33","37","49","50","53","54","56"]
  };
  
  const REGION_LABELS = {
    littoral: "Littoral",
    plateaux: "High Plateaux",
    oasis:    "Oasis / Pre-Saharan",
    sud:      "Saharan South"
  };
  
  // Days per month: Mar Apr May Jun Jul Aug Sep
  const DAYS   = [31, 30, 31, 30, 31, 31, 30];
  const MONTHS = ["March","April","May","June","July","August","September"];
  
  // Reference evapotranspiration ET0 (mm/day)
  const ET0 = {
    littoral: [2.5, 3.4, 4.2, 5.5, 6.5, 5.8, 4.5],
    plateaux: [3.2, 4.1, 5.5, 7.0, 8.2, 7.5, 5.8],
    oasis:    [4.5, 5.8, 7.2, 8.5, 9.8, 8.8, 6.5],
    sud:      [5.8, 7.2, 8.5,10.2,11.5,10.8, 8.2]
  };
  
  // Crop coefficient Kc (corn growth stages)
  const Kc = [0.3, 0.3, 0.3, 0.75, 1.2, 1.2, 0.9];
  
  // Effective rainfall Peff (mm/month)
  const Peff = {
    littoral: [52, 42, 20, 2,   2,   2,   2  ],
    plateaux: [37, 32, 15, 1.5, 1.5, 1.5, 1.5],
    oasis:    [12,  7,  3, 0,   0,   0,   0  ],
    sud:      [ 3,  1,  0, 0,   0,   0,   0  ]
  };
  
  /* ── Helpers ──────────────────────────────────────────────────── */
  
  function getRegion(code) {
    for (const [region, codes] of Object.entries(REGION_MAP)) {
      if (codes.includes(code)) return region;
    }
    return null;
  }
  
  function fmt(n, dec = 0) {
    return Number(n).toLocaleString("en", {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec
    });
  }
  
  /* ── Zone badge (updates on wilaya change) ────────────────────── */
  
  function updateZoneBadge() {
    const code   = document.getElementById("wilaya").value;
    const region = getRegion(code);
    const el     = document.getElementById("zone-display");
  
    if (region) {
      el.innerHTML = `
        <div class="zone-badge">
          <span class="zone-dot"></span>
          Zone: ${REGION_LABELS[region]}
        </div>`;
    } else {
      el.innerHTML = "";
    }
  }
  
  document.getElementById("wilaya").addEventListener("change", updateZoneBadge);
  updateZoneBadge(); // run once on page load
  
  /* ── Main calculator ──────────────────────────────────────────── */
  
  function calculateCalendar() {
    const areaRaw = document.getElementById("area").value;
    const wilaya  = document.getElementById("wilaya").value;
    const errEl   = document.getElementById("error-msg");
  
    // Validate area input
    const area = parseFloat(areaRaw);
    if (!areaRaw || isNaN(area) || area <= 0) {
      errEl.style.display = "block";
      errEl.textContent   = "Please enter a valid field area greater than 0.";
      document.getElementById("output").style.display = "none";
      return;
    }
    errEl.style.display = "none";
  
    // Validate wilaya
    const zone = getRegion(wilaya);
    if (!zone) {
      errEl.style.display = "block";
      errEl.textContent   = "Unknown wilaya code. Please select a valid wilaya.";
      return;
    }
  
    // ── Calculate per-month values ────────────────────────────────
    const rows = [];
    let totalWater      = 0;
    let totalIrrigations = 0;
  
    for (let i = 0; i < MONTHS.length; i++) {
      // ETc (mm/month) = ET0 (mm/day) × Kc × days in month
      const etcMonth = ET0[zone][i] * Kc[i] * DAYS[i];
  
      // Net irrigation need after effective rainfall
      let netNeed = etcMonth - Peff[zone][i];
      if (netNeed < 0) netNeed = 0;
  
      // Gross irrigation (accounting for 85% efficiency)
      const grossMm     = netNeed / 0.85;
      const m3PerHa     = grossMm * 10;          // mm × 10 = m³/ha
      const monthlyWater = m3PerHa * area;
  
      let irrigations = 0;
      let perIrr      = 0;
  
      if (monthlyWater > 0) {
        irrigations = 4;                         // weekly (≈4×/month)
        perIrr      = monthlyWater / irrigations;
      }
  
      totalWater       += monthlyWater;
      totalIrrigations += irrigations;
  
      rows.push({ month: MONTHS[i], etcMonth, netNeed, monthlyWater, irrigations, perIrr });
    }
  
    // ── Build table rows ──────────────────────────────────────────
    const maxWater = Math.max(...rows.map(r => r.monthlyWater), 1);
    let tbody = "";
  
    for (const r of rows) {
      const pct    = ((r.monthlyWater / maxWater) * 100).toFixed(1);
      const hasIrr = r.irrigations > 0;
  
      tbody += `
        <tr>
          <td class="month-name">${r.month}</td>
          <td class="td-num">${fmt(r.etcMonth, 1)}</td>
          <td class="td-num">${fmt(r.netNeed, 1)}</td>
          <td class="td-num" style="font-weight:600">${fmt(r.monthlyWater)}</td>
          <td>
            ${hasIrr
              ? `<span class="badge-irr">${r.irrigations}×</span>`
              : `<span class="badge-no">none</span>`}
          </td>
          <td class="td-num">${hasIrr ? fmt(r.perIrr) : "—"}</td>
          <td>
            <div class="bar-wrap">
              <div class="bar-bg">
                <div class="bar-fill" style="width:${pct}%"></div>
              </div>
              <span style="font-size:11px;color:var(--muted);min-width:36px">${pct}%</span>
            </div>
          </td>
        </tr>`;
    }
  
    // ── Inject results into DOM ───────────────────────────────────
    document.getElementById("tbody").innerHTML = tbody;
  
    document.getElementById("result-title").textContent =
      `Irrigation Calendar — ${REGION_LABELS[zone]}`;
  
    document.getElementById("result-meta").textContent =
      `Area: ${area} ha`;
  
    document.getElementById("summary-grid").innerHTML = `
      <div class="stat">
        <div class="stat-label">Season total</div>
        <div class="stat-value">${fmt(totalWater)}</div>
        <div class="stat-unit">m³</div>
      </div>
      <div class="stat">
        <div class="stat-label">Total irrigations</div>
        <div class="stat-value">${totalIrrigations}</div>
        <div class="stat-unit">events</div>
      </div>
      <div class="stat">
        <div class="stat-label">Avg per event</div>
        <div class="stat-value">
          ${totalIrrigations > 0 ? fmt(totalWater / totalIrrigations) : "—"}
        </div>
        <div class="stat-unit">m³</div>
      </div>`;
  
    const output = document.getElementById("output");
    output.style.display = "block";
    output.scrollIntoView({ behavior: "smooth", block: "start" });
  }