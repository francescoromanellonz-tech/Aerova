/**
 * Migrates all hardcoded website content into Sanity.
 * Generates all-content.ndjson, then run:
 *
 *   cd studio-aerova-website
 *   sanity dataset import ../scripts/all-content.ndjson production --missing
 */

import { createWriteStream } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';
import translations from '../src/translations.json' with { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const toUrl = (p) => pathToFileURL(p).href;

const outPath = join(__dirname, 'all-content.ndjson');
const out = createWriteStream(outPath);
const write = (doc) => out.write(JSON.stringify(doc) + '\n');

let _key = 0;
const k = () => `k${(++_key).toString(36)}`;
const rank = (n) => String.fromCharCode(97 + Math.floor(n / 26)) + String.fromCharCode(97 + (n % 26));

// ═══════════════════════════════════════════════════════════════════
// 1. FAQ ENTRIES
// ═══════════════════════════════════════════════════════════════════

const FAQ_GROUPS = [
  {
    eyebrow: 'The product',
    category: 'the-product',
    items: [
      { q: 'What is an atmospheric water generator (AWG)?',
        a: 'An atmospheric water generator condenses humidity from the surrounding air into drinking water. AEROVA\'s LT-AWG20G pulls humid air through a HEPA pre-filter, condenses it on cooled coils, then runs the raw water through eight purification stages — sediment, activated carbon, reverse osmosis, mineral restoration, Nano Ceram-PAC, and dual UV sterilisation — to produce alkaline drinking water at pH 7.4+. No municipal supply, no bottles, no pipes.',
        highlight: true },
      { q: 'How is the AEROVA different from bottled water, under-sink RO, or a countertop water purifier for home use?',
        a: 'Bottled water carries a plastic-waste cost and a fragile supply chain, and the water has often been sitting in plastic for weeks. Under-sink reverse osmosis depends on the quality of tap water it receives, which in much of Vietnam means heavy metals and organic contamination upstream. Boiling kills bacteria but concentrates dissolved solids and chemicals. A conventional máy lọc nước để bàn (countertop water purifier) still relies on tap water as its input — water quality in Vietnam\'s mains supply varies widely by district and season. AEROVA starts from the air itself, making it a genuinely eco friendly water solution: no pipes, no plastic bottles, zero single-use waste.' },
      { q: 'Will it work in my city\'s humidity?',
        a: 'AEROVA is engineered for Vietnamese climate. HCMC averages 80% relative humidity, Đà Nẵng 85%, Hà Nội 75%, Vũng Tàu 80%, all comfortably within the optimal yield range. Output scales directly with humidity and temperature: at 30°C and 80% RH the unit produces its full 20 L/day; at cooler, drier indoor conditions (for example, a Hanoi winter at around 18°C and 65% RH) expect roughly 7–9 litres per day — still enough for a household\'s drinking needs.' },
      { q: 'Is water safe to drink in Vietnam — and how does AEROVA solve the problem?',
        a: 'Tap water is not safe to drink in Vietnam without treatment: municipal supplies in HCMC, Hà Nội, and coastal cities regularly exceed safe limits for chlorine by-products, heavy metals, and microbial contaminants. Bottled water addresses the symptom but not the plastic-waste cost or the supply-chain risk. AEROVA solves the problem at the source by extracting drinking water directly from atmospheric humidity, bypassing the mains entirely.' },
      { q: 'How much water does the LT-AWG20G produce per day?',
        a: 'Up to 20 litres per day at optimal conditions (30°C, 80% RH). Output depends on ambient temperature and humidity: at typical HCMC rainy-season indoor conditions you will be near the 20 L ceiling; at cooler, drier conditions — Hanoi in January or an air-conditioned room — output is lower, typically 7–12 litres. A four-person household typically consumes 8–12 L/day for drinking and cooking, so the unit covers daily needs in most Vietnamese conditions with margin for guests, tea and coffee.' },
      { q: 'Is atmospheric water safe to drink — and what is its quality?',
        a: 'Yes — atmospheric water is safe to drink, and AEROVA\'s LT-AWG20G produces some of the cleanest water available in Vietnam. The eight-stage filtration delivers TDS below 50 ppm, pH between 7.4 and 8.2 (mildly alkaline), and dual UV sterilisation that destroys bacteria and viruses. The mineral stage restores calcium and magnesium, so the water is genuinely good for your body.',
        highlight: true },
      { q: 'Can drinking AEROVA water support weight management and healthy hydration habits?',
        a: 'Good hydration is the foundation of healthy weight management: research consistently shows that drinking water at the right times and in the right amounts supports metabolism, reduces unnecessary calorie intake, and improves energy levels. Because AEROVA water is mineralised and mildly alkaline, it is more palatable than flat purified water, which makes it easier to hit the recommended 2 L+ per day.' },
    ],
  },
  {
    eyebrow: 'Operating it',
    category: 'operating-it',
    items: [
      { q: 'How hot and how cold can the water be dispensed?',
        a: 'The AEROVA has separate hot and cold tanks. Cold water is dispensed at approximately 6°C; hot water is held at approximately 82°C — close enough to boiling for tea, coffee, and instant noodles, but safer than a kettle. Allow at least 30 minutes after switching on the heating or cooling for the water to reach its target temperature. The LCD display shows the current tank temperatures in either Celsius or Fahrenheit.' },
      { q: 'Is there a child-safety lock for the hot tap?',
        a: 'Yes. The hot dispense lever has a dedicated LOCK button that must be pressed simultaneously with the lever to dispense hot water. The cold tap dispenses freely. This child-safety feature is standard on every LT-AWG20G.' },
      { q: 'How loud is the AEROVA?',
        a: 'Approximately 45 dB(A) at one metre, quieter than a library or a refrigerator. The unit is designed for living rooms, bedrooms and offices; you can hold a normal conversation right next to it.' },
      { q: 'How much electricity does it use?',
        a: 'Peak draw is 970 W when both heating (500 W) and water generation (470 W) run simultaneously. In normal use the cycles do not overlap continuously, so real-world consumption is lower. Expect roughly 30–50 kWh per month for a typical Vietnamese household, comparable to a small refrigerator.' },
      { q: 'Do I need to plumb it in?',
        a: 'No — the AEROVA needs only a standard 220V power outlet, the water comes from the air. There is also an optional external water inlet on the rear panel: you can connect a standard ½" supply hose so the unit automatically draws from tap water if atmospheric output ever falls short. The machine filters and sterilises any external water through the same 8-stage system before dispensing.' },
      { q: 'What does the LCD display show?',
        a: 'The front display shows ambient temperature (°C / °F), relative humidity (% RH), water level in the upper tank (¼, ½, ¾, full), and status icons for the hot-water cycle, cold-water cycle, the AWG generation process, and eight filter/lamp positions. Any icon that flashes indicates that component is due for service.' },
      { q: 'When do I need to change the filters?',
        a: 'The recommended intervals per the manufacturer are: sediment filter, pre-carbon filter, mineral filter, and Nano Ceram-PAC every 6 months; HEPA air filter and RO membrane every 12 months; both UV lamps every 18 months. The LCD display alerts you with the specific filter number when each is due, so you never have to guess. AEROVA\'s maintenance pack covers the 6-month service from ₫1,200,000.' },
      { q: 'What happens during a power cut?',
        a: 'Water generation pauses. The internal hot and cold tanks retain their existing water and remain dispensable for a typical short outage. When power returns, generation resumes automatically — no reset required.' },
      { q: 'Do I need to do anything before switching it on for the first time?',
        a: 'Yes — three things. First, after unpacking, leave the unit standing upright for at least 24 hours before connecting it to power; this protects the compressor. Second, position it at least 30 cm away from walls and furniture on all sides for proper air circulation. Third, place it on a flat, level indoor surface — the unit must not be used outdoors or near aggressive fumes, salt air, or oily environments.' },
      { q: 'What should I do if the machine has been off for several days?',
        a: 'If the unit has been switched off for more than two days, drain the tanks and run a flush cycle before drinking the water again. If it has been off for more than one week, the manufacturer recommends replacing the water filter cartridges and performing a full disinfection cycle before use.' },
    ],
  },
  {
    eyebrow: 'Buying & owning',
    category: 'buying-and-owning',
    items: [
      { q: 'What is included in the box?',
        a: 'The LT-AWG20G unit, power cable, drip-tray adapter, drain hoses for the hot and cold tanks, the user manual, warranty card, and the full set of filters pre-installed. Free professional installation is included for orders in Hồ Chí Minh City and Hà Nội.' },
      { q: 'Do you install the AEROVA?',
        a: 'Yes, free professional installation is included for orders in HCMC and Hà Nội. Other Vietnamese cities are handled case-by-case through our service network; contact us for a site survey and quote.' },
      { q: 'What is the warranty period?',
        a: 'Two years on the full unit, covering parts and labour for manufacturing defects. The full warranty terms and claims process are on the AEROVA support page.' },
      { q: 'Can I return the unit?',
        a: 'Yes, 30 days, money back, no questions asked. AEROVA arranges collection at no cost to you.' },
      { q: 'Where can I download the user manual and spec sheet?',
        a: 'PDFs of the LT-AWG20G owner\'s manual, installation guide, warranty terms and certification pack are available from the support page. If anything is missing or out of date, request the latest copy directly via the contact page.' },
    ],
  },
];

let faqIdx = 0;
for (const group of FAQ_GROUPS) {
  for (const item of group.items) {
    const slug = item.q.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60);
    write({
      _type: 'faq',
      _id: `faq-${slug}`,
      question: { en: item.q, vi: item.q },   // VI left as EN — translate in Studio
      answer:   { en: item.a, vi: item.a },
      category: group.category,
      highlightOnProduct: item.highlight === true,
      orderRank: rank(faqIdx++),
    });
  }
}

