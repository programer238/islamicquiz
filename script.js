// ─────────────────────────────────────────────────────────────────
// DATA — sourced directly from "Besoin Hydrique du Maïs" document
// Culture: Maïs | Système: Pivot | Efficiency μ = 0.85
// Season: March → October (8 months)
// ─────────────────────────────────────────────────────────────────

// Days per month: Mar Apr May Jun Jul Aug Sep Oct
const DAYS   = [31, 30, 31, 30, 31, 31, 30, 31];
const MONTHS = ["March","April","May","June","July","August","September","October"];

// ── Zone assignment per wilaya code ──────────────────────────────
// Zone 1: Littoraux et telliens   → stations: Alger, Oran, Annaba, Skikda, Sidi-Bel-Abbès, Constantine
// Zone 2: Hauts plateaux et steppiques → Sétif, Djelfa, Tébessa, Aïn-Sefra, Laghouat, Biskra, Béchar
// Zone 3: Saharien                → Adrar, Ouargla, Ghardaïa, Touggourt, In-Salah, Tamanrasset, Tindouf, Djanet

const WILAYA_DATA = {
  // ── Zone 1 : Littoraux et telliens ────────────────────────────
  "16": { label: "16 الجزائر",        zone: 1, station: "ALGER"          },
  "31": { label: "31 وهران",           zone: 1, station: "ORAN"           },
  "23": { label: "23 عنابة",           zone: 1, station: "ANNABA"         },
  "21": { label: "21 سكيكدة",          zone: 1, station: "SKIKDA"         },
  "22": { label: "22 سيدي بلعباس",     zone: 1, station: "SIDI-BEL-ABBES" },
  "25": { label: "25 قسنطينة",         zone: 1, station: "CONSTANTINE"    },

  // ── Zone 2 : Hauts plateaux et steppiques ─────────────────────
  "19": { label: "19 سطيف",            zone: 2, station: "SETIF"          },
  "17": { label: "17 الجلفة",          zone: 2, station: "DJELFA"         },
  "12": { label: "12 تبسة",            zone: 2, station: "TEBESSA"        },
  "20": { label: "20 سعيدة (عين صفراء)", zone: 2, station: "AIN-SEFRA"   },
  "03": { label: "03 الأغواط",         zone: 2, station: "LAGHOUAT"       },
  "07": { label: "07 بسكرة",           zone: 2, station: "BISKRA"         },
  "08": { label: "08 بشار",            zone: 2, station: "BECHAR"         },

  // ── Zone 3 : Saharien ─────────────────────────────────────────
  "01": { label: "01 أدرار",           zone: 3, station: "ADRAR"          },
  "30": { label: "30 ورقلة",           zone: 3, station: "OUARGLA"        },
  "47": { label: "47 غرداية",          zone: 3, station: "GHARDAIA"       },
  "55": { label: "55 تقرت",            zone: 3, station: "TOUGGOURT"      },
  "53": { label: "53 عين صالح",        zone: 3, station: "IN-SALAH"       },
  "11": { label: "11 تمنراست",         zone: 3, station: "TAMANRASSET"    },
  "37": { label: "37 تندوف",           zone: 3, station: "TINDOUF"        },
  "56": { label: "56 جانت",            zone: 3, station: "DJANET"         },
};

const ZONE_LABELS = {
  1: "Littoraux et telliens",
  2: "Hauts plateaux et steppiques",
  3: "Saharien"
};

