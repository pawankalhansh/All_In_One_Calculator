import React, { useState, useEffect } from 'react';

const TABS = [
  { id: 'basic', label: 'Basic Calc', cat: 'finance' },
  { id: 'emi', label: 'EMI / Loan', cat: 'finance' },
  { id: 'interest', label: 'Interest', cat: 'finance' },
  { id: 'discount', label: 'Discount', cat: 'finance' },
  { id: 'tip', label: 'Tip & Split', cat: 'life' },
  { id: 'tax', label: 'Income Tax', cat: 'tax' },
  { id: 'gst', label: 'GST', cat: 'tax' },
  { id: 'sip', label: 'SIP', cat: 'invest' },
  { id: 'lumpsum', label: 'Lump Sum', cat: 'invest' },
  { id: 'mf', label: 'Mutual Fund', cat: 'invest' },
  { id: 'goal', label: 'Goal Planner', cat: 'invest' },
  { id: 'nps', label: 'NPS / Pension', cat: 'retirement' },
  { id: 'retire', label: 'Retirement Need', cat: 'retirement' },
  { id: 'epfo', label: 'EPFO / PF', cat: 'retirement' },
  { id: 'bmi', label: 'BMI', cat: 'life' },
  { id: 'age', label: 'Age', cat: 'life' },
  { id: 'currency', label: 'Currency', cat: 'convert' },
  { id: 'fuel', label: 'Fuel', cat: 'life' },
  { id: 'unit', label: 'Unit Convert', cat: 'convert' },
];

const rates: Record<string, number> = { INR: 1, USD: 83.5, EUR: 90.2, GBP: 105.8, AED: 22.7, SGD: 61.3, JPY: .56, CAD: 61.5, AUD: 53.8 };