// ═══════════════════════════════════════════════════════════════════
// 2. FILTRATION STAGES
// ═══════════════════════════════════════════════════════════════════

const stageAccents = [
  'var(--gold)',          // 01 HEPA
  'var(--water-crystal)', // 02 Condensation
  'var(--water-crystal)', // 03 Sediment
  'var(--water-crystal)', // 04 Pre-Carbon
  'var(--water-crystal)', // 05 RO
  'var(--gold)',          // 06 Mineral
  'var(--water-crystal)', // 07 Nano Ceram
  'var(--gold)',          // 08 Dual UV
];

const stageImgAlts = [
  'Macro detail of HEPA pleated filter media capturing fine particles',
  'Macro detail of condensation forming on cold cooling coils',
  'Cross-section macro of the PP sediment cartridge with captured particles',
  'Macro detail of the activated carbon block surface and porous matrix',
  'Macro cross-section of the reverse-osmosis membrane material',
  'Mineral stone cartridge restoring calcium, magnesium, potassium and sodium',
  'Nano Ceram-PAC cartridge in the filter bank, final polishing before storage',
  'Twin LED UV lamps glowing inside both AEROVA storage tanks',
];

for (let i = 1; i <= 8; i++) {
  const num = String(i).padStart(2, '0');
  const titleKey = `filt_stage${i}_title`;
  const descKey  = `filt_stage${i}_desc`;
  const t = translations[titleKey] || {};
  const d = translations[descKey]  || {};

  write({
    _type: 'filtrationStage',
    _id: `filtration-stage-${num}`,
    stageNumber: num,
    title: {
      en: t.en || '', vi: t.vi || '',
      ru: t.ru || '', fr: t.fr || '', zh: t.zh || '',
    },
    description: {
      en: d.en || '', vi: d.vi || '',
      ru: d.ru || '', fr: d.fr || '', zh: d.zh || '',
    },
    accentColor: stageAccents[i - 1],
    orderRank: rank(i - 1),
  });
}