// ── ET0 (mm/day) per station — from document ─────────────────────
// Order: Mar  Apr   May   Jun   Jul   Aug   Sep   Oct
const ET0_STATION = {
  "ADRAR":          [5.08, 6.18, 7.96, 8.33, 8.78, 7.75, 6.95, 5.04],
  "AIN-SEFRA":      [3.06, 4.19, 5.55, 6.39, 7.25, 6.35, 5.18, 3.35],
  "ALGER":          [2.57, 3.24, 3.94, 4.52, 5.01, 4.89, 3.81, 2.68],
  "ANNABA":         [2.30, 2.83, 3.63, 4.46, 5.08, 4.77, 3.46, 2.42],
  "BECHAR":         [3.96, 5.32, 6.20, 7.40, 7.34, 6.75, 5.56, 3.81],
  "BISKRA":         [2.65, 3.76, 4.53, 5.22, 5.64, 5.33, 4.36, 2.81],
  "CONSTANTINE":    [2.26, 3.04, 4.09, 4.88, 5.70, 5.79, 4.26, 2.44],
  "DJANET":         [4.58, 5.61, 6.34, 6.91, 6.97, 6.64, 5.84, 4.80],
  "DJELFA":         [2.46, 3.38, 4.51, 5.27, 6.24, 5.82, 4.18, 2.73],
  "GHARDAIA":       [2.90, 4.67, 5.64, 6.83, 7.55, 7.32, 5.54, 3.99],
  "IN-SALAH":       [4.54, 6.13, 6.94, 7.26, 7.79, 7.09, 6.44, 5.35],
  "LAGHOUAT":       [3.02, 4.05, 4.85, 5.77, 5.95, 5.57, 4.48, 3.06],
  "ORAN":           [1.98, 2.73, 3.34, 3.84, 4.08, 4.00, 3.20, 1.95],
  "OUARGLA":        [4.04, 5.38, 6.56, 7.74, 8.05, 7.62, 6.17, 4.48],
  "SETIF":          [2.28, 3.56, 4.40, 5.69, 6.34, 5.89, 4.36, 2.61],
  "SIDI-BEL-ABBES": [2.29, 3.43, 4.19, 4.70, 5.51, 5.19, 3.81, 2.69],
  "SKIKDA":         [2.29, 2.85, 3.67, 4.52, 5.08, 4.72, 3.69, 2.30],
  "TAMANRASSET":    [4.49, 5.31, 5.91, 6.09, 6.27, 6.08, 5.44, 4.61],
  "TEBESSA":        [2.54, 3.61, 4.34, 5.56, 6.39, 5.70, 4.35, 2.82],
  "TINDOUF":        [4.33, 5.46, 6.07, 6.60, 7.28, 7.10, 6.25, 4.61],
  "TOUGGOURT":      [3.52, 4.75, 6.17, 7.18, 7.58, 6.86, 5.42, 3.53],
};

// ── Kc per zone — from document ──────────────────────────────────
// Order: Mar   Apr   May   Jun   Jul   Aug   Sep   Oct (Oct = 0, crop done)
const Kc = {
  1: [0.20, 0.30, 0.40, 0.70, 1.05, 1.05, 0.60, 0.00],  // Littoraux et telliens
  2: [0.25, 0.30, 0.50, 0.75, 1.10, 1.10, 0.65, 0.00],  // Hauts plateaux et steppiques
  3: [0.30, 0.35, 0.60, 0.85, 1.20, 1.20, 0.70, 0.00],  // Saharien
};

