// iSpectrum paywall page: no framework, no cookies, no trackers. Talks only to the shop API (JSON).
(function () {
  "use strict";
  var API = "https://tosszbmacumhmmdyegol.supabase.co/functions/v1/shop";
  var BOT = "iSpectrumAccessBot";
  var T = {
    en: {
      h1: "Access and screenshots", lead: "Licence: pay by crypto or card. Screenshots and balance: crypto only. After payment you get an access key that activates in @iSpectrumAccessBot.",
      closed: "Payments are temporarily unavailable. Please check back later.",
      sub_title: "iSpectrum licence — 30 days", sub_per: "/ 30 days",
      sub_i1: "iSpectrum indicator for MT4 (MT5 EA coming)", sub_i2: "Download, MT4 account activation and licence management via @iSpectrumAccessBot", sub_i3: "Included: Private Research channel and Tutorials",
      sub_note: "A key adds 30 days. If you already have an active licence, the days are added to its end date.",
      pay_crypto: "Pay with crypto (USDT/USDC)", pay_card: "Pay by card (Whop)",
      scr_title: "Projection screenshots", scr_desc: "A current M30 chart of one instrument (BTCUSD, EURUSD, GBPUSD, HK50, NAS100, US500, WTI, XAUUSD) with the iSpectrum projection lines, as published in the channel. No commentary. You choose the instrument in the bot.",
      o1: "1 screenshot", o10: "10 screenshots", otop: "Balance",
      scr_note: "Screenshots and balance are credited to your account in the bot when you activate the key. The balance is used only for screenshots and is not withdrawable. Minimum top-up: 10 USDT. Payment: crypto only (USDT/USDC).",
      how_title: "How it works", how1: "Choose an option and pay on the Crypto Pay page (the licence can also be paid by card on Whop).", how2: "Return to this page: your access key appears here.",
      how3: "Tap “Open bot with key”, or send the key to @iSpectrumAccessBot → 🔑 Activate key.",
      st_title: "Your order", wait: "Waiting for payment confirmation…", waitnote: "This page checks the status automatically. You can close it and come back later on this device.",
      paid: "Payment received. Your access key:", copy: "Copy key", copied: "Copied", open_bot: "Open bot with key",
      keynote: "The key can be used once. Keep it private until you activate it. Manual entry: @iSpectrumAccessBot → 🔑 Activate key.",
      expired: "The invoice has expired. Nothing was charged. You can start a new payment.", failed: "The payment could not be started. Please try again later.",
      payagain: "Open the payment page", unavailable: "This payment method is not available right now.", busy: "Too many attempts. Please wait a few minutes.",
      what: { sub30: "iSpectrum licence, 30 days", scr1: "1 screenshot", scr10: "10 screenshots", topup: "Balance top-up" },
      disc_b: "Not investment advice.", disc: "iSpectrum shows model-based projections for information only. They are not trading signals and do not guarantee future prices. Trading involves risk.",
      terms: "Terms", privacy: "Privacy", starting: "Opening the payment page…",
    },
    ru: {
      h1: "Доступ и скриншоты", lead: "Лицензия: оплата криптовалютой или картой. Скриншоты и баланс: только криптовалютой. После оплаты вы получите ключ доступа, который активируется в @iSpectrumAccessBot.",
      closed: "Оплата временно недоступна. Пожалуйста, зайдите позже.",
      sub_title: "Лицензия iSpectrum — 30 дней", sub_per: "/ 30 дней",
      sub_i1: "Индикатор iSpectrum для MT4 (советник для MT5 — скоро)", sub_i2: "Скачивание, активация счёта MT4 и управление лицензией через @iSpectrumAccessBot", sub_i3: "В комплекте: канал Private Research и Tutorials",
      sub_note: "Ключ добавляет 30 дней. Если лицензия уже активна, дни добавляются к дате её окончания.",
      pay_crypto: "Оплатить криптой (USDT/USDC)", pay_card: "Оплатить картой (Whop)",
      scr_title: "Скриншоты проекций", scr_desc: "Актуальный график M30 одного инструмента (BTCUSD, EURUSD, GBPUSD, HK50, NAS100, US500, WTI, XAUUSD) с линиями проекции iSpectrum, как в канале. Без комментариев. Инструмент выбирается в боте.",
      o1: "1 скриншот", o10: "10 скриншотов", otop: "Баланс",
      scr_note: "Скриншоты и баланс зачисляются на ваш аккаунт в боте при активации ключа. Баланс используется только для скриншотов и не выводится. Минимальное пополнение: 10 USDT. Оплата: только криптовалютой (USDT/USDC).",
      how_title: "Как это работает", how1: "Выберите вариант и оплатите на странице Crypto Pay (лицензию можно оплатить и картой на Whop).", how2: "Вернитесь на эту страницу: здесь появится ключ доступа.",
      how3: "Нажмите «Открыть бот с ключом» или отправьте ключ в @iSpectrumAccessBot → 🔑 Активировать ключ.",
      st_title: "Ваш заказ", wait: "Ожидаем подтверждение оплаты…", waitnote: "Страница проверяет статус автоматически. Можно закрыть её и вернуться позже на этом устройстве.",
      paid: "Оплата получена. Ваш ключ доступа:", copy: "Скопировать ключ", copied: "Скопировано", open_bot: "Открыть бот с ключом",
      keynote: "Ключ можно использовать один раз. Не передавайте его до активации. Вручную: @iSpectrumAccessBot → 🔑 Активировать ключ.",
      expired: "Срок счёта истёк. Ничего не списано. Можно начать новую оплату.", failed: "Не удалось начать оплату. Попробуйте позже.",
      payagain: "Открыть страницу оплаты", unavailable: "Этот способ оплаты сейчас недоступен.", busy: "Слишком много попыток. Подождите несколько минут.",
      what: { sub30: "Лицензия iSpectrum на 30 дней", scr1: "1 скриншот", scr10: "10 скриншотов", topup: "Пополнение баланса" },
      disc_b: "Не является инвестиционной рекомендацией.", disc: "iSpectrum показывает модельные проекции только для информации. Это не торговые сигналы и не гарантия будущих цен. Торговля связана с риском.",
      terms: "Условия", privacy: "Конфиденциальность", starting: "Открываем страницу оплаты…",
    },
  };
  var qs = new URLSearchParams(location.search);
  var lang = qs.get("lang") || localStorage.getItem("isp_lang") || ((navigator.language || "").slice(0, 2) === "ru" ? "ru" : "en");
  if (!T[lang]) lang = "en";
  var $ = function (s) { return document.querySelector(s); }, $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  function t(k) { return T[lang][k]; }
  // card payments (Whop) are for the 30-day licence only; screenshots and balance are crypto only
  $$("[data-method=whop]").forEach(function (b) { if (b.getAttribute("data-buy") !== "sub30") b.parentNode.removeChild(b); });
  function render() {
    document.documentElement.lang = lang;
    $$("[data-t]").forEach(function (el) { el.textContent = t(el.getAttribute("data-t")); });
    $$(".lang button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-lang") === lang); });
    if (current) showStatus(current.last);
  }
  $$(".lang button").forEach(function (b) { b.addEventListener("click", function () { lang = b.getAttribute("data-lang"); localStorage.setItem("isp_lang", lang); render(); }); });
  var sel = { p: "scr1", usd: null };
  $$("#scr_opts .opt").forEach(function (b) {
    b.addEventListener("click", function () {
      $$("#scr_opts .opt").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on");
      sel = { p: b.getAttribute("data-p"), usd: b.getAttribute("data-usd") ? Number(b.getAttribute("data-usd")) : null };
    });
  });
  // ---- orders kept in localStorage (id + poll token); the token never leaves this browser except to the shop API
  function saved() { try { return JSON.parse(localStorage.getItem("isp_orders") || "[]"); } catch (e) { return []; } }
  function save(list) { localStorage.setItem("isp_orders", JSON.stringify(list.slice(-10))); }
  var current = null, timer = null;
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function showStatus(s) {
    var box = $("#st_body"); box.textContent = ""; $("#status").classList.add("show");
    if (!s) { box.appendChild(el("p", null, "")).appendChild(el("span", "spin")); box.lastChild.appendChild(document.createTextNode(t("wait"))); return; }
    box.appendChild(el("p", "note", (t("what")[s.product] || "") + (s.usd ? " · " + s.usd + " USD" : "")));
    if (s.status === "paid" && s.key) {
      box.appendChild(el("p", "ok", t("paid")));
      box.appendChild(el("div", "keybox", s.key));
      var row = el("div", "row");
      var c = el("button", "btn alt", t("copy"));
      c.addEventListener("click", function () { (navigator.clipboard ? navigator.clipboard.writeText(s.key) : Promise.reject()).then(function () { c.textContent = t("copied"); }, function () {}); });
      var a = el("a", "btn", t("open_bot")); a.href = s.bot_link || ("https://t.me/" + BOT + "?start=key_" + s.key); a.rel = "noopener";
      row.appendChild(a); row.appendChild(c); box.appendChild(row);
      box.appendChild(el("p", "note", t("keynote")));
    } else if (s.status === "pending" || s.status === "created") {
      var p = el("p"); p.appendChild(el("span", "spin")); p.appendChild(document.createTextNode(t("wait"))); box.appendChild(p);
      if (s.pay_url) { var b = el("a", "btn alt", t("payagain")); b.href = s.pay_url; b.rel = "noopener noreferrer"; box.appendChild(b); }
      box.appendChild(el("p", "note", t("waitnote")));
    } else if (s.status === "expired") box.appendChild(el("p", "err", t("expired")));
    else box.appendChild(el("p", "err", t("failed")));
  }
  function poll(o, payment) {
    current = o;
    var n = 0;
    function tick() {
      var u = API + "/order?id=" + encodeURIComponent(o.id) + "&t=" + encodeURIComponent(o.token) + (payment ? "&payment=" + encodeURIComponent(payment) : "");
      fetch(u, { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (s) {
        o.last = s; showStatus(s);
        if (s.status === "paid" || s.status === "expired" || s.status === "failed") { clearTimeout(timer); return; }
        n++; timer = setTimeout(tick, n < 60 ? 4000 : 15000);
      }).catch(function () { n++; timer = setTimeout(tick, 10000); });
    }
    showStatus(o.last || null); tick();
  }
  function start(product, method, usd) {
    var body = { product: product, method: method, lang: lang }; if (usd) body.usd = usd;
    $("#status").classList.add("show"); $("#st_body").textContent = t("starting");
    fetch(API + "/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().then(function (j) { return { code: r.status, j: j }; }); })
      .then(function (x) {
        if (x.code === 200 && x.j.pay_url) {
          var list = saved(); list.push({ id: x.j.id, token: x.j.token, at: Date.now() }); save(list);
          location.href = x.j.pay_url;   // leave for the provider page (browser); it returns to ?o=<id>
        } else $("#st_body").textContent = (x.j.status === "method_unavailable" || x.j.status === "method_not_offered") ? t("unavailable") : x.j.status === "rate_limited" ? t("busy") : x.j.status === "closed" ? t("closed") : t("failed");
      }).catch(function () { $("#st_body").textContent = t("failed"); });
  }
  $$("[data-buy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var m = b.getAttribute("data-method");
      if (m === "whop" && b.getAttribute("data-buy") !== "sub30") return;
      if (b.getAttribute("data-buy") === "sub30") start("sub30", m); else start(sel.p, m, sel.usd);
    });
  });
  // ---- config: prices, methods, open/closed
  fetch(API + "/config", { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (c) {
    if (!c.enabled) { $("#closed").classList.add("show"); $$("[data-buy]").forEach(function (b) { b.disabled = true; }); return; }
    if (c.products && c.products.sub30) $("#sub_price").textContent = c.products.sub30.usd;
    $$("[data-method=crypto]").forEach(function (b) { b.disabled = !c.methods.crypto; });
    $$("[data-method=whop]").forEach(function (b) { b.disabled = !c.methods.whop; });
  }).catch(function () { $("#closed").classList.add("show"); $$("[data-buy]").forEach(function (b) { b.disabled = true; }); });
  // ---- returning from a payment page (?o=<id>, Whop adds &payment=&status=) or a pending order from earlier
  render();
  var oid = qs.get("o"), list = saved().filter(function (o) { return Date.now() - o.at < 3 * 86400000; });
  var o = oid ? list.filter(function (x) { return String(x.id) === oid; })[0] : list[list.length - 1];
  if (o && (oid || Date.now() - o.at < 2 * 3600000)) poll(o, qs.get("payment"));
})();