// ═══════════════════════════════════════════════════════════════════
// 3. TECHNICAL SPEC CHAPTERS
// ═══════════════════════════════════════════════════════════════════

const chapters = [
  {
    ordRank: '01', title: 'Daily Yield', vietnameseWhisper: 'Sản lượng hằng ngày',
    layout: 'mega', megaValue: '20', megaUnit: 'L / day',
    caption: 'Output at 30 °C, 80 % relative humidity.',
    body: 'Capacity is measured at standard Vietnamese conditions. Cool, dry air produces more; hot, arid air produces less. Output adjusts continuously to ambient. As a máy lấy nước từ không khí (atmospheric water harvester), AEROVA draws moisture directly from the air — no pipes, no plastic bottles, no running to the market.',
    ledger: [{ value: '5 – 20 L', label: 'output band' }, { value: '4 L', label: 'cold tank' }, { value: '1 L', label: 'hot tank' }, { value: '3 h', label: 'auto-recycle' }],
    accentColor: 'var(--gold)',
  },
  {
    ordRank: '02', title: 'Acoustics', vietnameseWhisper: 'Vận hành yên tĩnh',
    layout: 'mega', megaValue: '45', megaUnit: 'dB(A)',
    caption: 'Measured at one metre, quieter than a library.',
    body: 'The compressor floats on isolation mounts; the fan runs variable-speed and tapers off at low draw. The LT-AWG20G is engineered for the living room, not a utility closet.',
    ledger: [{ value: '1 m', label: 'measurement distance' }, { value: 'variable', label: 'fan speed' }, { value: 'mounted', label: 'compressor isolation' }, { value: '24 / 7', label: 'continuous operation' }],
    accentColor: 'var(--water-crystal)',
  },
  {
    ordRank: '03', title: 'Filtration', vietnameseWhisper: 'Lọc đến cấp phân tử',
    layout: 'mega', megaValue: '0.0001', megaUnit: 'μm',
    caption: 'Reverse-osmosis membrane threshold.',
    body: 'Reverse osmosis removes dissolved solids at the molecular level. Four stages precede it — HEPA air filtration, condensation, sediment, and activated carbon. Mineral restoration and Nano Ceram-PAC follow; twin LED UV lamps sterilise both storage tanks. The result: pH 7.4–8.2 alkaline water, TDS below 50 ppm.',
    ledger: [{ value: 'H13', label: 'HEPA grade, 0.3 μm @ 99.97 %' }, { value: '99 %', label: 'TDS rejection' }, { value: '254 nm', label: 'UV-C wavelength' }, { value: '< 50 ppm', label: 'TDS post-RO' }],
    accentColor: 'var(--water-crystal)',
  },
  {
    ordRank: '04', title: 'Power Draw', vietnameseWhisper: 'Tiêu thụ điện',
    layout: 'mega', megaValue: '970', megaUnit: 'W peak',
    caption: 'Combined cooling + heating, at maximum draw.',
    body: 'Refrigerant runs in a hermetically sealed R134A loop, no scheduled service. Standby draw holds under eight watts; the unit idles between cycles.',
    ledger: [{ value: 'AC 220–240 V', label: '50 Hz supply' }, { value: '500 W', label: 'heating circuit' }, { value: '470 W', label: 'water generation' }, { value: '< 8 W', label: 'standby' }],
    accentColor: 'var(--gold)',
  },
  {
    ordRank: '05', title: 'Climate Range', vietnameseWhisper: 'Dải nhiệt độ vận hành',
    layout: 'range', rangeFrom: '15', rangeTo: '38', rangeUnit: '°C',
    caption: 'Operating ambient, Hanoi winter to HCMC dry season.',
    body: 'Beyond 38 °C the compressor throttles to protect itself; below 15 °C condensation halts and the tanks dispense reserves. The unit is designed for the Vietnamese tropics at full output.',
    ledger: [{ value: '20 – 95 %', label: 'relative humidity' }, { value: 'auto-throttle', label: 'thermal protection' }, { value: 'R134A', label: 'sealed refrigerant' }, { value: 'tropics', label: 'climate band' }],
    accentColor: 'var(--water-crystal)',
  },
  {
    ordRank: '06', title: 'Build', vietnameseWhisper: 'Trọng lượng & kích thước',
    layout: 'dim', dimWidth: '375', dimDepth: '307', dimHeight: '1154', dimUnit: 'mm',
    caption: 'Width × depth × height. Footprint of a single floor tile.',
    body: 'Net weight 42 kg. Matte-black enclosure with chrome trim. Single-person installation; arrives crated, leaves empty.',
    ledger: [{ value: '42 kg', label: 'net weight' }, { value: '52 kg', label: 'gross, packed' }, { value: '440 × 380 × 1360', label: 'packing, mm' }, { value: 'matte black + chrome', label: 'finish' }],
    accentColor: 'var(--gold)',
  },
];

