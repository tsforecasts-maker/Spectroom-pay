// iSpectrum chart page: M30 candles (MT4 feed) + iSpectrum projection lines, drawn with TradingView Lightweight Charts.
// No framework, no cookies, no trackers. Talks only to the `chart` edge function. Times are broker server time = MSK.
(function () {
  "use strict";
  var API = "https://tosszbmacumhmmdyegol.supabase.co/functions/v1/chart";
  var LWC = window.LightweightCharts;
  var SYMS = ["BTCUSD", "EURUSD", "GBPUSD", "HK50", "NAS100", "US500", "WTI", "XAUUSD"];
  var T = {
    en: {
      h1: "iSpectrum projection chart", lead: "M30 prices with the current iSpectrum projection lines and background phase. Tap a line name to show or hide it.",
      free: "free", key_title: "Access key", key_desc: "The free instruments change every two weeks. The other instruments open with the access key you received after paying for a licence.",
      key_apply: "Apply", key_forget: "Forget", key_ok: "Key valid. Licence active until {d}.", key_ok_open: "Key valid.", key_bad: "This key is not valid or the licence has expired.",
      key_fmt: "A key looks like ISP-XXXX-XXXX-XXXX.", key_saved_note: "The key is stored only in this browser.", key_gone: "Key removed from this browser.",
      lock_t: "{s} needs an access key", lock_x: "This period {f} are open for free. The other instruments are part of the iSpectrum licence.",
      bad_t: "The key does not open {s}", bad_x: "The key is not valid or the licence has expired.",
      get: "Get a licence", enter: "Enter key", open_free: "Open {s}",
      busy_t: "Too many requests", busy_x: "Please wait about {n} s and try again.",
      err_t: "Data temporarily unavailable", err_x: "Please try again in a few minutes.", retry: "Retry", off_t: "The chart is switched off for now", loading: "Loading…",
      meta: "Package {v} · updated {u} · last M30 bar {b} · times MSK (UTC+3) · prices: MT4 feed", nopkg: "No projection published for this instrument yet.",
      Week: "Week", Intraday: "Intraday", Envelope: "Envelope", Stable: "Stable", Comp: "Comp", Middle: "Middle", Seasonal: "Seasonal", Background: "Background",
      tip: "{n}: click to show or hide",
      disc_b: "Not investment advice.", disc: "iSpectrum shows model-based projections for information only. They are not trading signals and do not guarantee future prices. Trading involves risk.",
      times: "All times MSK (UTC+3), broker server time.", prices: "Prices: MT4 feed.", tv1: "Chart library:", home: "Licence and screenshots", terms: "Terms", privacy: "Privacy",
    },
    ru: {
      h1: "График проекций iSpectrum", lead: "Цены M30 с текущими линиями проекции iSpectrum и фоном фаз. Нажмите на название линии, чтобы показать или скрыть её.",
      free: "бесплатно", key_title: "Ключ доступа", key_desc: "Бесплатные инструменты меняются раз в две недели. Остальные открываются ключом доступа, который вы получили после оплаты лицензии.",
      key_apply: "Применить", key_forget: "Забыть", key_ok: "Ключ действителен. Лицензия активна до {d}.", key_ok_open: "Ключ действителен.", key_bad: "Ключ недействителен или срок лицензии истёк.",
      key_fmt: "Ключ имеет вид ISP-XXXX-XXXX-XXXX.", key_saved_note: "Ключ хранится только в этом браузере.", key_gone: "Ключ удалён из этого браузера.",
      lock_t: "Для {s} нужен ключ доступа", lock_x: "В этот период бесплатно открыты {f}. Остальные инструменты входят в лицензию iSpectrum.",
      bad_t: "Ключ не открывает {s}", bad_x: "Ключ недействителен или срок лицензии истёк.",
      get: "Получить лицензию", enter: "Ввести ключ", open_free: "Открыть {s}",
      busy_t: "Слишком много запросов", busy_x: "Подождите около {n} с и попробуйте снова.",
      err_t: "Данные временно недоступны", err_x: "Попробуйте через несколько минут.", retry: "Повторить", off_t: "График пока выключен", loading: "Загрузка…",
      meta: "Пакет {v} · обновлён {u} · последний бар M30 {b} · время МСК (UTC+3) · цены: поток MT4", nopkg: "Проекция по этому инструменту пока не опубликована.",
      Week: "Week", Intraday: "Intraday", Envelope: "Envelope", Stable: "Stable", Comp: "Comp", Middle: "Middle", Seasonal: "Seasonal", Background: "Фон",
      tip: "{n}: нажмите, чтобы показать или скрыть",
      disc_b: "Не является инвестиционной рекомендацией.", disc: "iSpectrum показывает модельные проекции только для информации. Это не торговые сигналы и не гарантия будущих цен. Торговля связана с риском.",
      times: "Всё время указано по МСК (UTC+3), время сервера брокера.", prices: "Цены: поток MT4.", tv1: "Библиотека графиков:", home: "Лицензия и скриншоты", terms: "Условия", privacy: "Конфиденциальность",
    },
  };
  var qs = new URLSearchParams(location.search);
  var lang = qs.get("lang") || localStorage.getItem("isp_lang") || ((navigator.language || "").slice(0, 2) === "ru" ? "ru" : "en");
  if (!T[lang]) lang = "en";
  var $ = function (s) { return document.querySelector(s); }, $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  function t(k, v) { var s = T[lang][k] || k; if (v) Object.keys(v).forEach(function (x) { s = s.split("{" + x + "}").join(v[x]); }); return s; }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  var pad2 = function (n) { return (n < 10 ? "0" : "") + n; };
  // server clock seconds (already MSK) -> "dd.mm HH:MM"; real epoch -> MSK by +3 h
  function fmtSrv(sec, year) { var d = new Date(sec * 1000); return pad2(d.getUTCDate()) + "." + pad2(d.getUTCMonth() + 1) + (year ? "." + d.getUTCFullYear() : "") + " " + pad2(d.getUTCHours()) + ":" + pad2(d.getUTCMinutes()); }
  function fmtReal(sec, year) { return fmtSrv(sec + 3 * 3600, year); }
  function fmtDay(sec) { var d = new Date((sec + 3 * 3600) * 1000); return pad2(d.getUTCDate()) + "." + pad2(d.getUTCMonth() + 1) + "." + d.getUTCFullYear(); }

  // ---------------- state ----------------
  var free = ["BTCUSD", "NAS100"], keyOk = false, keyUntil = null;
  var sym = (qs.get("s") || localStorage.getItem("isp_chart_sym") || "BTCUSD").toUpperCase();
  if (SYMS.indexOf(sym) < 0) sym = "BTCUSD";
  var key = localStorage.getItem("isp_chart_key") || "";
  var vis = {}; try { vis = JSON.parse(localStorage.getItem("isp_chart_vis") || "{}"); } catch (e) { vis = {}; }
  var data = null, last = null, refreshTimer = null, loadSeq = 0;

  // ---------------- chart ----------------
  var box = $("#chart");
  var chart = LWC.createChart(box, {
    autoSize: true,
    layout: { background: { type: "solid", color: "#FFFFFF" }, textColor: "#555555", fontSize: 12, attributionLogo: true,
      fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif" },
    grid: { vertLines: { color: "#F0F0F0" }, horzLines: { color: "#EDEDED" } },
    rightPriceScale: { borderColor: "#C8C8C8", scaleMargins: { top: 0.08, bottom: 0.08 } },
    timeScale: { borderColor: "#C8C8C8", timeVisible: true, secondsVisible: false, rightOffset: 4, barSpacing: 4, minBarSpacing: 0.5 },
    crosshair: { mode: 0 },
    localization: { locale: lang === "ru" ? "ru-RU" : "en-GB" },
  });
  var MARGIN = 0.08;
  var series = {};   // id -> {s, kind, line, part}
  function clearSeries() { Object.keys(series).forEach(function (k) { try { chart.removeSeries(series[k].s); } catch (e) {} }); series = {}; }
  // MT4 line style -> Lightweight Charts LineStyle (0 solid, 1 dotted, 2 dashed, 3 large dashed, 4 sparse dotted)
  function lwStyle(mt) { return [0, 2, 1, 3, 4][mt] || 0; }
  function addLine(id, color, width, mtStyle, z) {
    var s = chart.addSeries(LWC.LineSeries, {
      color: color, lineWidth: mtStyle ? 1 : Math.max(1, Math.min(6, width)), lineStyle: lwStyle(mtStyle), lineType: 0,
      lastValueVisible: false, priceLineVisible: false, crosshairMarkerVisible: false, pointMarkersVisible: false,
      autoscaleInfoProvider: function () { return null; },   // projection layers never move the price scale (MT4 behaviour)
      priceFormat: { type: "custom", formatter: function () { return ""; } },
    });
    series[id] = { s: s, z: z };
    return s;
  }

  // ---------------- data shaping ----------------
  var STEP = 1800;
  function isWeekend(sec) { var d = new Date(sec * 1000).getUTCDay(); return d === 0 || d === 6; }
  // axis = bar times + future 30-min slots (no weekend slots for 5-day symbols) up to the end of the projections
  function buildAxis(d) {
    var bars = d.bars, p = d.package, ax = bars.map(function (b) { return b[0]; });
    var lastT = ax.length ? ax[ax.length - 1] : 0, maxT = lastT;
    if (p) p.lines.forEach(function (l) { var a = l.points; if (a.length) maxT = Math.max(maxT, a[a.length - 1][0]); });
    maxT = Math.min(maxT, lastT + 21 * 86400);
    var w7 = p && p.week_days === 7, fut = [];
    for (var x = lastT + STEP; x <= maxT; x += STEP) if (w7 || !isWeekend(x)) fut.push(x);
    return { all: ax.concat(fut), fut: fut, lastT: lastT };
  }
  // linear resampling of [t,v] points onto the axis times inside the point span
  function resample(pts, axis) {
    var out = [], j = 0, n = pts.length;
    if (n < 2) return out;
    var t0 = pts[0][0], t1 = pts[n - 1][0];
    for (var i = 0; i < axis.length; i++) {
      var x = axis[i]; if (x < t0) continue; if (x > t1) break;
      while (j < n - 2 && pts[j + 1][0] < x) j++;
      var a = pts[j], b = pts[j + 1], f = b[0] > a[0] ? (x - a[0]) / (b[0] - a[0]) : 0;
      out.push({ time: x, v: a[1] + (b[1] - a[1]) * Math.max(0, Math.min(1, f)) });
    }
    return out;
  }
  function range(arrs) { var lo = Infinity, hi = -Infinity; arrs.forEach(function (a) { a.forEach(function (q) { if (q.v < lo) lo = q.v; if (q.v > hi) hi = q.v; }); }); return [lo, hi]; }

  // layers: each one has its own [vmin..vmax] (MT4 IspLayerMap) mapped into the visible window minus the pads
  var layers = [];   // {ids:[...], parts:[{id, pts}], vmin, vmax, screen}
  function buildLayers(d, axis) {
    layers = [];
    var p = d.package; if (!p) return;
    var ui = p.ui || {}, wl = ui.wlbc, dash = ui.insample_dash || [];
    var order = ["Week", "Intraday", "Stable", "Comp", "Middle", "Seasonal"];
    var byName = {}; p.lines.forEach(function (l) { byName[l.name] = l; });
    // envelope (Intraday band): drawn under the lines, scaled together with the Intraday layer so the band wraps the line
    var il = byName.Intraday, envParts = [];
    if (il && il.env && il.env.length > 1) {
      var col = "#A06E46";   // MT4 envelope colour 160,110,70, width 1, solid
      addLine("env_hi", col, 1, 0); addLine("env_lo", col, 1, 0);
      envParts = [{ id: "env_hi", item: "Envelope", pts: resample(il.env.map(function (q) { return [q[0], q[1]]; }), axis) },
                  { id: "env_lo", item: "Envelope", pts: resample(il.env.map(function (q) { return [q[0], q[2]]; }), axis) }];
    }
    order.forEach(function (nm) {
      var l = byName[nm]; if (!l) return;
      var main = resample(l.points, axis), parts = [], width = l.width;
      if (nm === "Intraday") width = Math.max(2, Math.min(5, width));
      if (nm === "Intraday" && l.fit && l.fit.length > 1) {
        var lbc = l.lbc || (l.points.length ? l.points[0][0] : Infinity);
        var fit = resample(l.fit.filter(function (q) { return q[0] <= lbc; }), axis);
        if (fit.length > 1) { addLine(nm + "_fit", l.color, l.fit_width || 1, l.fit_style || 2); parts.push({ id: nm + "_fit", item: nm, pts: fit }); }
      }
      if (dash.indexOf(nm) >= 0 && wl) {
        var pre = main.filter(function (q) { return q.time <= wl; }), post = main.filter(function (q) { return q.time >= wl; });
        if (pre.length > 1) { addLine(nm + "_pre", l.color, 1, 1); parts.push({ id: nm + "_pre", item: nm, pts: pre }); main = post; }
      }
      addLine(nm, l.color, width, l.style); parts.push({ id: nm, item: nm, pts: main });
      if (nm === "Intraday") parts = envParts.concat(parts);
      var r = range(parts.map(function (q) { return q.pts; }));
      layers.push({ name: nm, color: l.color, width: width, style: l.style, parts: parts, vmin: r[0], vmax: r[1], screen: l.screen });
    });
  }
  // visible price window of the candles (same as the autoscaled right price scale incl. its margins)
  function priceWindow() {
    var bars = data ? data.bars : [], vr = chart.timeScale().getVisibleRange(), lo = Infinity, hi = -Infinity;
    if (vr) for (var i = bars.length - 1; i >= 0; i--) { var b = bars[i]; if (b[0] > vr.to) continue; if (b[0] < vr.from) break; if (b[3] < lo) lo = b[3]; if (b[2] > hi) hi = b[2]; }
    if (!isFinite(lo)) for (var k = Math.max(0, bars.length - 48); k < bars.length; k++) { lo = Math.min(lo, bars[k][3]); hi = Math.max(hi, bars[k][2]); }
    if (!isFinite(lo)) return null;
    var span = (hi - lo) || Math.abs(hi) * 0.001 || 1, full = span / (1 - 2 * MARGIN);
    return [lo - MARGIN * full, hi + MARGIN * full];
  }
  var lastWin = null;
  function remap(force) {
    if (!data || !data.package) return;
    var w = priceWindow(); if (!w) return;
    if (!force && lastWin && Math.abs(w[0] - lastWin[0]) < 1e-12 && Math.abs(w[1] - lastWin[1]) < 1e-12) return;
    lastWin = w;
    var ui = data.package.ui || {}, pt = ui.pad_top != null ? ui.pad_top : 0.12, pb = ui.pad_bot != null ? ui.pad_bot : 0.05;
    var S = w[1] - w[0], lo = w[0] + pb * S, hi = w[1] - pt * S; if (hi <= lo) { lo = w[0]; hi = w[1]; }
    layers.forEach(function (L) {
      var sp = L.vmax - L.vmin;
      var f = !L.screen ? function (v) { return v; } : sp > 0 ? function (v) { return lo + (v - L.vmin) / sp * (hi - lo); } : function () { return (lo + hi) / 2; };
      L.parts.forEach(function (q) { series[q.id].s.setData(q.pts.map(function (x) { return { time: x.time, value: f(x.v) }; })); });
    });
  }
  var remapTimer = null;
  chart.timeScale().subscribeVisibleTimeRangeChange(function () { clearTimeout(remapTimer); remapTimer = setTimeout(function () { remap(false); }, 60); });

  var bg = {
    cols: [], lastT: null, on: true, _req: null,
    attached: function (p) { this._req = p.requestUpdate; },
    detached: function () { this._req = null; },
    updateAllViews: function () {},
    update: function () { if (this._req) this._req(); },
    paneViews: function () {
      var self = this;
      return [{ zOrder: function () { return "bottom"; }, renderer: function () { return { draw: function (target) {
        var ts = chart.timeScale(), sp = ts.options().barSpacing;
        target.useBitmapCoordinateSpace(function (sc) {
          var g = sc.context, hr = sc.horizontalPixelRatio, Hh = sc.bitmapSize.height, Wd = sc.bitmapSize.width;
          if (self.on) for (var i = 0; i < self.cols.length; i++) {
            var x = ts.timeToCoordinate(self.cols[i][0]); if (x === null) continue;
            var x0 = Math.floor((x - sp / 2) * hr), x1 = Math.ceil((x + sp / 2) * hr);
            if (x1 < 0 || x0 > Wd) continue;
            g.fillStyle = self.cols[i][1]; g.fillRect(x0, 0, Math.max(1, x1 - x0), Hh);
          }
          if (self.lastT) {
            var xl = ts.timeToCoordinate(self.lastT);
            if (xl !== null) { g.fillStyle = "#9A9A9A"; var X = Math.round((xl + sp / 2) * hr); for (var y = 0; y < Hh; y += 6 * hr) g.fillRect(X, y, Math.max(1, Math.round(hr)), 3 * hr); }
          }
        });
      } }; } }];
    },
  };
  function draw(d, keepView) {
    var view = keepView ? chart.timeScale().getVisibleRange() : null;
    clearSeries(); lastWin = null;
    var ax = buildAxis(d), p = d.package, digits = d.digits;
    var cs = chart.addSeries(LWC.CandlestickSeries, {
      upColor: "#FFFFFF", downColor: "#6B6B6B", borderUpColor: "#6B6B6B", borderDownColor: "#6B6B6B", wickUpColor: "#6B6B6B", wickDownColor: "#6B6B6B",
      priceFormat: { type: "price", precision: digits, minMove: Math.pow(10, -digits) }, priceLineColor: "#888888",
    });
    series.candles = { s: cs };
    cs.setData(d.bars.map(function (b) { return { time: b[0], open: b[1], high: b[2], low: b[3], close: b[4] }; })
      .concat(ax.fut.map(function (x) { return { time: x }; })));
    // background phase (payload heat colours) + "last bar" marker, drawn under the candles by a series primitive
    bg.cols = [];
    if (p && p.heat && p.heat.length) {
      var H = p.heat.slice().sort(function (a, b) { return a[0] - b[0]; }), k = 0, cur = null, hEnd = H[H.length - 1][0] + 6 * 3600;
      ax.all.forEach(function (x) { while (k < H.length && H[k][0] <= x) cur = H[k++][1]; if (cur && x >= H[0][0] && x <= hEnd) bg.cols.push([x, cur]); });
    }
    bg.lastT = ax.lastT || null;
    cs.attachPrimitive(bg);
    buildLayers(d, ax.all);
    applyVisibility();
    var ts = chart.timeScale();
    if (view) ts.setVisibleRange(view);
    else if (ax.lastT) {
      // like the MT4 chart: current week from Monday (at least ~2 days of history) to the end of the Week projection
      var lb = new Date(ax.lastT * 1000), dow = (lb.getUTCDay() + 6) % 7;
      var mon = Date.UTC(lb.getUTCFullYear(), lb.getUTCMonth(), lb.getUTCDate() - dow) / 1000;
      var narrow = box.clientWidth < 640;
      var from = narrow ? ax.lastT - 48 * 3600 : Math.min(mon, ax.lastT - 2 * 86400);
      var wk = p && p.lines.filter(function (l) { return l.name === "Week"; })[0];
      var to = wk && wk.points.length ? wk.points[wk.points.length - 1][0] : ax.lastT + 86400;
      if (narrow) to = Math.min(to, ax.lastT + 36 * 3600);
      to = Math.min(to, ax.all[ax.all.length - 1]);
      try { ts.setVisibleRange({ from: from, to: to }); } catch (e) { ts.fitContent(); }
    }
    remap(true);
    renderLegend();
    renderMeta();
  }

  // ---------------- legend (one row, MT4 legend spec: swatch in the real colour/width/style + name) ----------------
  var LG_ORDER = ["Week", "Intraday", "Envelope", "Stable", "Comp", "Middle", "Seasonal", "Background"];
  function defaultOn(name) {
    var ui = (data && data.package && data.package.ui) || {};
    if (name === "Background") return true;
    if (name === "Envelope") return !!ui.env;
    return (ui.visible || ["Week", "Comp"]).indexOf(name) >= 0;
  }
  function isOn(name) { var v = vis[sym + ":" + name]; return v == null ? defaultOn(name) : !!v; }
  function idsFor(name) {
    if (name === "Background") return bg.cols.length ? ["bg"] : [];
    var ids = [];
    layers.forEach(function (L) { L.parts.forEach(function (q) { if (q.item === name) ids.push(q.id); }); });
    return ids;
  }
  function applyVisibility() {
    LG_ORDER.forEach(function (n) { var on = isOn(n); idsFor(n).forEach(function (id) { if (series[id]) series[id].s.applyOptions({ visible: on }); }); });
    bg.on = isOn("Background"); bg.update();
  }
  function swatch(cv, color, width, mtStyle, heat) {
    var dpr = window.devicePixelRatio || 1, W = 18, Hh = 8; cv.width = W * dpr; cv.height = Hh * dpr;
    var g = cv.getContext("2d"); g.scale(dpr, dpr);
    if (heat) { g.fillStyle = "#E3F2E6"; g.fillRect(0, 0, 9, Hh); g.fillStyle = "#F6E1E1"; g.fillRect(9, 0, 9, Hh); g.strokeStyle = "#C8C8C8"; g.strokeRect(0.5, 0.5, W - 1, Hh - 1); return; }
    var w = mtStyle ? 1 : Math.max(1, Math.min(6, width)), y = Hh / 2;
    g.fillStyle = color;
    if (!mtStyle) { g.fillRect(0, y - w / 2, W, w); return; }
    var pat = { 1: [6, 3], 2: [2, 2], 3: [6, 2, 2, 2], 4: [6, 2, 2, 2, 2, 2] }[mtStyle] || [6, 3];
    for (var x = 0, i = 0; x < W; i++) { var seg = pat[i % pat.length]; if (i % 2 === 0) g.fillRect(x, Math.round(y - 0.5), Math.min(seg, W - x), 1); x += seg; }
  }
  function renderLegend() {
    var lg = $("#legend"); lg.textContent = "";
    if (!data || !data.package) { lg.hidden = true; return; }
    lg.hidden = false;
    LG_ORDER.forEach(function (n) {
      if (!idsFor(n).length) return;
      var L = layers.filter(function (x) { return x.name === n; })[0];
      var b = el("button", "lg" + (isOn(n) ? "" : " off")); b.type = "button"; b.title = t("tip", { n: t(n) });
      b.setAttribute("aria-pressed", isOn(n) ? "true" : "false");
      var cv = document.createElement("canvas");
      if (n === "Background") swatch(cv, null, 0, 0, true);
      else if (n === "Envelope") swatch(cv, "#A06E46", 1, 0);
      else swatch(cv, L.color, L.width, L.style);
      b.appendChild(cv); b.appendChild(el("span", null, t(n)));
      b.addEventListener("click", function () { vis[sym + ":" + n] = !isOn(n); localStorage.setItem("isp_chart_vis", JSON.stringify(vis)); applyVisibility(); renderLegend(); });
      lg.appendChild(b);
    });
  }
  function renderMeta() {
    var m = $("#meta");
    if (!data) { m.textContent = ""; return; }
    var p = data.package;
    if (!p) { m.textContent = t("nopkg"); return; }
    var tz = lang === "ru" ? " МСК" : " MSK";
    m.textContent = t("meta", { v: String(p.version), u: fmtReal(p.updated) + tz, b: data.last_bar_t ? fmtSrv(data.last_bar_t) + tz : "—" });
  }

  // ---------------- symbols / overlay / key ----------------
  function renderSyms() {
    var w = $("#syms"); w.textContent = "";
    SYMS.forEach(function (s) {
      var isFree = free.indexOf(s) >= 0, b = el("button", "sym" + (s === sym ? " on" : "") + (!isFree && !keyOk ? " lock" : ""), s);
      b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-selected", s === sym ? "true" : "false");
      if (isFree) b.appendChild(el("small", null, t("free"))); else if (!keyOk) b.appendChild(el("small", null, "🔒"));
      b.addEventListener("click", function () { if (s === sym) return; sym = s; localStorage.setItem("isp_chart_sym", s); renderSyms(); load(false); });
      w.appendChild(b);
    });
  }
  function overlay(kind, extra) {
    var o = $("#overlay");
    if (!kind) { o.hidden = true; return; }
    var title = $("#ov_title"), text = $("#ov_text"), btns = $("#ov_btns"); btns.textContent = "";
    var fl = free.join(lang === "ru" ? " и " : " and ");
    function btn(label, cls, fn, href) { var b = el(href ? "a" : "button", "btn" + (cls ? " " + cls : ""), label); if (href) b.href = href; else { b.type = "button"; b.addEventListener("click", fn); } btns.appendChild(b); }
    if (kind === "lock" || kind === "bad") {
      title.textContent = t(kind === "lock" ? "lock_t" : "bad_t", { s: sym }); text.textContent = kind === "lock" ? t("lock_x", { f: fl }) : t("bad_x");
      btn(t("get"), "", null, "./" + (lang === "ru" ? "?lang=ru" : ""));
      btn(t("enter"), "alt", function () { $("#keyin").focus(); $("#keyin").scrollIntoView({ block: "center", behavior: "smooth" }); });
      if (free.length) btn(t("open_free", { s: free[0] }), "alt", function () { sym = free[0]; renderSyms(); load(false); });
    } else if (kind === "busy") { title.textContent = t("busy_t"); text.textContent = t("busy_x", { n: extra || 60 }); btn(t("retry"), "", function () { load(false); }); }
    else if (kind === "loading") { title.textContent = t("loading"); text.textContent = ""; }
    else if (kind === "off") { title.textContent = t("off_t"); text.textContent = ""; }
    else { title.textContent = t("err_t"); text.textContent = t("err_x"); btn(t("retry"), "", function () { load(false); }); }
    o.hidden = false;
  }
  function keyMsg() {
    var m = $("#keymsg");
    if (!key) { m.textContent = t("key_fmt") + " " + t("key_saved_note"); m.className = "note"; return; }
    if (keyOk) { m.textContent = keyUntil ? t("key_ok", { d: fmtDay(keyUntil) }) : t("key_ok_open"); m.className = "note ok"; }
    else if (last && last.key === "invalid") { m.textContent = t("key_bad"); m.className = "note err"; }
    else { m.textContent = t("key_saved_note"); m.className = "note"; }
  }
  function load(keepView) {
    var my = ++loadSeq;
    if (!keepView) overlay("loading");
    var h = {}; if (key) h["X-ISP-Key"] = key;
    fetch(API + "/data?symbol=" + encodeURIComponent(sym), { headers: h, cache: "no-store" })
      .then(function (r) { return r.json().then(function (j) { return { code: r.status, j: j }; }, function () { return { code: r.status, j: {} }; }); })
      .then(function (x) {
        if (my !== loadSeq) return;
        var j = x.j || {}; last = j;
        if (j.free) free = j.free;
        if (key && j.key) { keyOk = j.key === "ok"; keyUntil = j.key_until || null; }
        if (x.code === 200 && j.status === "ok") { data = j; overlay(null); draw(j, keepView); }
        else {
          if (!keepView) { data = null; clearSeries(); renderLegend(); renderMeta(); }
          if (x.code === 401) overlay("lock");
          else if (x.code === 403) { if (key) keyOk = false; overlay("bad"); }
          else if (x.code === 429) overlay("busy", j.retry_after);
          else if (x.code === 503) overlay("off");
          else overlay("err");
        }
        renderSyms(); keyMsg();
      })
      .catch(function () { if (my !== loadSeq) return; if (!keepView) overlay("err"); });
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function tick() { if (document.hidden) { refreshTimer = setTimeout(tick, 60000); return; } load(true); }, 5 * 60000);
  }
  $("#keyform").addEventListener("submit", function (e) {
    e.preventDefault();
    var raw = $("#keyin").value.toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/^ISP/, "");
    if (raw.length !== 12) { var m = $("#keymsg"); m.textContent = t("key_fmt"); m.className = "note err"; return; }
    key = "ISP-" + raw.slice(0, 4) + "-" + raw.slice(4, 8) + "-" + raw.slice(8, 12);
    $("#keyin").value = key; localStorage.setItem("isp_chart_key", key); keyOk = false; keyUntil = null; load(false);
  });
  $("#keyforget").addEventListener("click", function () {
    key = ""; keyOk = false; keyUntil = null; localStorage.removeItem("isp_chart_key"); $("#keyin").value = "";
    $("#keymsg").textContent = t("key_gone"); $("#keymsg").className = "note"; renderSyms(); load(false);
  });

  // ---------------- language ----------------
  function render() {
    document.documentElement.lang = lang;
    $$("[data-t]").forEach(function (e) { e.textContent = t(e.getAttribute("data-t")); });
    $$(".lang button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-lang") === lang); });
    chart.applyOptions({ localization: { locale: lang === "ru" ? "ru-RU" : "en-GB" } });
    renderSyms(); renderLegend(); renderMeta(); keyMsg();
    if (!$("#overlay").hidden && last) { if (last.status === "key required") overlay("lock"); else if (last.status === "key invalid") overlay("bad"); }
  }
  $$(".lang button").forEach(function (b) { b.addEventListener("click", function () { lang = b.getAttribute("data-lang"); localStorage.setItem("isp_lang", lang); render(); }); });

  $("#keyin").value = key;
  render();
  fetch(API + "/config", { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (c) {
    if (c && c.free) { free = c.free; renderSyms(); }
    if (c && c.enabled === false) { overlay("off"); return; }
    load(false);
  }).catch(function () { load(false); });
})();