const uData: Record<string, any> = {
  length: { u: ['km', 'm', 'cm', 'mm', 'mile', 'yard', 'foot', 'inch'], b: [1000, 1, .01, .001, 1609.34, .9144, .3048, .0254] },
  weight: { u: ['tonne', 'kg', 'g', 'mg', 'lb', 'oz'], b: [1000, 1, .001, .000001, .453592, .0283495] },
  temp: { u: ['Celsius', 'Fahrenheit', 'Kelvin'], b: null },
  area: { u: ['km²', 'm²', 'cm²', 'hectare', 'acre', 'sq ft'], b: [1e6, 1, .0001, 10000, 4046.86, .0929] },
  volume: { u: ['litre', 'ml', 'm³', 'gallon(US)', 'cup'], b: [1, .001, 1000, 3.78541, .23659] },
  speed: { u: ['km/h', 'm/s', 'mph', 'knot'], b: [1, 3.6, 1.60934, 1.852] },
  time: { u: ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'], b: [31536000, 2592000, 604800, 86400, 3600, 60, 1] },
  data: { u: ['TB', 'GB', 'MB', 'KB', 'Byte', 'Bit'], b: [1e12, 1e9, 1e6, 1e3, 1, .125] }
};

function fmt(n: number) { return '₹' + Math.round(n).toLocaleString('en-IN'); }

export default function App() {
  const [activeCat, setActiveCat] = useState('all');
  const [activeTab, setActiveTab] = useState('basic');
  const [results, setResults] = useState<Record<string, any>>({});
  const [visibleRes, setVisibleRes] = useState<Record<string, boolean>>({});

  const [calcState, setCalcState] = useState({ display: '0', prev: null as number | null, op: null as string | null, fresh: true, sub: '' });
  const [txReg, setTxReg] = useState('new');
  const [unCat, setUnCat] = useState('length');
  const [unFrom, setUnFrom] = useState(0);
  const [unTo, setUnTo] = useState(1);

  const panelStyle = (id: string) => ({ display: activeTab === id ? 'block' : 'none' });

  const getVal = (id: string) => +(document.getElementById(id) as HTMLInputElement)?.value || 0;
  const getStr = (id: string) => (document.getElementById(id) as HTMLInputElement)?.value || '';

  const ck = (k: string) => {
    setCalcState(s => {
      let ns = { ...s };
      if (k === 'C') { ns.display = '0'; ns.prev = null; ns.op = null; ns.fresh = true; ns.sub = ''; }
      else if (k === '+/-') { ns.display = String(-parseFloat(ns.display)); }
      else if (k === '%') { ns.display = String(parseFloat(ns.display) / 100); }
      else if (['+', '-', '*', '/'].includes(k)) { ns.prev = parseFloat(ns.display); ns.op = k; ns.fresh = true; ns.sub = ns.display + ' ' + (k === '*' ? '×' : k === '/' ? '÷' : k); }
      else if (k === '=') {
        if (ns.op && ns.prev !== null) {
          const c = parseFloat(ns.display); let r: any;
          if (ns.op === '+') r = ns.prev + c; else if (ns.op === '-') r = ns.prev - c; else if (ns.op === '*') r = ns.prev * c; else r = c === 0 ? 'Error' : ns.prev / c;
          ns.sub = ''; ns.display = typeof r === 'number' ? parseFloat(r.toFixed(10)).toString() : r; ns.op = null; ns.prev = null; ns.fresh = true;
        }
      } else if (k === '.') { if (ns.fresh) { ns.display = '0.'; ns.fresh = false; } else if (!ns.display.includes('.')) ns.display += '.'; }
      else { if (ns.fresh || ns.display === '0') { ns.display = k; ns.fresh = false; } else ns.display += k; }
      return ns;
    });
  };

  const calcEMI = () => {
    const p = getVal('emi-p'), r = getVal('emi-r') / 12 / 100, n = getVal('emi-n');
    if (!p || !r || !n) return;
    const e = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1), t = e * n, i = t - p;
    setResults(p => ({ ...p, emi: { m: fmt(e), tot: fmt(t), int: fmt(i), ip: (i / t * 100).toFixed(1) + '%' } }));
    setVisibleRes(p => ({ ...p, emi: true }));
  };

  const calcSI = () => {
    const p = getVal('si-p'), r = getVal('si-r') / 100, t = getVal('si-t'), n = getVal('si-f');
    if (!p || !r || !t) return;
    const si = p * r * t, ci = p * Math.pow(1 + r / n, n * t) - p;
    setResults(p => ({ ...p, si: { si: fmt(si), sm: fmt(p + si), ci: fmt(ci), cm: fmt(p + ci) } }));
    setVisibleRes(p => ({ ...p, si: true }));
  };

  const calcDisc = () => {
    const p = getVal('dc-p'), d = getVal('dc-d'), c = getVal('dc-c');
    const da = p * d / 100, fp = Math.max(0, p - da - c), ts = p - fp;
    setResults(p => ({ ...p, dc: { da: fmt(da), fp: fmt(fp), ts: fmt(ts), ep: (ts / p * 100).toFixed(1) + '%' } }));
    setVisibleRes(p => ({ ...p, dc: true }));
  };

  const calcTip = () => {
    const b = getVal('tp-b'), p = getVal('tp-p') / 100, n = getVal('tp-n') || 1;
    const tip = b * p, tot = b + tip;
    setResults(p => ({ ...p, tp: { ta: fmt(tip), tb: fmt(tot), pp: fmt(tot / n), tp: fmt(tip / n) } }));
    setVisibleRes(p => ({ ...p, tp: true }));
  };

  const calcTax = () => {
    const inc = getVal('tx-inc'), reg = txReg;
    let taxable = inc;
    if (reg === 'old') { taxable = Math.max(0, inc - Math.min(getVal('tx-80c'), 150000) - getVal('tx-hra') - getVal('tx-oth') - (getVal('tx-std') || 50000)); }
    let tax = 0;
    if (reg === 'new') { if (taxable > 1500000) tax = 150000 + (taxable - 1500000) * .3; else if (taxable > 1200000) tax = 90000 + (taxable - 1200000) * .2; else if (taxable > 900000) tax = 45000 + (taxable - 900000) * .15; else if (taxable > 600000) tax = 15000 + (taxable - 600000) * .1; else if (taxable > 300000) tax = (taxable - 300000) * .05; if (inc <= 700000) tax = 0; }
    else { if (taxable > 1000000) tax = 112500 + (taxable - 1000000) * .3; else if (taxable > 500000) tax = 12500 + (taxable - 500000) * .2; else if (taxable > 250000) tax = (taxable - 250000) * .05; if (taxable <= 500000) tax = 0; }
    const cess = tax * .04, tot = tax + cess;
    setResults(p => ({ ...p, tx: { ti: fmt(taxable), tx: fmt(tax), cs: fmt(cess), tt: fmt(tot), mt: fmt(tot / 12), ih: fmt(inc - tot) } }));
    setVisibleRes(p => ({ ...p, tx: true }));
  };

  const calcGST = () => {
    const a = getVal('gs-a'), rate = getVal('gs-r') / 100, type = getStr('gs-t');
    let base, tot, final;
    if (type === 'add') { base = a; tot = a * rate; final = a + tot; } else { final = a; base = a / (1 + rate); tot = final - base; }
    setResults(p => ({ ...p, gs: { ba: '₹' + base.toFixed(2), cg: '₹' + (tot / 2).toFixed(2), sg: '₹' + (tot / 2).toFixed(2), tg: '₹' + tot.toFixed(2), fa: '₹' + final.toFixed(2) } }));
    setVisibleRes(p => ({ ...p, gs: true }));
  };

  const calcSIP = () => {
    const m = getVal('sp-m'), r = getVal('sp-r') / 100 / 12, n = getVal('sp-y'), t = getStr('sp-t');
    if (!m || !r || !n) return;
    let mat = 0, inv = 0;
    if (t === 'reg') { const mo = n * 12; mat = m * (Math.pow(1 + r, mo) - 1) / r * (1 + r); inv = m * mo; }
    else { let bal = 0, mo = m; for (let y = 0; y < n; y++) { for (let i = 0; i < 12; i++) { bal = (bal + mo) * (1 + r); inv += mo; } mo *= 1.1; } mat = bal; }
    const ret = mat - inv;
    const ip = inv / mat * 100;
    setResults(p => ({ ...p, sp: { inv: fmt(inv), ret: fmt(ret), mat: fmt(mat), mul: (mat / inv).toFixed(2) + 'x', bi: ip.toFixed(1) + '%', br: (100 - ip).toFixed(1) + '%' } }));
    setVisibleRes(p => ({ ...p, sp: true }));
  };

  const calcLS = () => {
    const p = getVal('ls-a'), r = getVal('ls-r') / 100, t = getVal('ls-y');
    if (!p || !r || !t) return;
    const m = p * Math.pow(1 + r, t), g = m - p;
    setResults(p => ({ ...p, ls: { p: fmt(p), g: fmt(g), m: fmt(m), c: getStr('ls-r') + '%' } }));
    setVisibleRes(p => ({ ...p, ls: true }));
  };

  const calcMF = () => {
    const a = getVal('mf-a'), bn = getVal('mf-bn') || 1, cn = getVal('mf-cn') || 1, y = getVal('mf-y') || 1, t = getStr('mf-t');
    const u = a / bn, cv = u * cn, g = cv - a, abs = ((cv - a) / a * 100).toFixed(2), cagr = (Math.pow(cv / a, 1 / y) - 1) * 100;
    let tax = 0, note = '';
    if (t === 'eq') { if (y >= 1) { const ltcg = Math.max(0, g - 125000); tax = ltcg * .125; note = 'LTCG: 12.5% on gains above ₹1.25L'; } else { tax = g * .2; note = 'STCG: 20% (held < 1 year)'; } }
    else if (t === 'debt') { tax = g * .3; note = 'Taxed as per income slab (est. 30%)'; }
    else if (t === 'elss') { if (y >= 3) { tax = Math.max(0, g - 125000) * .125; note = 'ELSS LTCG 12.5% above ₹1.25L'; } else note = 'ELSS has 3-year lock-in period.'; }
    else { tax = y >= 1 ? Math.max(0, g - 125000) * .125 : g * .2; note = y >= 1 ? 'Hybrid LTCG 12.5% above ₹1.25L' : 'STCG 20%'; }
    setResults(p => ({ ...p, mf: { u: u.toFixed(3), cv: fmt(cv), ar: abs + '%', cg: cagr.toFixed(2) + '%', tx: fmt(tax), pg: fmt(g - tax), tip: note } }));
    setVisibleRes(p => ({ ...p, mf: true }));
  };

  const calcGoal = () => {
    const target = getVal('gl-c'), y = getVal('gl-y') || 1, r = getVal('gl-r') / 100, ex = getVal('gl-e');
    const n = y * 12, mr = r / 12, eg = ex * Math.pow(1 + r, y), rem = Math.max(0, target - eg), sip = rem * mr / (Math.pow(1 + mr, n) - 1) / (1 + mr), ls = rem / Math.pow(1 + r, y), ts = sip * n;
    setResults(p => ({ ...p, gl: { s: fmt(sip), l: fmt(ls), t: fmt(ts), g: fmt(target - ts) } }));
    setVisibleRes(p => ({ ...p, gl: true }));
  };

  const calcNPS = () => {
    const m = getVal('np-m'), a = getVal('np-a') || 30, ra = getVal('np-ra') || 60, r = getVal('np-r') / 100 / 12, ap = getVal('np-ap') / 100, ar = getVal('np-ar') / 100 / 12, n = (ra - a) * 12;
    if (n <= 0 || !m) return;
    const corp = m * (Math.pow(1 + r, n) - 1) / r * (1 + r), inv = m * n, ls = corp * (1 - ap), ann = corp * ap, pen = ann * ar / (1 - Math.pow(1 + ar, -240));
    setResults(p => ({ ...p, np: { inv: fmt(inv), cor: fmt(corp), ls: fmt(ls), aa: fmt(ann), pen: fmt(pen) + '/mo', wm: (corp / inv).toFixed(1) + 'x' } }));
    setVisibleRes(p => ({ ...p, np: true }));
  };

  const calcRetire = () => {
    const e = getVal('rt-e'), a = getVal('rt-a') || 35, ra = getVal('rt-ra') || 60, le = getVal('rt-le') || 85, inf = getVal('rt-inf') / 100, ret = getVal('rt-ret') / 100;
    const ytr = ra - a, ry = le - ra, fe = e * Math.pow(1 + inf, ytr), corp = fe * 12 * (1 - Math.pow((1 + inf / 12) / (1 + ret / 12), ry * 12)) / (ret - inf), mr = ret / 12, sip = corp * mr / (Math.pow(1 + mr, ytr * 12) - 1) / (1 + mr);
    setResults(p => ({ ...p, rt: { fe: fmt(fe) + '/mo', cr: fmt(corp), sip: fmt(sip) + '/mo', ry: ry + ' yrs', tip: 'At ' + (inf * 100) + '% inflation, ₹' + Math.round(e).toLocaleString('en-IN') + '/mo today becomes ₹' + Math.round(fe).toLocaleString('en-IN') + '/mo at retirement. Start investing early!' } }));
    setVisibleRes(p => ({ ...p, rt: true }));
  };

  const calcEPFO = () => {
    const s = getVal('ep-s'), r = getVal('ep-r') / 100, ob = getVal('ep-ob'), mo = getVal('ep-mo') || 12, vpf = getVal('ep-vpf');
    const emp = s * .12, erEpf = s * .0367, erEps = s * .0833, monthly = emp + erEpf + vpf, mr = r / 12;
    let bal = ob, totInt = 0; const rows = [];
    for (let i = 1; i <= mo; i++) { bal += monthly; const int = bal * mr; totInt += int; bal += int; rows.push({ m: i, c: Math.round(monthly), i: Math.round(int), b: Math.round(bal) }); }
    setResults(p => ({ ...p, ep: { ec: fmt(emp * mo), er: fmt((erEpf + erEps) * mo), vp: fmt(vpf * mo), td: fmt(monthly * mo + ob), ie: fmt(totInt), cb: fmt(bal), rows } }));
    setVisibleRes(p => ({ ...p, ep: true }));
  };

  const calcBMI = () => {
    const w = getVal('bm-w'), h = getVal('bm-h') / 100;
    if (!w || !h) return;
    const b = w / (h * h); let cat, tip;
    if (b < 18.5) { cat = 'Underweight'; tip = 'You are underweight. Consider a balanced, calorie-rich diet and consult a nutritionist.'; }
    else if (b < 25) { cat = 'Normal weight — Healthy range'; tip = 'Great! Maintain it with regular exercise and balanced nutrition.'; }
    else if (b < 30) { cat = 'Overweight'; tip = 'Slightly overweight. Regular exercise and mindful eating will help.'; }
    else { cat = 'Obese'; tip = 'Please consult a doctor for lifestyle and medical guidance.'; }
    setResults(p => ({ ...p, bm: { v: b.toFixed(1), c: cat, t: tip } }));
    setVisibleRes(p => ({ ...p, bm: true }));
  };

  const calcAge = () => {
    const pd = (s: string) => { const p = s.split('/'); return p.length === 3 ? new Date(+p[2], +p[1] - 1, +p[0]) : null; };
    const dob = pd(getStr('ag-d')), toStr = getStr('ag-t'), to = toStr ? pd(toStr) : new Date();
    if (!dob || isNaN(dob.getTime())) { setResults(p => ({ ...p, ag: { err: 'Enter date as DD/MM/YYYY' } })); setVisibleRes(p => ({ ...p, ag: true })); return; }
    let y = to.getFullYear() - dob.getFullYear(), m = to.getMonth() - dob.getMonth(), d = to.getDate() - dob.getDate();
    if (d < 0) { m--; d += new Date(to.getFullYear(), to.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    const td = Math.floor((to.getTime() - dob.getTime()) / 86400000);
    const next = new Date(to.getFullYear(), dob.getMonth(), dob.getDate());
    if (next <= to) next.setFullYear(next.getFullYear() + 1);
    const dn = Math.floor((next.getTime() - to.getTime()) / 86400000);
    setResults(p => ({ ...p, ag: { y, m, da: d, td: td.toLocaleString('en-IN'), nb: dn + ' days' } }));
    setVisibleRes(p => ({ ...p, ag: true }));
  };

  const calcCur = () => {
    const a = getVal('cx-a'), f = getStr('cx-f'), t = getStr('cx-t'), res = a * rates[f] / rates[t];
    setResults(p => ({ ...p, cx: { l: a + ' ' + f + ' =', v: res.toFixed(2) + ' ' + t, r: '1 ' + f + ' = ' + (rates[f] / rates[t]).toFixed(4) + ' ' + t + '  (Approx. ref. rates)' } }));
    setVisibleRes(p => ({ ...p, cx: true }));
  };

  const calcFuel = () => {
    const d = getVal('fu-d'), mi = getVal('fu-mi') || 1, p = getVal('fu-p');
    const fl = d / mi, tc = fl * p;
    setResults(p => ({ ...p, fu: { fl: fl.toFixed(2) + ' L', tc: fmt(tc), pk: '₹' + (tc / d).toFixed(2) } }));
    setVisibleRes(p => ({ ...p, fu: true }));
  };

  const calcUnit = () => {
    const c = unCat, v = getVal('un-v'), fi = unFrom, ti = unTo, d = uData[c];
    let r;
    if (c === 'temp') {
      const u = d.u, f = u[fi], t = u[ti];
      if (f === t) r = v;
      else if (f === 'Celsius' && t === 'Fahrenheit') r = v * 9 / 5 + 32;
      else if (f === 'Celsius' && t === 'Kelvin') r = v + 273.15;
      else if (f === 'Fahrenheit' && t === 'Celsius') r = (v - 32) * 5 / 9;
      else if (f === 'Fahrenheit' && t === 'Kelvin') r = (v - 32) * 5 / 9 + 273.15;
      else if (f === 'Kelvin' && t === 'Celsius') r = v - 273.15;
      else r = (v - 273.15) * 9 / 5 + 32;
    } else { r = v * d.b[fi] / d.b[ti]; }
    setResults(p => ({ ...p, un: { l: v + ' ' + d.u[fi] + ' =', rv: parseFloat(r.toFixed(6)) + ' ' + d.u[ti] } }));
    setVisibleRes(p => ({ ...p, un: true }));
  };

  const filteredTabs = TABS.filter(t => activeCat === 'all' || t.cat === activeCat);

  useEffect(() => {
    if (!filteredTabs.find(t => t.id === activeTab)) {
      setActiveTab(filteredTabs[0].id);
    }
  }, [activeCat, activeTab, filteredTabs]);

  return (
    <div className="hub">
      <div className="hdr">
        <h2>All-in-One Calculator</h2>
        <span className="bdg bdg-g">16 Calculators</span>
        <span className="bdg bdg-b">Daily Life</span>
        <span className="bdg bdg-o">India</span>
      </div>

      <div className="cat-row">
        {['all', 'finance', 'tax', 'invest', 'retirement', 'life', 'convert'].map(cat => (
          <button key={cat} className={`cat-btn ${activeCat === cat ? 'on' : ''}`} onClick={() => setActiveCat(cat)}>
            {cat === 'all' ? 'All' : cat === 'tax' ? 'Tax & GST' : cat === 'invest' ? 'Investment' : cat === 'life' ? 'Daily Life' : cat === 'convert' ? 'Converters' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="tabs-row">
        {filteredTabs.map(t => (
          <button key={t.id} className={`tb ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div id="panels">
        <div className={`panel ${activeTab === 'basic' ? 'active' : ''}`} style={panelStyle('basic')} id="p-basic">
          <div className="card">
            <div className="cg-grid">
              <div className="cd" id="cd">{calcState.display}</div><div className="cs2" id="cs">{calcState.sub}</div>
              <button className="ck cl" onClick={() => ck('C')}>C</button><button className="ck op" onClick={() => ck('+/-')}>+/-</button><button className="ck op" onClick={() => ck('%')}>%</button><button className="ck op" onClick={() => ck('/')}>÷</button>
              <button className="ck" onClick={() => ck('7')}>7</button><button className="ck" onClick={() => ck('8')}>8</button><button className="ck" onClick={() => ck('9')}>9</button><button className="ck op" onClick={() => ck('*')}>×</button>
              <button className="ck" onClick={() => ck('4')}>4</button><button className="ck" onClick={() => ck('5')}>5</button><button className="ck" onClick={() => ck('6')}>6</button><button className="ck op" onClick={() => ck('-')}>−</button>
              <button className="ck" onClick={() => ck('1')}>1</button><button className="ck" onClick={() => ck('2')}>2</button><button className="ck" onClick={() => ck('3')}>3</button><button className="ck op" onClick={() => ck('+')}>+</button>
              <button className="ck sp2" onClick={() => ck('0')}>0</button><button className="ck" onClick={() => ck('.')}>.</button><button className="ck eq" onClick={() => ck('=')}>=</button>
            </div>
          </div>
        </div>

        <div className={`panel ${activeTab === 'emi' ? 'active' : ''}`} style={panelStyle('emi')} id="p-emi">
          <div className="card">
            <div className="ctitle">EMI / Loan Calculator</div>
            <div className="row2"><div><label>Loan Amount (₹)</label><input type="number" id="emi-p" placeholder="500000" /></div><div><label>Annual Rate (%)</label><input type="number" id="emi-r" placeholder="8.5" step=".1" /></div></div>
            <div className="row2 mt"><div><label>Tenure (Months)</label><input type="number" id="emi-n" placeholder="60" /></div><div><label>Loan Type</label><select id="emi-t"><option>Home</option><option>Car</option><option>Personal</option><option>Education</option></select></div></div>
            <button className="cbtn" onClick={calcEMI}>Calculate EMI</button>
            {visibleRes.emi && (
              <div className="mres" id="emi-res">
                <div className="mc"><div className="l">Monthly EMI</div><div className="v">{results.emi?.m}</div></div>
                <div className="mc b"><div className="l">Total Amount</div><div className="v">{results.emi?.tot}</div></div>
                <div className="mc w"><div className="l">Total Interest</div><div className="v">{results.emi?.int}</div></div>
                <div className="mc"><div className="l">Interest %</div><div className="v">{results.emi?.ip}</div></div>
              </div>
            )}
          </div>
        </div>

        <div className={`panel ${activeTab === 'interest' ? 'active' : ''}`} style={panelStyle('interest')} id="p-interest">
          <div className="card">
            <div className="ctitle">Simple &amp; Compound Interest</div>
            <div className="row2"><div><label>Principal (₹)</label><input type="number" id="si-p" placeholder="10000" /></div><div><label>Annual Rate (%)</label><input type="number" id="si-r" placeholder="7" step=".1" /></div></div>
            <div className="row2 mt"><div><label>Time (Years)</label><input type="number" id="si-t" placeholder="5" /></div><div><label>Compound Frequency</label><select id="si-f"><option value="1">Yearly</option><option value="2">Half-Yearly</option><option value="4">Quarterly</option><option value="12">Monthly</option></select></div></div>
            <button className="cbtn" onClick={calcSI}>Calculate</button>
            {visibleRes.si && (
              <div className="mres" id="si-res">
                <div className="mc"><div className="l">Simple Interest</div><div className="v">{results.si?.si}</div></div>
                <div className="mc"><div className="l">SI Maturity</div><div className="v">{results.si?.sm}</div></div>
                <div className="mc b"><div className="l">Compound Interest</div><div className="v">{results.si?.ci}</div></div>
                <div className="mc g"><div className="l">CI Maturity</div><div className="v">{results.si?.cm}</div></div>
              </div>
            )}
          </div>
        </div>

        <div className={`panel ${activeTab === 'discount' ? 'active' : ''}`} style={panelStyle('discount')} id="p-discount">
          <div className="card">
            <div className="ctitle">Discount Calculator</div>
            <div className="row2"><div><label>Original Price (₹)</label><input type="number" id="dc-p" placeholder="2000" /></div><div><label>Discount (%)</label><input type="number" id="dc-d" placeholder="30" /></div></div>
            <div className="row2 mt"><div><label>Extra Coupon (₹)</label><input type="number" id="dc-c" placeholder="0" /></div><div></div></div>
            <button className="cbtn" onClick={calcDisc}>Calculate Savings</button>
            {visibleRes.dc && (
              <div className="mres" id="dc-res">
                <div className="mc"><div className="l">Discount Amount</div><div className="v">{results.dc?.da}</div></div>
                <div className="mc g"><div className="l">Final Price</div><div className="v">{results.dc?.fp}</div></div>
                <div className="mc b"><div className="l">Total Saved</div><div className="v">{results.dc?.ts}</div></div>
                <div className="mc"><div className="l">Effective %</div><div className="v">{results.dc?.ep}</div></div>
              </div>
            )}
          </div>
        </div>

        <div className={`panel ${activeTab === 'tip' ? 'active' : ''}`} style={panelStyle('tip')} id="p-tip">
          <div className="card">
            <div className="ctitle">Tip &amp; Bill Splitter</div>
            <div className="row2"><div><label>Bill Amount (₹)</label><input type="number" id="tp-b" placeholder="1500" /></div><div><label>Tip %</label><select id="tp-p"><option value="5">5%</option><option value="10" defaultValue="10">10%</option><option value="15">15%</option><option value="18">18%</option><option value="20">20%</option><option value="25">25%</option></select></div></div>
            <div className="row2 mt"><div><label>Number of People</label><input type="number" id="tp-n" placeholder="4" /></div><div></div></div>
            <button className="cbtn" onClick={calcTip}>Split Bill</button>
            {visibleRes.tp && (
              <div className="mres" id="tp-res">
                <div className="mc"><div className="l">Tip Amount</div><div className="v">{results.tp?.ta}</div></div>
                <div className="mc b"><div className="l">Total Bill</div><div className="v">{results.tp?.tb}</div></div>
                <div className="mc g"><div className="l">Per Person</div><div className="v">{results.tp?.pp}</div></div>
                <div className="mc"><div className="l">Tip Per Person</div><div className="v">{results.tp?.tp}</div></div>
              </div>
            )}
          </div>
        </div>

        <div className={`panel ${activeTab === 'tax' ? 'active' : ''}`} style={panelStyle('tax')} id="p-tax">
          <div className="card">
            <div className="ctitle">Income Tax Estimator — India FY 2024-25</div>
            <div className="row2"><div><label>Annual Income (₹)</label><input type="number" id="tx-inc" placeholder="800000" /></div><div><label>Regime</label><select id="tx-reg" value={txReg} onChange={e => setTxReg(e.target.value)}><option value="new">New Regime</option><option value="old">Old Regime</option></select></div></div>
            {txReg === 'old' && (
              <div id="tx-old">
                <div className="row2 mt"><div><label>80C Investments (₹)</label><input type="number" id="tx-80c" placeholder="150000" /></div><div><label>HRA Exemption (₹)</label><input type="number" id="tx-hra" placeholder="0" /></div></div>
                <div className="row2 mt"><div><label>Other Deductions (₹)</label><input type="number" id="tx-oth" placeholder="0" /></div><div><label>Standard Deduction (₹)</label><input type="number" id="tx-std" defaultValue="50000" /></div></div>
              </div>
            )}
            <button className="cbtn" onClick={calcTax}>Calculate Tax</button>
            {visibleRes.tx && (
              <div className="mres" id="tx-res">
                <div className="mc"><div className="l">Taxable Income</div><div className="v">{results.tx?.ti}</div></div>
                <div className="mc w"><div className="l">Income Tax</div><div className="v">{results.tx?.tx}</div></div>
                <div className="mc"><div className="l">Cess (4%)</div><div className="v">{results.tx?.cs}</div></div>
                <div className="mc w"><div className="l">Total Tax</div><div className="v">{results.tx?.tt}</div></div>
                <div className="mc"><div className="l">Monthly Tax</div><div className="v">{results.tx?.mt}</div></div>
                <div className="mc g"><div className="l">In-hand Yearly</div><div className="v">{results.tx?.ih}</div></div>
              </div>
            )}
          </div>
        </div>

        <div className={`panel ${activeTab === 'gst' ? 'active' : ''}`} style={panelStyle('gst')} id="p-gst">
          <div className="card">
            <div className="ctitle">GST Calculator</div>
            <div className="row2"><div><label>Amount (₹)</label><input type="number" id="gs-a" placeholder="1000" /></div><div><label>GST Rate</label><select id="gs-r"><option value="5">5%</option><option value="12">12%</option><option value="18" defaultValue="18">18%</option><option value="28">28%</option></select></div></div>
            <div className="row2 mt"><div><label>Type</label><select id="gs-t"><option value="add">Add GST (Excl→Incl)</option><option value="rem">Remove GST (Incl→Excl)</option></select></div><div></div></div>
            <button className="cbtn" onClick={calcGST}>Calculate GST</button>
            {visibleRes.gs && (
              <div className="mres" id="gs-res">
                <div className="mc"><div className="l">Base Amount</div><div className="v">{results.gs?.ba}</div></div>
                <div className="mc"><div className="l">CGST</div><div className="v">{results.gs?.cg}</div></div>
                <div className="mc"><div className="l">SGST</div><div className="v">{results.gs?.sg}</div></div>
                <div className="mc b"><div className="l">Total GST</div><div className="v">{results.gs?.tg}</div></div>
                <div className="mc g"><div className="l">Final Amount</div><div className="v">{results.gs?.fa}</div></div>
              </div>
            )}
          </div>
        </div>

        <div className={`panel ${activeTab === 'sip' ? 'active' : ''}`} style={panelStyle('sip')} id="p-sip">
          <div className="card">
            <div className="ctitle">SIP — Systematic Investment Plan</div>
            <div className="row2"><div><label>Monthly SIP (₹)</label><input type="number" id="sp-m" placeholder="5000" /></div><div><label>Annual Return (%)</label><input type="number" id="sp-r" placeholder="12" step=".5" /></div></div>
            <div className="row2 mt"><div><label>Period (Years)</label><input type="number" id="sp-y" placeholder="15" /></div><div><label>Type</label><select id="sp-t"><option value="reg">Regular SIP</option><option value="step">Step-up SIP (10%/yr)</option></select></div></div>
            <button className="cbtn" onClick={calcSIP}>Calculate Returns</button>
            {visibleRes.sp && (
              <div id="sp-res">
                <div className="mres" style={{ display: 'grid' }}>
                  <div className="mc"><div className="l">Total Invested</div><div className="v">{results.sp?.inv}</div></div>
                  <div className="mc b"><div className="l">Est. Returns</div><div className="v">{results.sp?.ret}</div></div>
                  <div className="mc g"><div className="l">Maturity Value</div><div className="v">{results.sp?.mat}</div></div>
                  <div className="mc"><div className="l">Wealth Gained</div><div className="v">{results.sp?.mul}</div></div>
                </div>
                <div className="bar-w"><div className="bar-i" style={{ width: results.sp?.bi }}></div><div className="bar-r" style={{ width: results.sp?.br }}></div></div>
                <div className="bleg"><div className="leg"><div className="dot" style={{ background: '#1D9E75' }}></div>Invested</div><div className="leg"><div className="dot" style={{ background: '#378ADD' }}></div>Returns</div></div>
              </div>
            )}
          </div>
        </div>

        <div className={`panel ${activeTab === 'lumpsum' ? 'active' : ''}`} style={panelStyle('lumpsum')} id="p-lumpsum">
          <div className="card">
            <div className="ctitle">Lump Sum Investment Calculator</div>
            <div className="row2"><div><label>Amount (₹)</label><input type="number" id="ls-a" placeholder="100000" /></div><div><label>Annual Return (%)</label><input type="number" id="ls-r" placeholder="12" step=".5" /></div></div>
            <div className="row2 mt"><div><label>Period (Years)</label><input type="number" id="ls-y" placeholder="10" /></div><div></div></div>
            <button className="cbtn" onClick={calcLS}>Calculate</button>
            {visibleRes.ls && (
              <div className="mres" id="ls-res">
                <div className="mc"><div className="l">Principal</div><div className="v">{results.ls?.p}</div></div>
                <div className="mc b"><div className="l">Gains</div><div className="v">{results.ls?.g}</div></div>
                <div className="mc g"><div className="l">Maturity</div><div className="v">{results.ls?.m}</div></div>
                <div className="mc"><div className="l">CAGR</div><div className="v">{results.ls?.c}</div></div>
              </div>
            )}
          </div>
        </div>

        <div className={`panel ${activeTab === 'mf' ? 'active' : ''}`} style={panelStyle('mf')} id="p-mf">
          <div className="card">
            <div className="ctitle">Mutual Fund Returns (NAV Based)</div>
            <div className="row2"><div><label>Investment (₹)</label><input type="number" id="mf-a" placeholder="50000" /></div><div><label>Purchase NAV (₹)</label><input type="number" id="mf-bn" placeholder="25.50" step=".01" /></div></div>
            <div className="row2 mt"><div><label>Current NAV (₹)</label><input type="number" id="mf-cn" placeholder="42.80" step=".01" /></div><div><label>Holding (Years)</label><input type="number" id="mf-y" placeholder="3" step=".5" /></div></div>
            <div className="row2 mt"><div><label>Fund Type</label><select id="mf-t"><option value="eq">Equity (LTCG 12.5%)</option><option value="debt">Debt (Slab Rate)</option><option value="elss">ELSS (80C)</option><option value="hybrid">Hybrid</option></select></div><div></div></div>
            <button className="cbtn" onClick={calcMF}>Calculate Returns</button>
            {visibleRes.mf && (
              <>
                <div className="mres" id="mf-res">
                  <div className="mc"><div className="l">Units</div><div className="v">{results.mf?.u}</div></div>
                  <div className="mc"><div className="l">Current Value</div><div className="v">{results.mf?.cv}</div></div>
                  <div className="mc b"><div className="l">Absolute Return</div><div className="v">{results.mf?.ar}</div></div>
                  <div className="mc g"><div className="l">CAGR</div><div className="v">{results.mf?.cg}</div></div>
                  <div className="mc w"><div className="l">Est. Tax</div><div className="v">{results.mf?.tx}</div></div>
                  <div className="mc g"><div className="l">Post-tax Gain</div><div className="v">{results.mf?.pg}</div></div>
                </div>
                <div className="tip" id="mf-tip">{results.mf?.tip}</div>
              </>
            )}
          </div>
        </div>

        <div className={`panel ${activeTab === 'goal' ? 'active' : ''}`} style={panelStyle('goal')} id="p-goal">
          <div className="card">
            <div className="ctitle">Goal-based Investment Planner</div>
            <div className="row2"><div><label>Target Corpus (₹)</label><input type="number" id="gl-c" placeholder="5000000" /></div><div><label>Time (Years)</label><input type="number" id="gl-y" placeholder="20" /></div></div>
            <div className="row2 mt"><div><label>Expected Return (%)</label><input type="number" id="gl-r" placeholder="12" step=".5" /></div><div><label>Existing Savings (₹)</label><input type="number" id="gl-e" placeholder="0" /></div></div>
            <button className="cbtn" onClick={calcGoal}>How much to invest?</button>
            {visibleRes.gl && (
              <div className="mres" id="gl-res">
                <div className="mc g"><div className="l">Monthly SIP Required</div><div className="v">{results.gl?.s}</div></div>
                <div className="mc b"><div className="l">Lump Sum Required</div><div className="v">{results.gl?.l}</div></div>
                <div className="mc"><div className="l">Total SIP Investment</div><div className="v">{results.gl?.t}</div></div>
                <div className="mc"><div className="l">Wealth Gained</div><div className="v">{results.gl?.g}</div></div>
              </div>
            )}
          </div>
        </div>

        <div className={`panel ${activeTab === 'nps' ? 'active' : ''}`} style={panelStyle('nps')} id="p-nps">
          <div className="card">
            <div className="ctitle">NPS — National Pension System</div>
            <div className="row2"><div><label>Monthly Contribution (₹)</label><input type="number" id="np-m" placeholder="5000" /></div><div><label>Current Age</label><input type="number" id="np-a" placeholder="30" /></div></div>
            <div className="row2 mt"><div><label>Retirement Age</label><input type="number" id="np-ra" placeholder="60" /></div><div><label>Expected Return (%)</label><input type="number" id="np-r" placeholder="10" step=".5" /></div></div>
            <div className="row2 mt"><div><label>Annuity %</label><select id="np-ap"><option value="40">40% (min)</option><option value="50" defaultValue="50">50%</option><option value="60">60%</option><option value="80">80%</option><option value="100">100%</option></select></div><div><label>Annuity Return (%)</label><input type="number" id="np-ar" placeholder="6" step=".5" /></div></div>
            <button className="cbtn" onClick={calcNPS}>Calculate NPS Corpus</button>
            {visibleRes.np && (
              <div className="mres" id="np-res">
                <div className="mc"><div className="l">Total Invested</div><div className="v">{results.np?.inv}</div></div>
                <div className="mc b"><div className="l">Total Corpus</div><div className="v">{results.np?.cor}</div></div>
                <div className="mc"><div className="l">Lump Sum (60%)</div><div className="v">{results.np?.ls}</div></div>
                <div className="mc"><div className="l">Annuity Amount</div><div className="v">{results.np?.aa}</div></div>
                <div className="mc g"><div className="l">Monthly Pension</div><div className="v">{results.np?.pen}</div></div>
                <div className="mc"><div className="l">Wealth Multiple</div><div className="v">{results.np?.wm}</div></div>
              </div>
            )}
            <div className="tip" style={{ marginTop: '10px' }}>NPS Tier-1: ₹1.5L under 80C + extra ₹50K under 80CCD(1B). 60% lump sum withdrawal is fully tax-free at maturity.</div>
          </div>
        </div>

        <div className={`panel ${activeTab === 'retire' ? 'active' : ''}`} style={panelStyle('retire')} id="p-retire">
          <div className="card">
            <div className="ctitle">Retirement Corpus Estimator</div>
            <div className="row2"><div><label>Monthly Expenses Now (₹)</label><input type="number" id="rt-e" placeholder="40000" /></div><div><label>Current Age</label><input type="number" id="rt-a" placeholder="35" /></div></div>
            <div className="row2 mt"><div><label>Retirement Age</label><input type="number" id="rt-ra" placeholder="60" /></div><div><label>Life Expectancy</label><input type="number" id="rt-le" placeholder="85" /></div></div>
            <div className="row2 mt"><div><label>Inflation Rate (%)</label><input type="number" id="rt-inf" placeholder="6" step=".5" /></div><div><label>Post-Retirement Return (%)</label><input type="number" id="rt-ret" placeholder="7" step=".5" /></div></div>
            <button className="cbtn" onClick={calcRetire}>Estimate Corpus</button>
            {visibleRes.rt && (
              <>
                <div className="mres" id="rt-res">
                  <div className="mc"><div className="l">Future Monthly Expense</div><div className="v">{results.rt?.fe}</div></div>
                  <div className="mc b"><div className="l">Corpus Required</div><div className="v">{results.rt?.cr}</div></div>
                  <div className="mc g"><div className="l">Monthly SIP Needed</div><div className="v">{results.rt?.sip}</div></div>
                  <div className="mc"><div className="l">Retirement Years</div><div className="v">{results.rt?.ry}</div></div>
                </div>
                <div className="tip" id="rt-tip">{results.rt?.tip}</div>
              </>
            )}
          </div>
        </div>

        <div className={`panel ${activeTab === 'epfo' ? 'active' : ''}`} style={panelStyle('epfo')} id="p-epfo">
          <div className="card">
            <div className="ctitle">EPFO / PF Interest Calculator — FY 2024-25 (8.25%)</div>
            <div className="row2"><div><label>Basic + DA (₹/month)</label><input type="number" id="ep-s" placeholder="30000" /></div><div><label>Interest Rate (%)</label><input type="number" id="ep-r" defaultValue="8.25" step=".05" /></div></div>
            <div className="row2 mt"><div><label>Opening Balance (₹)</label><input type="number" id="ep-ob" placeholder="0" /></div><div><label>Months</label><input type="number" id="ep-mo" placeholder="12" max="12" /></div></div>
            <div className="row2 mt"><div><label>VPF Extra (₹/month)</label><input type="number" id="ep-vpf" placeholder="0" /></div><div></div></div>
            <button className="cbtn" onClick={calcEPFO}>Calculate PF Interest</button>
            {visibleRes.ep && (
              <>
                <div className="mres" id="ep-res">
                  <div className="mc"><div className="l">Employee (12%)</div><div className="v">{results.ep?.ec}</div></div>
                  <div className="mc"><div className="l">Employer (EPF+EPS)</div><div className="v">{results.ep?.er}</div></div>
                  <div className="mc"><div className="l">VPF</div><div className="v">{results.ep?.vp}</div></div>
                  <div className="mc b"><div className="l">Total Deposited</div><div className="v">{results.ep?.td}</div></div>
                  <div className="mc g"><div className="l">Interest Earned</div><div className="v">{results.ep?.ie}</div></div>
                  <div className="mc g"><div className="l">Closing Balance</div><div className="v">{results.ep?.cb}</div></div>
                </div>
                <div id="ep-tbl">
                  <table className="epf-tbl">
                    <thead><tr><th>Month</th><th>Contribution</th><th>Interest</th><th>Balance</th></tr></thead>
                    <tbody>
                      {results.ep?.rows?.map((r: any) => (
                        <tr key={r.m}><td>{r.m}</td><td>₹{r.c.toLocaleString('en-IN')}</td><td>₹{r.i.toLocaleString('en-IN')}</td><td>₹{r.b.toLocaleString('en-IN')}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="tip" style={{ marginTop: '10px' }} id="ep-note">PF interest calculated monthly, credited annually after March 31. VPF earns the same rate as EPF and is fully tax-free.</div>
              </>
            )}
          </div>
        </div>

        <div className={`panel ${activeTab === 'bmi' ? 'active' : ''}`} style={panelStyle('bmi')} id="p-bmi">
          <div className="card">
            <div className="ctitle">BMI Calculator</div>
            <div className="row3"><div><label>Weight (kg)</label><input type="number" id="bm-w" placeholder="70" /></div><div><label>Height (cm)</label><input type="number" id="bm-h" placeholder="170" /></div><div><label>Age</label><input type="number" id="bm-a" placeholder="30" /></div></div>
            <button className="cbtn" onClick={calcBMI}>Calculate BMI</button>
            {visibleRes.bm && (
              <div className="rbox show" id="bm-res"><div className="rl">Your BMI</div><div className="rv" id="bm-v">{results.bm?.v}</div><div className="rs" id="bm-c">{results.bm?.c}</div><div className="tip" id="bm-t" style={{ marginTop: '8px' }}>{results.bm?.t}</div></div>
            )}
          </div>
        </div>

        <div className={`panel ${activeTab === 'age' ? 'active' : ''}`} style={panelStyle('age')} id="p-age">
          <div className="card">
            <div className="ctitle">Age Calculator</div>
            <div className="row2"><div><label>Date of Birth (DD/MM/YYYY)</label><input type="text" id="ag-d" placeholder="15/08/1990" /></div><div><label>As of Date (leave blank = today)</label><input type="text" id="ag-t" placeholder="DD/MM/YYYY" /></div></div>
            <button className="cbtn" onClick={calcAge}>Calculate Age</button>
            {visibleRes.ag && (
              <>
                {results.ag?.err ? (
                  <div className="tip" style={{ marginTop: '10px' }}>{results.ag.err}</div>
                ) : (
                  <div className="mres" id="ag-res">
                    <div className="mc"><div className="l">Years</div><div className="v">{results.ag?.y}</div></div>
                    <div className="mc"><div className="l">Months</div><div className="v">{results.ag?.m}</div></div>
                    <div className="mc"><div className="l">Days</div><div className="v">{results.ag?.da}</div></div>
                    <div className="mc b"><div className="l">Total Days</div><div className="v">{results.ag?.td}</div></div>
                    <div className="mc g"><div className="l">Next Birthday</div><div className="v">{results.ag?.nb}</div></div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className={`panel ${activeTab === 'currency' ? 'active' : ''}`} style={panelStyle('currency')} id="p-currency">
          <div className="card">
            <div className="ctitle">Currency Converter (Approx. Rates)</div>
            <div className="row2"><div><label>Amount</label><input type="number" id="cx-a" placeholder="1000" /></div><div><label>From</label><select id="cx-f"><option value="INR">INR</option><option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="AED">AED</option><option value="SGD">SGD</option><option value="JPY">JPY</option><option value="CAD">CAD</option><option value="AUD">AUD</option></select></div></div>
            <div className="row2 mt"><div><label>To</label><select id="cx-t"><option value="USD" defaultValue="USD">USD</option><option value="INR">INR</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="AED">AED</option><option value="SGD">SGD</option><option value="JPY">JPY</option><option value="CAD">CAD</option><option value="AUD">AUD</option></select></div><div></div></div>
            <button className="cbtn" onClick={calcCur}>Convert</button>
            {visibleRes.cx && (
              <div className="rbox show" id="cx-res"><div className="rl" id="cx-l">{results.cx?.l}</div><div className="rv" id="cx-v">{results.cx?.v}</div><div className="rs" id="cx-r">{results.cx?.r}</div></div>
            )}
          </div>
        </div>

        <div className={`panel ${activeTab === 'fuel' ? 'active' : ''}`} style={panelStyle('fuel')} id="p-fuel">
          <div className="card">
            <div className="ctitle">Fuel Cost Calculator</div>
            <div className="row2"><div><label>Distance (km)</label><input type="number" id="fu-d" placeholder="200" /></div><div><label>Mileage (km/litre)</label><input type="number" id="fu-mi" placeholder="15" /></div></div>
            <div className="row2 mt"><div><label>Fuel Price (₹/litre)</label><input type="number" id="fu-p" placeholder="105" /></div><div><label>Fuel Type</label><select id="fu-t"><option>Petrol</option><option>Diesel</option><option>CNG</option></select></div></div>
            <button className="cbtn" onClick={calcFuel}>Calculate Cost</button>
            {visibleRes.fu && (
              <div className="mres" id="fu-res">
                <div className="mc"><div className="l">Fuel Required</div><div className="v">{results.fu?.fl}</div></div>
                <div className="mc g"><div className="l">Total Cost</div><div className="v">{results.fu?.tc}</div></div>
                <div className="mc b"><div className="l">Cost per km</div><div className="v">{results.fu?.pk}</div></div>
              </div>
            )}
          </div>
        </div>

        <div className={`panel ${activeTab === 'unit' ? 'active' : ''}`} style={panelStyle('unit')} id="p-unit">
          <div className="card">
            <div className="ctitle">Unit Converter</div>
            <div className="row2">
              <div><label>Category</label><select id="un-c" value={unCat} onChange={e => { setUnCat(e.target.value); setUnFrom(0); setUnTo(1); }}><option value="length">Length</option><option value="weight">Weight</option><option value="temp">Temperature</option><option value="area">Area</option><option value="volume">Volume</option><option value="speed">Speed</option><option value="time">Time</option><option value="data">Data</option></select></div>
              <div><label>Value</label><input type="number" id="un-v" placeholder="100" /></div>
            </div>
            <div className="row2 mt">
              <div><label>From</label><select id="un-f" value={unFrom} onChange={e => setUnFrom(Number(e.target.value))}>{uData[unCat].u.map((u: string, i: number) => <option key={i} value={i}>{u}</option>)}</select></div>
              <div><label>To</label><select id="un-t" value={unTo} onChange={e => setUnTo(Number(e.target.value))}>{uData[unCat].u.map((u: string, i: number) => <option key={i} value={i}>{u}</option>)}</select></div>
            </div>
            <button className="cbtn" onClick={calcUnit}>Convert</button>
            {visibleRes.un && (
              <div className="rbox show" id="un-res"><div className="rl" id="un-l">{results.un?.l}</div><div className="rv" id="un-rv">{results.un?.rv}</div></div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