// ── Peff (mm/month) per station — from document ──────────────────
// Order: Mar    Apr    May    Jun    Jul    Aug    Sep    Oct
const PEFF_STATION = {
  "ADRAR":          [ 3.0,   3.0,   2.0,   0.0,   0.0,   0.0,   1.0,   9.8],
  "AIN-SEFRA":      [11.8,  10.8,  14.6,   4.0,   2.0,   4.0,   5.9,  10.8],
  "ALGER":          [64.5,  55.0,  37.4,  16.5,   4.0,   5.9,  33.0,  66.8],
  "ANNABA":         [59.8,  46.8,  29.5,  14.6,   3.0,   7.9,  28.6,  63.7],
  "BECHAR":         [ 5.9,   8.9,   6.9,   2.0,   1.0,   2.0,   6.9,   9.8],
  "BISKRA":         [11.8,   9.8,  12.7,   5.9,   2.0,   5.9,  19.4,  15.6],
  "CONSTANTINE":    [55.8,  48.5,  39.2,  20.3,   8.9,  11.8,  33.9,  35.7],
  "DJANET":         [ 4.0,   1.0,   1.0,   2.0,   0.0,   0.0,   1.0,   1.0],
  "DJELFA":         [37.4,  27.7,  35.7,  26.7,   8.9,  16.5,  28.6,  33.9],
  "GHARDAIA":       [ 8.9,   6.9,   4.0,   3.0,   1.0,   1.0,   4.0,   5.0],
  "IN-SALAH":       [ 2.0,   5.0,   1.0,   0.0,   0.0,   0.0,   0.0,   2.0],
  "LAGHOUAT":       [11.8,  15.6,  14.6,   9.8,   1.0,  88.7,  17.5,  17.5],
  "ORAN":           [40.0,  40.0,  27.7,   7.9,   2.0,   2.0,  11.8,  29.5],
  "OUARGLA":        [ 7.9,   1.0,   1.0,   0.0,   0.0,   0.0,   4.0,   3.0],
  "SETIF":          [36.6,  33.0,  40.9,  23.1,  10.8,  12.7,  30.4,  34.8],
  "SIDI-BEL-ABBES": [33.0,  40.9,  30.4,   9.8,   1.0,   4.0,  15.6,  38.3],
  "SKIKDA":         [66.8,  54.2,  27.7,  12.7,   3.0,   8.9,  26.7,  64.5],
  "TAMANRASSET":    [ 3.0,   2.0,   4.0,   4.0,   5.0,   5.9,   6.9,   3.0],
  "TEBESSA":        [42.6,  32.2,  37.4,  25.8,   9.8,  24.9,  34.8,  26.7],
  "TINDOUF":        [ 2.0,   1.0,   0.0,   0.0,   0.0,   1.0,   5.9,   2.0],
  "TOUGGOURT":      [ 6.9,   4.0,  11.8,   1.0,   1.0,   0.0,   4.0,   4.0],
};

// Max gross dose per irrigation event (mm) and monthly cap
const MAX_DOSE_MM   = 40;
const MAX_IRR_MONTH = 8;

/* ── Helpers ──────────────────────────────────────────────────── */

function getWilayaInfo(code) {
  return WILAYA_DATA[code] || null;
}

function fmt(n, dec = 0) {
  return Number(n).toLocaleString("en", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec
  });
}

/* ── Zone badge ───────────────────────────────────────────────── */

function updateZoneBadge() {
  const code = document.getElementById("wilaya").value;
  const info = getWilayaInfo(code);
  const el   = document.getElementById("zone-display");

  if (info) {
    el.innerHTML = `
      <div class="zone-badge">
        <span class="zone-dot"></span>
        Zone ${info.zone}: ${ZONE_LABELS[info.zone]} — Station: ${info.station}
      </div>`;
  } else {
    el.innerHTML = `
      <div class="zone-badge" style="background:#fff3f3;border-color:#fcc;color:#c0392b;">
        <span class="zone-dot" style="background:#c0392b"></span>
        Wilaya not yet mapped — please select another
      </div>`;
  }
}

document.getElementById("wilaya").addEventListener("change", updateZoneBadge);
updateZoneBadge();

/* ── Main calculator ──────────────────────────────────────────── */

