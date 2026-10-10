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
      tab_bg: "Background from {n}", tab_nobg: "No background on this tab", collapse: "Hide / show the panel",
      line: "Line", line_tip: "Show / hide the {n} line", env_tip: "Envelope around the Intraday line",
      wk_sync: "Week synced with the administrator", wk_own: "Week: your choice (Admin = sync)",
      prev: "Previous Week candidate in the ranking", next: "Next Week candidate in the ranking",
      auto_tip: "Auto: best score, chosen by the administrator at Monday 00:00 (now {c})",
      top_tip: "Top N: composite of the N best candidates (one per line, rank weights N..1)", nm_tip: "Top N − 1 (min 2)", np_tip: "Top N + 1 (max {n})",
      adm_tip: "Sync: show and follow the administrator's Week selection",
      plate_tip: "Week candidates (main + alternatives, each also inverted), ranked by score; IS = weeks recomputed in-sample.",
      in_bg: "part of the background", not_bg: "not part of the background",
      gauge_tip: "iSpectrum bull/bear gauge (Intraday and Week as the administrator, Middle / Seasonal as your background boxes)",
      status: "iSpectrum | {s} v{v} | updated {u}",
      trim_note: "Free view: Intraday, Middle, Seasonal and the background end with the current week ({d}). The full horizon opens with an access key.",
      candles: "Candles", bars: "Bars", ctype_tip: "Price display: candles or OHLC bars",
      shot_tip: "Save a PNG of the current chart view", fs_tip: "Full screen (Esc to exit)", fs_exit: "Exit full screen (Esc)",
      shot_title: "{s} · M30 · iSpectrum projection", shot_meta: "Saved {n} MSK · last M30 bar {b} MSK (MT4 prices) · package {v}",
      shot_sig: "Not a trading signal.", shot_disc: "Model-based projection for information only; not investment advice. Times in MSK (broker server time).",
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
      tab_bg: "Фон от {n}", tab_nobg: "На этой вкладке фона нет", collapse: "Скрыть / показать панель",
      line: "Линия", line_tip: "Показать / скрыть линию {n}", env_tip: "Конверт вокруг линии Intraday",
      wk_sync: "Week синхронизирован с администратором", wk_own: "Week: ваш выбор (Admin = синхронизация)",
      prev: "Предыдущий кандидат Week в рейтинге", next: "Следующий кандидат Week в рейтинге",
      auto_tip: "Auto: лучший балл, выбор администратора в понедельник 00:00 (сейчас {c})",
      top_tip: "Top N: композит N лучших кандидатов (по одному на линию, веса N..1)", nm_tip: "Top N − 1 (мин. 2)", np_tip: "Top N + 1 (макс. {n})",
      adm_tip: "Синхронизация: показывать выбор Week администратора",
      plate_tip: "Кандидаты Week (основная линия и альтернативы, каждая также инвертированная) по баллу; IS = недели, пересчитанные in-sample.",
      in_bg: "входит в фон", not_bg: "не входит в фон",
      gauge_tip: "Индикатор бык/медведь iSpectrum (Intraday и Week — как у администратора, Middle / Seasonal — по вашим галочкам фона)",
      status: "iSpectrum | {s} v{v} | обновлён {u}",
      trim_note: "Бесплатный просмотр: Intraday, Middle, Seasonal и фон показаны до конца текущей недели ({d}). Полный горизонт открывается ключом доступа.",
      candles: "Свечи", bars: "Бары", ctype_tip: "Вид цены: свечи или бары OHLC",
      shot_tip: "Сохранить PNG текущего вида графика", fs_tip: "Во весь экран (Esc — выход)", fs_exit: "Выйти из полноэкранного режима (Esc)",
      shot_title: "{s} · M30 · проекция iSpectrum", shot_meta: "Сохранено {n} МСК · последний бар M30 {b} МСК (цены MT4) · пакет {v}",
      shot_sig: "Не торговый сигнал.", shot_disc: "Модельная проекция только для информации; не инвестиционная рекомендация. Время МСК (время сервера брокера).",
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
  var dash = {}; try { dash = JSON.parse(localStorage.getItem("isp_chart_dash") || "{}"); } catch (e) { dash = {}; }
  var ctype = localStorage.getItem("isp_chart_ctype") === "bars" ? "bars" : "candles";   // Candles / Bars toggle
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
  // v4: projection lines one step thinner than the package width (3->2, 2->1, 1 stays 1), as the MT4 / screens renderers
  function thin(w) { return Math.max(1, Math.min(6, w | 0 || 1) - 1); }
  function addLine(id, color, width, mtStyle, z) {
    var s = chart.addSeries(LWC.LineSeries, {
      color: color, lineWidth: mtStyle ? 1 : Math.max(1, Math.min(4, width)), lineStyle: lwStyle(mtStyle), lineType: 0,
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
  function range(arrs) { var lo = Infinity, hi = -Infinity; arrs.forEach(function (a) { a.forEach(function (q) { if (q.v == null) return; if (q.v < lo) lo = q.v; if (q.v > hi) hi = q.v; }); }); return [lo, hi]; }
  // Week as MT4 (IspWeekBarPoly): every week is its own piece, Monday starts unjoined (price gap). 5-day symbols: no weekend
  // knots, a new piece at every week change or gap > 6 h; BTC (7 days): Sun->Mon stays joined unless the jump is > 3x the
  // neighbouring 30-min moves (IspJoinBreak). A piece with one knot (e.g. next Monday 00:00 alone) is not drawn.
  var JOIN_GAP = 21600, JOIN_K = 3;
  function weekIdx(t) { return Math.floor((t - 4 * 86400) / (7 * 86400)); }
  function joinCand(a, b) { return b > a && (b - a > JOIN_GAP || weekIdx(a) !== weekIdx(b)); }
  function weekPieces(pts, w7) {
    var k = pts.filter(function (q) { return w7 || !isWeekend(q[0]); }), n = k.length, out = [], a = 0;
    function brk(i) {
      var jump = Math.abs(k[i][1] - k[i - 1][1]); if (!(jump > 0)) return false;
      var sc = 0;
      for (var j = i - 4; j <= i + 4; j++) { if (j === i || j < 1 || j >= n || joinCand(k[j - 1][0], k[j][0])) continue; sc = Math.max(sc, Math.abs(k[j][1] - k[j - 1][1])); }
      return jump > JOIN_K * sc;
    }
    while (a < n) {
      var b = a;
      while (b + 1 < n) { if (joinCand(k[b][0], k[b + 1][0]) && (!w7 || k[b + 1][0] - k[b][0] > JOIN_GAP || brk(b + 1))) break; b++; }
      if (b > a) out.push(k.slice(a, b + 1));
      a = b + 1;
    }
    return out;
  }

  // layers: each one has its own [vmin..vmax] (MT4 IspLayerMap) mapped into the visible window minus the pads
  var layers = [];   // {ids:[...], parts:[{id, pts}], vmin, vmax, screen}
  function buildLayers(d, axis) {
    layers = [];
    var p = d.package; if (!p) return;
    var ui = p.ui || {}, wl = ui.wlbc, dash = ui.insample_dash || [];
    var order = ["Week", "Intraday", "Stable", "Comp", "Middle", "Seasonal"];
    var byName = {}; p.lines.forEach(function (l) { byName[l.name] = l; });
    var wv = weekValues();
    if (wv && byName.Week) byName.Week = Object.assign({}, byName.Week, { points: wv });
    // envelope (Intraday band): drawn under the lines, scaled together with the Intraday layer so the band wraps the line
    var il = byName.Intraday, envParts = [];
    if (il && il.env && il.env.length > 1) {
      var col = "#A06E46";   // MT4 envelope colour 160,110,70, width 1, solid
      addLine("env_hi", col, 1, 0); addLine("env_lo", col, 1, 0);
      envParts = [{ id: "env_hi", item: "Envelope", pts: resample(il.env.map(function (q) { return [q[0], q[1]]; }), axis) },
                  { id: "env_lo", item: "Envelope", pts: resample(il.env.map(function (q) { return [q[0], q[2]]; }), axis) }];
    }
    // 5-day symbols: an isolated end point after the weekend gap (Monday 00:00) would draw a vertical jump
    var w5 = p.week_days !== 7;
    var tidy = function (pts) { var n = pts.length; return w5 && n > 2 && pts[n - 1][0] - pts[n - 2][0] > 86400 ? pts.slice(0, n - 1) : pts; };
    var axIdx = {}; axis.forEach(function (x, i) { axIdx[x] = i; });
    order.forEach(function (nm) {
      var l = byName[nm]; if (!l) return;
      var parts = [], width = l.width;
      // v5: Intraday is exempt from the thinning (drawn 2..5 = package width, today 2 px like Stable / Week / Comp after thinning)
      width = nm === "Intraday" ? Math.max(2, Math.min(5, width | 0 || 2)) : thin(width);
      if (nm === "Intraday" && l.fit && l.fit.length > 1) {
        var lbc = l.lbc || (l.points.length ? l.points[0][0] : Infinity);
        var fit = resample(l.fit.filter(function (q) { return q[0] <= lbc; }), axis);
        if (fit.length > 1) { addLine(nm + "_fit", l.color, l.fit_width || 1, l.fit_style || 2); parts.push({ id: nm + "_fit", item: nm, pts: fit }); }
      }
      // pieces (Week: one per week, each in its OWN series - Lightweight Charts joins a line across whitespace, so two
      // alternating series joined week 1 to week 3 straight through week 2 once the package held 3+ weeks); in-sample part dashed
      var pieces = nm === "Week" ? weekPieces(l.points, !w5) : [tidy(l.points)], acc = {}, ord = [];
      var put = function (id, pts) {
        if (pts.length < 2) return;
        var a = acc[id]; if (!a) { a = acc[id] = []; ord.push(id); }
        if (a.length) { var nx = axis[(axIdx[a[a.length - 1].time] | 0) + 1]; if (nx != null && nx < pts[0].time) a.push({ time: nx, v: null }); }   // gap
        Array.prototype.push.apply(a, pts);
      };
      pieces.forEach(function (pc, j) {
        var main = resample(pc, axis), sfx = j ? "_" + j : "";
        if (dash.indexOf(nm) >= 0 && wl) {
          var pre = main.filter(function (q) { return q.time <= wl; }), post = main.filter(function (q) { return q.time >= wl; });
          if (pre.length > 1) { put(nm + "_pre" + sfx, pre); main = post; }
        }
        put(nm + sfx, main);
      });
      ord.sort(function (x, y) { return (x.indexOf("_pre") < 0) - (y.indexOf("_pre") < 0); });   // dashed under solid
      ord.forEach(function (id) {
        var pre = id.indexOf("_pre") >= 0;
        addLine(id, l.color, pre ? 1 : width, pre ? 1 : l.style); parts.push({ id: id, item: nm, pts: acc[id] });
      });
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
      L.parts.forEach(function (q) { series[q.id].s.setData(q.pts.map(function (x) { return x.v == null ? { time: x.time } : { time: x.time, value: f(x.v) }; })); });
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
    var pf = { type: "price", precision: digits, minMove: Math.pow(10, -digits) };
    var cs = ctype === "bars"
      ? chart.addSeries(LWC.BarSeries, { upColor: "#3C3C3C", downColor: "#3C3C3C", openVisible: true, thinBars: true, priceFormat: pf, priceLineColor: "#888888" })
      : chart.addSeries(LWC.CandlestickSeries, {
        upColor: "#FFFFFF", downColor: "#6B6B6B", borderUpColor: "#6B6B6B", borderDownColor: "#6B6B6B", wickUpColor: "#6B6B6B", wickDownColor: "#6B6B6B",
        priceFormat: pf, priceLineColor: "#888888",
      });
    series.candles = { s: cs };
    cs.setData(d.bars.map(function (b) { return { time: b[0], open: b[1], high: b[2], low: b[3], close: b[4] }; })
      .concat(ax.fut.map(function (x) { return { time: x }; })));
    // background phase (payload heat colours) + "last bar" marker, drawn under the candles by a series primitive
    bg.cols = [];
    var hv = heatVariant();
    if (hv) {
      var k2 = 0, c2 = "";
      ax.all.forEach(function (x) { while (k2 < hv.length && hv[k2][0] <= x) c2 = hv[k2++][1]; if (c2 && x >= hv[0][0]) bg.cols.push([x, c2]); });
    } else if (p && !p.bg && p.heat && p.heat.length) {
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
    renderDash();
  }

  // ---------------- dashboard (MT4 buyer panel: tabs, per-tab controls, gauge, status line) ----------------
  // Everything is precomputed by the server; the page only picks a variant. Choices persist per instrument.
  var TABS = ["Intraday", "Week", "Middle", "Seasonal"];
  function ds() {
    var p = data && data.package, ui = (p && p.ui) || {}, d = dash[sym] || {};
    return {
      tab: TABS.indexOf(d.tab) >= 0 ? d.tab : "Week", open: d.open !== false,
      hm: d.hm == null ? !!ui.heat_m : !!d.hm, hs: d.hs == null ? !!ui.heat_s : !!d.hs,
      mode: d.mode == null ? 3 : d.mode, man: d.man || null, topn: d.topn || 0,
    };
  }
  function dsSet(k, v) { var d = dash[sym] || (dash[sym] = {}); d[k] = v; try { localStorage.setItem("isp_chart_dash", JSON.stringify(dash)); } catch (e) {} }
  function wk() { return data && data.package && data.package.week; }
  function wTopN() { var w = wk(), st = ds(); if (!w) return 3; var n = st.topn >= 2 ? st.topn : w.admin.topn; return Math.max(2, Math.min(w.nmax, n)); }
  function wManIdx() { var w = wk(), st = ds(); if (!w) return 0; for (var i = 0; i < w.c.length; i++) if (w.c[i].id === st.man) return i; return w.admin.shown; }
  function wShown(mode) {
    var w = wk(); if (!w) return 0;
    if (mode === 3) return w.admin.shown;
    if (mode === 1) return w.auto;
    if (mode === 2) return w.top[wTopN()] ? w.top[wTopN()].m[0] : 0;
    return wManIdx();
  }
  function weekValues() {
    var w = wk(); if (!w) return null;
    var st = ds(), v = st.mode === 3 ? w.admin.v : st.mode === 1 ? w.c[w.auto].v : st.mode === 2 ? (w.top[wTopN()] || {}).v : w.c[wManIdx()].v;
    if (!v) return null;
    var out = []; for (var i = 0; i < w.t.length; i++) if (v[i] != null) out.push([w.t[i], v[i]]);
    return out.length > 1 ? out : null;
  }
  function heatVariant() {
    var p = data && data.package; if (!p || !p.bg) return null;
    var st = ds();
    if (p.bg.adm) return st.hm || st.hs ? p.bg.adm : null;
    return st.hm && st.hs ? (p.bg.ms || p.bg.m || p.bg.s) : st.hm ? p.bg.m : st.hs ? p.bg.s : null;
  }
  function candTxt(q) { var c = wk().c[q]; return c ? c.lbl + "  " + c.sc + " " + c.wk + "w" + (c.is ? " IS" : "") : "-"; }
  function memTxt(m) { var w = wk(); return m.map(function (i) { return (w.c[i] ? w.c[i].id : "?").slice(0, 6); }).join(","); }
  function plateTxt() {
    var w = wk(), st = ds(), c = wShown(st.mode);
    if (st.mode === 3) return w.admin.mode === 2 ? "Adm Top" + w.admin.topn + ": " + memTxt(w.admin.mem) : "Adm " + (w.admin.mode === 1 ? "A " : "") + candTxt(c);
    if (st.mode === 2) { var n = wTopN(); return "Top" + n + ": " + memTxt((w.top[n] || { m: [] }).m); }
    if (st.mode === 1) return "A " + candTxt(c);
    return "#" + (c + 1) + " " + candTxt(c);
  }
  function weekClick(b) {
    var w = wk(); if (!w) return;
    var st = ds(), cur = wShown(st.mode), tn = wTopN();
    if (b === "prev" || b === "next") { var pos = (cur + (b === "prev" ? -1 : 1) + w.c.length) % w.c.length; dsSet("man", w.c[pos].id); dsSet("mode", 0); }
    else if (b === "auto") { if (st.mode === 1) { dsSet("mode", 0); dsSet("man", w.c[cur].id); } else dsSet("mode", 1); }
    else if (b === "top") { if (st.mode === 2) dsSet("mode", 0); else { if (st.mode !== 0) dsSet("man", w.c[cur].id); dsSet("mode", 2); dsSet("topn", tn); } }
    else if (b === "nm") { dsSet("topn", Math.max(2, tn - 1)); dsSet("mode", 2); }
    else if (b === "np") { dsSet("topn", Math.min(w.nmax, tn + 1)); dsSet("mode", 2); }
    else if (b === "adm") dsSet("mode", 3);
    draw(data, true);
  }
  function gaugeColor(u) {
    var a = 0.28, x = Math.max(0, Math.min(1, (u + 1) / 2));
    var tr = Math.round(200 * (1 - x) + 34 * x), tg = Math.round(45 * (1 - x) + 160 * x), tb = Math.round(45 * (1 - x) + 60 * x);
    return "rgb(" + Math.round(255 * (1 - a) + tr * a) + "," + Math.round(255 * (1 - a) + tg * a) + "," + Math.round(255 * (1 - a) + tb * a) + ")";
  }
  function dbtn(label, on, tip, fn, cls) {
    var b = el("button", "db" + (on ? " on" : "") + (cls ? " " + cls : ""), label); b.type = "button"; if (tip) b.title = tip;
    if (on != null) b.setAttribute("aria-pressed", on ? "true" : "false");
    if (fn) b.addEventListener("click", fn); else b.disabled = true;
    return b;
  }
  function toggleLine(n) { vis[sym + ":" + n] = !isOn(n); localStorage.setItem("isp_chart_vis", JSON.stringify(vis)); applyVisibility(); renderLegend(); renderDash(); }
  function hasLine(n) { return layers.some(function (L) { return L.name === n; }); }
  function renderDash() {
    var root = $("#dash"); if (!root) return;
    root.textContent = "";
    var p = data && data.package;
    if (!p) { root.hidden = true; return; }
    root.hidden = false;
    var st = ds();
    // row 1: tabs (checkbox = background, Middle / Seasonal only; v5: none on Intraday / Week) + collapse arrow
    var tabs = el("div", "dtabs");
    TABS.forEach(function (n) {
      var tb = el("div", "dtab" + (st.tab === n && st.open ? " on" : ""));
      var bgTab = n === "Middle" || n === "Seasonal";
      if (bgTab) {
        var cb = document.createElement("input");
        cb.type = "checkbox"; cb.checked = n === "Middle" ? st.hm : st.hs;
        cb.title = t("tab_bg", { n: n }); cb.setAttribute("aria-label", cb.title);
        cb.addEventListener("change", function () { dsSet(n === "Middle" ? "hm" : "hs", cb.checked); draw(data, true); });
        tb.appendChild(cb);
      } else tb.classList.add("nocb");
      var lb = el("button", "dtabl", n); lb.type = "button";
      lb.addEventListener("click", function () { dsSet("tab", n); dsSet("open", true); renderDash(); });
      tb.appendChild(lb); tabs.appendChild(tb);
    });
    var col = el("button", "dcol", st.open ? "▴" : "▾"); col.type = "button"; col.title = t("collapse");
    col.addEventListener("click", function () { dsSet("open", !st.open); renderDash(); });
    tabs.appendChild(col);
    var top = el("div", "dtop"), left = el("div", "dleft");
    left.appendChild(tabs);
    // row 2/3: controls of the open tab
    if (st.open) {
      var r = el("div", "drow"), n = st.tab;
      if (hasLine(n)) r.appendChild(dbtn(t("line"), isOn(n), t("line_tip", { n: n }), function () { toggleLine(n); }));
      if (n === "Intraday") {
        if (idsFor("Envelope").length) r.appendChild(dbtn("E", isOn("Envelope"), t("env_tip"), function () { toggleLine("Envelope"); }));
        if (p.intraday_weeks) { var iw = el("span", "dtxt b", p.intraday_weeks), il = layers.filter(function (L) { return L.name === "Intraday"; })[0]; if (il) iw.style.color = il.color; r.appendChild(iw); }
      } else if (n === "Week") {
        ["Stable", "Comp"].forEach(function (m) { if (hasLine(m)) r.appendChild(dbtn(m, isOn(m), t("line_tip", { n: m }), function () { toggleLine(m); })); });
        if (wk()) r.appendChild(el("span", "dtxt", st.mode === 3 ? t("wk_sync") : t("wk_own")));
      } else {
        var ph = p.phase && p.phase[n === "Middle" ? "middle" : "seasonal"];
        if (ph) { var a = el("span", "dtxt b", ph.l1); a.style.color = ph.color; r.appendChild(a); if (ph.l2) r.appendChild(el("span", "dtxt mute", ph.l2)); }
        else r.appendChild(el("span", "dtxt mute", (n === "Middle" ? st.hm : st.hs) ? t("in_bg") : t("not_bg")));
      }
      left.appendChild(r);
      if (n === "Week" && wk()) {
        var w = wk(), r2 = el("div", "drow"), tn = wTopN(), wl = layers.filter(function (L) { return L.name === "Week"; })[0];
        r2.appendChild(dbtn("<", null, t("prev"), function () { weekClick("prev"); }, "sq"));
        var tip = t("plate_tip"); for (var q = 0; q < w.c.length && q < 6; q++) tip += "\n" + (q + 1) + " " + candTxt(q);
        var pl = el("span", "dplate" + (st.mode === 3 ? " on" : ""), plateTxt()); pl.title = tip; if (wl) pl.style.color = wl.color;
        r2.appendChild(pl);
        r2.appendChild(dbtn(">", null, t("next"), function () { weekClick("next"); }, "sq"));
        r2.appendChild(dbtn("Auto", st.mode === 1, t("auto_tip", { c: w.c[w.auto] ? w.c[w.auto].id : "-" }), function () { weekClick("auto"); }));
        r2.appendChild(dbtn("Top" + tn, st.mode === 2, t("top_tip"), function () { weekClick("top"); }));
        r2.appendChild(dbtn("−", null, t("nm_tip"), function () { weekClick("nm"); }, "sq"));
        r2.appendChild(dbtn("+", null, t("np_tip", { n: w.nmax }), function () { weekClick("np"); }, "sq"));
        r2.appendChild(dbtn("Admin", st.mode === 3, t("adm_tip"), function () { weekClick("adm"); }));
        left.appendChild(r2);
      }
    }
    top.appendChild(left);
    // gauge: 21 segments bear..bull, marker and value (n/a when nothing is selected)
    if (p.gauge) {
      var g = el("div", "gauge"); g.title = t("gauge_tip");
      var pct = p.gauge[(st.hm ? "1" : "0") + (st.hs ? "1" : "0")], na = pct == null;
      g.appendChild(el("span", "gbear", "bear"));
      var bar = el("span", "gbar");
      var mk = na ? -1 : Math.max(0, Math.min(20, Math.round((pct / 100 + 1) * 0.5 * 20)));
      for (var i = 0; i < 21; i++) { var sg = el("i", i === mk ? "mk" : null); sg.style.background = gaugeColor(i / 20 * 2 - 1); bar.appendChild(sg); }
      g.appendChild(bar);
      g.appendChild(el("span", "gbull", "bull"));
      g.appendChild(el("span", "gval", na ? "n/a" : (pct > 0 ? "+" : "") + pct + "%"));
      top.appendChild(g);
    }
    root.appendChild(top);
    var tz = lang === "ru" ? " МСК" : " MSK";
    root.appendChild(el("div", "dstatus", t("status", { s: sym, v: String(p.version), u: fmtReal(p.updated) + tz })));
    if (p.trim && p.trim.until) root.appendChild(el("div", "dtrim", t("trim_note", { d: fmtSrv(p.trim.until - (p.week_days === 7 ? 60 : 2 * 86400 + 60)) + tz })));
  }

  // ---------------- legend (one row, MT4 legend spec: swatch in the real colour/width/style + name) ----------------
  var LG_ORDER = ["Week", "Intraday", "Envelope", "Stable", "Comp", "Middle", "Seasonal", "Background"];
  function defaultOn(name) {
    var ui = (data && data.package && data.package.ui) || {};
    if (name === "Background") return true;   // master switch; colours follow the Middle / Seasonal boxes
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
      b.addEventListener("click", function () { toggleLine(n); });
      lg.appendChild(b);
    });
    // Candles / Bars (remembered in this browser)
    var ct = el("div", "ctype"); ct.title = t("ctype_tip"); ct.setAttribute("role", "group");
    ["candles", "bars"].forEach(function (k) {
      var b = el("button", "ct" + (ctype === k ? " on" : "")); b.type = "button"; b.setAttribute("aria-pressed", ctype === k ? "true" : "false");
      var ic = el("span", "cti " + k); b.appendChild(ic); b.appendChild(el("span", null, t(k)));
      b.addEventListener("click", function () { if (ctype === k) return; ctype = k; try { localStorage.setItem("isp_chart_ctype", k); } catch (e) {} if (data) draw(data, true); else renderLegend(); });
      ct.appendChild(b);
    });
    lg.appendChild(ct);
  }
  function renderMeta() {
    var m = $("#meta"), sb = $("#shotbtn"); if (sb) sb.disabled = !(data && data.package);
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
    var on = w.querySelector(".sym.on");   // v5: keep the selected instrument visible in the scrolling row (mobile / fullscreen)
    if (on) { var wr = w.getBoundingClientRect(), br = on.getBoundingClientRect(); if (br.left < wr.left || br.right > wr.right) w.scrollLeft += br.left - wr.left - (wr.width - br.width) / 2; }
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
      btn(t("enter"), "alt", function () { if (fsOn()) fsExit(); $("#keyin").focus(); $("#keyin").scrollIntoView({ block: "center", behavior: "smooth" }); });
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
          if (!keepView) { data = null; clearSeries(); renderLegend(); renderMeta(); renderDash(); }
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

  // ---------------- v5: screenshot (PNG of the current view, sold-screenshot layout) ----------------
  var logoImg = new Image(); logoImg.src = "logo_t.png";   // same origin: the canvas stays exportable
  function siteLink() {
    var h = location.host;
    if (!h || /^(localhost|127\.|\[::1\])/.test(h)) return "tsforecasts-maker.github.io/Spectroom-pay";
    return (h + location.pathname.replace(/[^\/]*$/, "")).replace(/\/$/, "");
  }
  function shotLegend() {
    var out = [];
    LG_ORDER.forEach(function (n) {
      if (n === "Background" || !idsFor(n).length || !isOn(n)) return;
      var L = layers.filter(function (x) { return x.name === n; })[0];
      out.push(n === "Envelope" ? { n: n, c: "#A06E46", w: 1, st: 0 } : { n: n, c: L.color, w: L.width, st: L.style });
    });
    return out;
  }
  function takeShot() {
    if (!data || !data.package) return;
    var btn = $("#shotbtn"); btn.classList.add("busy");
    try {
      var cv = chart.takeScreenshot(), S = cv.width / Math.max(1, box.clientWidth);
      var HD = Math.round(62 * S), FT = Math.round(58 * S), Wd = cv.width, Hh = cv.height + HD + FT;
      var o = document.createElement("canvas"); o.width = Wd; o.height = Hh;
      var g = o.getContext("2d"), F = "Arial,Helvetica,sans-serif", tz = lang === "ru" ? " МСК" : " MSK";
      var px = function (n) { return Math.round(n * S) + "px "; };
      g.fillStyle = "#FFFFFF"; g.fillRect(0, 0, Wd, Hh);
      g.drawImage(cv, 0, HD);
      g.strokeStyle = "#C8C8C8"; g.lineWidth = Math.max(1, Math.round(S)); g.strokeRect(0.5, HD + 0.5, Wd - 1, cv.height - 1);
      var p = data.package, nowS = Math.floor(Date.now() / 1000);
      // header: title + meta (left), channel link (right), legend of the visible lines (right, line 2)
      g.textBaseline = "alphabetic"; g.fillStyle = "#1E1E1E"; g.font = "bold " + px(19) + F;
      g.fillText(t("shot_title", { s: sym }), 12 * S, 26 * S);
      g.font = px(12) + F; g.fillStyle = "#555";
      g.fillText(t("shot_meta", { n: fmtReal(nowS, true), b: data.last_bar_t ? fmtSrv(data.last_bar_t) : "—", v: String(p.version) }), 12 * S, 48 * S);
      g.textAlign = "right"; g.fillStyle = "#1E5AA0"; g.font = px(13) + F; g.fillText("t.me/iSpectrum_roadmaps", Wd - 12 * S, 24 * S);
      var lx = Wd - 12 * S, items = shotLegend().reverse();
      g.font = px(12) + F;
      items.forEach(function (it) {
        var tw = g.measureText(it.n).width; g.fillStyle = "#1E1E1E"; g.fillText(it.n, lx, 48 * S); lx -= tw + 5 * S;
        var w = (it.st ? 1 : Math.max(1, Math.min(6, it.w))) * S, x0 = lx - 18 * S; g.fillStyle = it.c;
        if (!it.st) g.fillRect(x0, 44 * S - w / 2, 18 * S, w); else for (var k = 0; k < 18; k += 5) g.fillRect(x0 + k * S, 44 * S - S / 2, 3 * S, S);
        lx = x0 - 12 * S;
      });
      g.textAlign = "left";
      // watermark on the plot: dimmed logo + channel link (as the sold screenshots)
      g.save(); g.globalAlpha = 0.34;
      if (logoImg.complete && logoImg.naturalWidth) { var lh = 30 * S; g.drawImage(logoImg, 10 * S, HD + 8 * S, lh * logoImg.naturalWidth / logoImg.naturalHeight, lh); }
      g.globalAlpha = 0.38; g.fillStyle = "#1E1E1E"; g.font = "bold " + px(14) + F; g.fillText("t.me/iSpectrum_roadmaps", 12 * S, HD + 56 * S);
      g.restore();
      // footer: not a trading signal + disclaimer + links
      var fy = HD + cv.height;
      g.font = "bold " + px(13) + F; g.fillStyle = "#A02828"; var sig = t("shot_sig"); g.fillText(sig, 12 * S, fy + 22 * S);
      var sx = 12 * S + g.measureText(sig).width + 8 * S; g.font = px(12) + F; g.fillStyle = "#555";
      g.fillText(t("shot_disc"), sx, fy + 22 * S, Wd - sx - 12 * S);
      g.fillStyle = "#888"; g.fillText("t.me/iSpectrum_roadmaps · @iSpectrumAccessBot · " + siteLink(), 12 * S, fy + 44 * S);
      g.textAlign = "right"; g.fillStyle = "#AAA"; g.font = px(10.5) + F; g.fillText("Chart: TradingView Lightweight Charts™", Wd - 12 * S, fy + 44 * S); g.textAlign = "left";
      var nm = "iSpectrum_" + sym + "_M30_" + fmtReal(nowS, true).replace(/^(\d\d)\.(\d\d)\.(\d{4}) (\d\d):(\d\d)$/, "$3-$2-$1_$4$5") + "MSK.png";
      var save = function (url, rel) { var a = document.createElement("a"); a.href = url; a.download = nm; document.body.appendChild(a); a.click(); a.remove(); if (rel) setTimeout(function () { URL.revokeObjectURL(url); }, 4000); btn.classList.remove("busy"); };
      if (o.toBlob) o.toBlob(function (b) { if (b) save(URL.createObjectURL(b), true); else save(o.toDataURL("image/png")); }, "image/png");
      else save(o.toDataURL("image/png"));
    } catch (e) { btn.classList.remove("busy"); }
  }
  $("#shotbtn").addEventListener("click", takeShot);

  // ---------------- v5: fullscreen (Fullscreen API, CSS fallback for iOS Safari) ----------------
  var stage = $("#stage"), fsCss = false;
  function fsEl() { return document.fullscreenElement || document.webkitFullscreenElement || null; }
  function fsOn() { return fsCss || fsEl() === stage; }
  function fsSync() {
    var on = fsOn(), b = $("#fsbtn");
    stage.classList.toggle("fs", on); document.body.classList.toggle("fslock", on);
    b.title = t(on ? "fs_exit" : "fs_tip"); b.setAttribute("aria-label", b.title); b.setAttribute("aria-pressed", on ? "true" : "false");
  }
  function fsEnter() {
    var rq = stage.requestFullscreen || stage.webkitRequestFullscreen;
    var css = function () { fsCss = true; fsSync(); };
    if (!rq) return css();
    try { var r = rq.call(stage, { navigationUI: "hide" }); if (r && r.catch) r.catch(css); } catch (e) { css(); }
  }
  function fsExit() {
    if (fsCss) { fsCss = false; fsSync(); return; }
    var ex = document.exitFullscreen || document.webkitExitFullscreen; if (ex && fsEl()) try { ex.call(document); } catch (e) {}
  }
  $("#fsbtn").addEventListener("click", function () { if (fsOn()) fsExit(); else fsEnter(); });
  document.addEventListener("fullscreenchange", fsSync); document.addEventListener("webkitfullscreenchange", fsSync);
  document.addEventListener("keydown", function (e) { if ((e.key === "Escape" || e.key === "Esc") && fsCss) fsExit(); });

  // ---------------- language ----------------
  function render() {
    document.documentElement.lang = lang;
    $$("[data-t]").forEach(function (e) { e.textContent = t(e.getAttribute("data-t")); });
    $$("[data-tt]").forEach(function (e) { e.title = t(e.getAttribute("data-tt")); e.setAttribute("aria-label", e.title); });
    fsSync();
    $$(".lang button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-lang") === lang); });
    chart.applyOptions({ localization: { locale: lang === "ru" ? "ru-RU" : "en-GB" } });
    renderSyms(); renderLegend(); renderMeta(); renderDash(); keyMsg();
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