let chIdx = 0;
for (const ch of chapters) {
  write({
    _type: 'technicalSpec',
    _id: `tech-spec-${ch.ordRank}`,
    ordRank: ch.ordRank,
    title: ch.title,
    vietnameseWhisper: ch.vietnameseWhisper,
    layout: ch.layout,
    ...(ch.layout === 'mega'  ? { megaValue: ch.megaValue, megaUnit: ch.megaUnit } : {}),
    ...(ch.layout === 'range' ? { rangeFrom: ch.rangeFrom, rangeTo: ch.rangeTo, rangeUnit: ch.rangeUnit } : {}),
    ...(ch.layout === 'dim'   ? { dimWidth: ch.dimWidth, dimDepth: ch.dimDepth, dimHeight: ch.dimHeight, dimUnit: ch.dimUnit } : {}),
    caption: ch.caption,
    body: ch.body,
    ledger: ch.ledger.map(l => ({ _type: 'ledgerItem', _key: k(), value: l.value, label: l.label })),
    accentColor: ch.accentColor,
    orderRank: rank(chIdx++),
  });
}

// ═══════════════════════════════════════════════════════════════════
// Done
// ═══════════════════════════════════════════════════════════════════

out.end(() => {
  const counts = { faq: faqIdx, filtrationStages: 8, technicalSpecs: 6 };
  console.log(`✓ Written ${outPath}`);
  console.log(`  FAQ entries:       ${counts.faq}`);
  console.log(`  Filtration stages: ${counts.filtrationStages}`);
  console.log(`  Tech spec chapters:${counts.technicalSpecs}`);
  console.log('');
  console.log('Run:');
  console.log('  cd studio-aerova-website');
  console.log('  sanity dataset import ../scripts/all-content.ndjson production --missing');
});