function calculateCalendar() {
  const areaRaw = document.getElementById("area").value;
  const wilaya  = document.getElementById("wilaya").value;
  const errEl   = document.getElementById("error-msg");

  const area = parseFloat(areaRaw);
  if (!areaRaw || isNaN(area) || area <= 0) {
    errEl.style.display = "block";
    errEl.textContent   = "Please enter a valid field area greater than 0.";
    document.getElementById("output").style.display = "none";
    return;
  }
  errEl.style.display = "none";

  const info = getWilayaInfo(wilaya);
  if (!info) {
    errEl.style.display = "block";
    errEl.textContent   = "This wilaya is not yet mapped to a climate station.";
    return;
  }

  const { zone, station } = info;
  const et0  = ET0_STATION[station];
  const kc   = Kc[zone];
  const peff = PEFF_STATION[station];

  const rows = [];
  let totalWater       = 0;
  let totalIrrigations = 0;

  for (let i = 0; i < MONTHS.length; i++) {

    // Skip October if Kc = 0 (crop has matured, no irrigation needed)
    if (kc[i] === 0) {
      rows.push({
        month: MONTHS[i], etcMonth: 0, netNeed: 0,
        monthlyWater: 0, irrigations: 0, perIrr: 0, frequency: "—", skip: true
      });
      continue;
    }

    // ETc (mm/month) = ET0 (mm/day) × Kc × days in month
    const etcMonth = et0[i] * kc[i] * DAYS[i];

    // Net irrigation need = ETc − Peff (clamp to 0)
    let netNeed = etcMonth - peff[i];
    if (netNeed < 0) netNeed = 0;

    // Gross irrigation need at efficiency μ = 0.85
    const grossMm      = netNeed / 0.85;
    const m3PerHa      = grossMm * 10;        // 1 mm over 1 ha = 10 m³
    const monthlyWater = m3PerHa * area;

    // Dynamic irrigation count: how many 40 mm doses fill the gross need
    let irrigations = 0;
    let perIrr      = 0;
    let frequency   = "—";

    if (grossMm > 0) {
      irrigations = Math.min(Math.ceil(grossMm / MAX_DOSE_MM), MAX_IRR_MONTH);
      perIrr      = monthlyWater / irrigations;
      const freqDays = Math.round(DAYS[i] / irrigations);
      frequency   = `Every ${freqDays} days`;
    }

    totalWater       += monthlyWater;
    totalIrrigations += irrigations;

    rows.push({ month: MONTHS[i], etcMonth, netNeed, grossMm, monthlyWater, irrigations, perIrr, frequency, skip: false });
  }

  // ── Build table ───────────────────────────────────────────────
  const maxWater = Math.max(...rows.map(r => r.monthlyWater), 1);
  let tbody = "";

  for (const r of rows) {
    if (r.skip) {
      tbody += `
        <tr style="opacity:0.4">
          <td class="month-name">${r.month}</td>
          <td class="td-num" colspan="5" style="text-align:center;font-size:12px;color:var(--muted)">Crop mature — no irrigation</td>
          <td></td><td></td>
        </tr>`;
      continue;
    }

    const pct    = ((r.monthlyWater / maxWater) * 100).toFixed(1);
    const hasIrr = r.irrigations > 0;

    tbody += `
      <tr>
        <td class="month-name">${r.month}</td>
        <td class="td-num">${fmt(r.etcMonth, 1)}</td>
        <td class="td-num">${fmt(r.netNeed, 1)}</td>
        <td class="td-num" style="font-weight:600">${fmt(r.monthlyWater)}</td>
        <td>${hasIrr ? `<span class="badge-irr">${r.irrigations}×</span>` : `<span class="badge-no">none</span>`}</td>
        <td class="td-num">${hasIrr ? fmt(r.perIrr) : "—"}</td>
        <td style="font-size:12px;color:var(--muted)">${r.frequency}</td>
        <td>
          <div class="bar-wrap">
            <div class="bar-bg"><div class="bar-fill" style="width:${pct}%"></div></div>
            <span style="font-size:11px;color:var(--muted);min-width:36px">${pct}%</span>
          </div>
        </td>
      </tr>`;
  }

  // ── Inject results ────────────────────────────────────────────
  document.getElementById("tbody").innerHTML = tbody;
  document.getElementById("result-title").textContent =
    `Irrigation Calendar — ${ZONE_LABELS[zone]} (${station})`;
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
      <div class="stat-value">${totalIrrigations > 0 ? fmt(totalWater / totalIrrigations) : "—"}</div>
      <div class="stat-unit">m³</div>
    </div>`;

  const output = document.getElementById("output");
  output.style.display = "block";
  output.scrollIntoView({ behavior: "smooth", block: "start" });
}