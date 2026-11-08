// Storefront catalog gate. Fetch is mocked; these tests never place an order.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const html = readFileSync(join(root, "index.html"), "utf8");
const js = readFileSync(join(root, "app.js"), "utf8");
// replace() treats $$ in a string as an escape, which would merge this file's $$ helper into $.
const page = html.replace('<script src="app.js"></script>', () => "<script>\n" + js + "\n</script>");

const base = {
  enabled: true,
  methods: { crypto: true, whop: true },
  bot: "iSpectrumAccessBot",
  products: { sub30: { usd: 80, days: 30, methods: ["crypto", "whop"] } },
};
const paused = { ...base, screenshot_sales_enabled: false };
const offered = {
  ...base,
  screenshot_sales_enabled: true,
  products: {
    sub30: { usd: 80, days: 30, methods: ["crypto", "whop"] },
    scr1: { usd: 3, methods: ["crypto"] },
    scr10: { usd: 17, n: 10, methods: ["crypto"] },
    topup: { min: 10, options: [20, 40], methods: ["crypto"] },
  },
};

function shownText(node) {
  if (!node) return "";
  if (node.nodeType === 3) return node.nodeValue || "";
  if (node.nodeType !== 1) return "";
  if (node.tagName === "SCRIPT" || node.tagName === "STYLE") return "";
  if (node.hidden || node.hasAttribute("hidden")) return "";
  if (node.id === "closed" && !node.classList.contains("show")) return "";
  if (node.id === "status" && !node.classList.contains("show")) return "";
  let s = "";
  for (const c of node.childNodes) s += shownText(c);
  return s;
}
function sub(doc, method) {
  return [...doc.querySelectorAll("[data-buy=sub30]")].find((b) => b.getAttribute("data-method") === method);
}
function prices(doc) {
  return [...doc.querySelectorAll("#scr_opts .opt span")].map((s) => s.textContent);
}
function settle() {
  return new Promise((r) => setTimeout(r, 30));
}

async function boot(opts = {}) {
  const posts = [];
  let release;
  const gate = opts.hang ? new Promise((res) => { release = res; }) : null;
  const dom = new JSDOM(page, {
    url: opts.url || "https://pay.example.test/?lang=en",
    runScripts: "dangerously",
    pretendToBeVisual: true,
    beforeParse(window) {
      if (opts.storage) {
        for (const [k, v] of Object.entries(opts.storage)) window.localStorage.setItem(k, v);
      }
      window.fetch = (url, init) => {
        const u = String(url);
        if (u.includes("/config")) {
          if (gate) return gate.then(() => ({ status: 200, json: async () => opts.config }));
          if (opts.configError === "network") return Promise.reject(new Error("offline"));
          if (opts.configError === "json") return Promise.resolve({ status: 200, json: () => Promise.reject(new Error("bad json")) });
          return Promise.resolve({ status: 200, json: async () => opts.config });
        }
        if (u.includes("/order") && init && init.method === "POST") {
          posts.push(JSON.parse(init.body));
          return Promise.resolve({
            status: opts.orderStatus || 200,
            json: async () => opts.orderBody || { status: "ok", id: 1, token: "tok", pay_url: "https://pay.example.test/?lang=en#paid" },
          });
        }
        if (u.includes("/order")) {
          return Promise.resolve({ status: 200, json: async () => (opts.order || { status: "expired" }) });
        }
        return Promise.resolve({ status: 404, json: async () => ({}) });
      };
    },
  });
  if (!opts.hang) await settle();
  return { document: dom.window.document, posts, release, window: dom.window };
}

test("static page does not ship an enabled screenshot buy or a hardcoded price", () => {
  assert.match(html, /id="scr_card" hidden/);
  assert.match(html, /data-buy="scr"[^>]*disabled/);
  assert.doesNotMatch(html, /data-p=/);
  assert.doesNotMatch(html, /\d+ USDT/);
  assert.match(html, /<title>iSpectrum — access<\/title>/);
  assert.doesNotMatch(html, /screenshots: crypto only/);
  assert.match(readFileSync(join(root, "style.css"), "utf8"), /#scr_card\[hidden\]\{display:none\}/);
});

test("paused catalog hides screenshot offers and leaves licence checkout on", async () => {
  const { document: doc } = await boot({ config: paused });
  assert.equal(doc.querySelector("#scr_card").hidden, true);
  assert.deepEqual(prices(doc), []);
  assert.equal(doc.querySelector("[data-buy=scr]").disabled, true);
  assert.equal(sub(doc, "crypto").disabled, false);
  assert.equal(sub(doc, "whop").disabled, false);
  assert.equal(doc.querySelector("#sub_price").textContent, "80");
  assert.equal(doc.querySelector("#closed").classList.contains("show"), false);
  assert.equal(doc.querySelector("h1").textContent, "Access");
  assert.doesNotMatch(doc.querySelector(".lead").textContent, /screenshot/i);
  assert.doesNotMatch(shownText(doc.body), /screenshot/i);
  assert.doesNotMatch(shownText(doc.body), /all screenshots|screenshot sales|paused/i);
  assert.equal(doc.title, "iSpectrum — access");
  assert.equal(doc.querySelectorAll('a[href="chart.html"]').length, 2);
  assert.ok(doc.querySelector('a[href="https://t.me/iSpectrumAccessBot"]'));
});

test("paused catalog still accepts a licence checkout and ignores a screenshot click", async () => {
  const { document: doc, posts } = await boot({ config: paused });
  doc.querySelector("[data-buy=scr]").disabled = false;
  doc.querySelector("[data-buy=scr]").dispatchEvent(new doc.defaultView.MouseEvent("click", { bubbles: true }));
  sub(doc, "whop").click();
  await settle();
  assert.deepEqual(posts, [{ product: "sub30", method: "whop", lang: "en" }]);
});

test("russian paused page does not advertise screenshot purchases", async () => {
  const { document: doc } = await boot({ url: "https://pay.example.test/?lang=ru", config: paused });
  assert.equal(doc.documentElement.lang, "ru");
  assert.equal(doc.querySelector("h1").textContent, "Доступ");
  assert.doesNotMatch(doc.querySelector(".lead").textContent, /скриншот/i);
  assert.doesNotMatch(shownText(doc.body), /скриншот/i);
  assert.equal(doc.querySelector("#scr_card").hidden, true);
  assert.equal(sub(doc, "crypto").textContent, "Оплатить криптой (USDT/USDC)");
  assert.equal(sub(doc, "whop").disabled, false);
  doc.querySelector('[data-lang="en"]').click();
  assert.equal(doc.querySelector("h1").textContent, "Access");
  assert.equal(doc.querySelector("#scr_card").hidden, true);
});

test("enabled catalog shows only server prices and can be checked out", async () => {
  const { document: doc, posts } = await boot({ config: offered });
  assert.equal(doc.querySelector("#scr_card").hidden, false);
  assert.equal(doc.querySelector("[data-buy=scr]").disabled, false);
  assert.deepEqual(prices(doc), ["3 USDT", "17 USDT", "20 USDT", "40 USDT"]);
  assert.deepEqual([...doc.querySelectorAll("#scr_opts .opt b")].map((b) => b.textContent), ["1 screenshot", "10 screenshots", "Balance", "Balance"]);
  assert.equal(doc.querySelector("#scr_opts .opt.on").getAttribute("data-p"), "scr1");
  assert.equal(doc.querySelector("h1").textContent, "Access and screenshots");
  assert.match(doc.querySelector(".lead").textContent, /Screenshots and balance: crypto only/);
  assert.equal(doc.title, "iSpectrum — access and screenshots");
  assert.match(doc.querySelector('meta[name="description"]').getAttribute("content"), /screenshots: crypto only/);
  assert.equal(sub(doc, "crypto").disabled, false);
  assert.equal(sub(doc, "whop").disabled, false);
  const pack = doc.querySelector('[data-p="scr10"]');
  pack.click();
  assert.equal(pack.classList.contains("on"), true);
  doc.querySelector("[data-buy=scr]").click();
  sub(doc, "crypto").click();
  await settle();
  assert.deepEqual(posts[0], { product: "scr10", method: "crypto", lang: "en" });
  assert.deepEqual(posts[1], { product: "sub30", method: "crypto", lang: "en" });
});

test("enabled catalog follows the russian labels without inventing prices", async () => {
  const { document: doc } = await boot({ url: "https://pay.example.test/?lang=ru", config: offered });
  assert.equal(doc.querySelector("h1").textContent, "Доступ и скриншоты");
  assert.deepEqual([...doc.querySelectorAll("#scr_opts .opt b")].map((b) => b.textContent), ["1 скриншот", "10 скриншотов", "Баланс", "Баланс"]);
  assert.deepEqual(prices(doc), ["3 USDT", "17 USDT", "20 USDT", "40 USDT"]);
  doc.querySelector('[data-lang="en"]').click();
  assert.equal(doc.querySelector("#scr_opts .opt b").textContent, "1 screenshot");
  assert.equal(doc.querySelectorAll("#scr_opts .opt").length, 4);
});

test("a false sales flag hides offers even when the products are still listed", async () => {
  const config = { ...offered, screenshot_sales_enabled: false };
  const { document: doc, posts } = await boot({ config });
  assert.equal(doc.querySelector("#scr_card").hidden, true);
  assert.deepEqual(prices(doc), []);
  assert.doesNotMatch(shownText(doc.body), /3 USDT|17 USDT|20 USDT/);
  assert.equal(sub(doc, "crypto").disabled, false);
  sub(doc, "crypto").click();
  await settle();
  assert.deepEqual(posts, [{ product: "sub30", method: "crypto", lang: "en" }]);
});

test("omitted products stay hidden when the flag is missing or true", async () => {
  const missingFlag = { ...base, products: { ...base.products, scr1: { usd: 3, methods: ["crypto"] } } };
  const flagged = await boot({ config: { ...base, screenshot_sales_enabled: true } });
  const legacy = await boot({ config: missingFlag });
  assert.equal(flagged.document.querySelector("#scr_card").hidden, true);
  assert.deepEqual(prices(flagged.document), []);
  assert.equal(sub(flagged.document, "whop").disabled, false);
  assert.equal(legacy.document.querySelector("#scr_card").hidden, false);
  assert.deepEqual(prices(legacy.document), ["3 USDT"]);
  assert.equal(legacy.document.querySelectorAll("#scr_opts .opt").length, 1);
  assert.equal(sub(legacy.document, "crypto").disabled, false);
});

test("top-up amounts come from the catalog and junk amounts are dropped", async () => {
  const config = {
    ...base,
    screenshot_sales_enabled: true,
    products: {
      ...base.products,
      topup: { min: 10, options: ["nope", 0, -5, 15, "30"], methods: ["crypto"] },
    },
  };
  const { document: doc, posts } = await boot({ config });
  assert.deepEqual(prices(doc), ["15 USDT", "30 USDT"]);
  doc.querySelector('[data-usd="30"]').click();
  doc.querySelector("[data-buy=scr]").click();
  await settle();
  assert.deepEqual(posts, [{ product: "topup", method: "crypto", lang: "en", usd: 30 }]);
});

test("config is not applied yet: no screenshot buy, licence buttons stay usable", async () => {
  const pending = await boot({ hang: true, config: offered });
  const doc = pending.document;
  assert.equal(doc.querySelector("#scr_card").hidden, true);
  assert.deepEqual(prices(doc), []);
  assert.equal(doc.querySelector("[data-buy=scr]").disabled, true);
  assert.equal(sub(doc, "crypto").disabled, false);
  assert.equal(sub(doc, "whop").disabled, false);
  assert.doesNotMatch(shownText(doc.body), /screenshot/i);
  assert.equal(doc.querySelector("#closed").classList.contains("show"), false);
  pending.release();
  await settle();
  assert.equal(doc.querySelector("#scr_card").hidden, false);
  assert.deepEqual(prices(doc), ["3 USDT", "17 USDT", "20 USDT", "40 USDT"]);
  assert.equal(sub(doc, "crypto").disabled, false);
});

test("a failed or unreadable config hides screenshot sales and closes checkout", async () => {
  for (const configError of ["network", "json"]) {
    const { document: doc, posts } = await boot({ configError });
    assert.equal(doc.querySelector("#scr_card").hidden, true);
    assert.deepEqual(prices(doc), []);
    assert.equal(doc.querySelector("#closed").classList.contains("show"), true);
    assert.equal(sub(doc, "crypto").disabled, true);
    assert.equal(sub(doc, "whop").disabled, true);
    assert.equal(doc.querySelector("h1").textContent, "Access");
    assert.doesNotMatch(shownText(doc.body), /screenshot/i);
    sub(doc, "crypto").click();
    await settle();
    assert.deepEqual(posts, []);
  }
});

test("a closed shop stays closed for the licence and does not reveal screenshot prices", async () => {
  const { document: doc } = await boot({
    config: { ...offered, enabled: false },
  });
  assert.equal(doc.querySelector("#closed").classList.contains("show"), true);
  assert.equal(doc.querySelector("#scr_card").hidden, true);
  assert.deepEqual(prices(doc), []);
  assert.equal(sub(doc, "crypto").disabled, true);
  assert.equal(sub(doc, "whop").disabled, true);
});

test("method flags still govern licence buttons while screenshot sales are paused", async () => {
  const { document: doc } = await boot({
    config: { ...paused, methods: { crypto: false, whop: true } },
  });
  assert.equal(sub(doc, "crypto").disabled, true);
  assert.equal(sub(doc, "whop").disabled, false);
  assert.equal(doc.querySelector("#scr_card").hidden, true);
  assert.equal(doc.querySelector("#sub_price").textContent, "80");
});

test("licence price still follows sub30 while screenshot products are omitted", async () => {
  const { document: doc } = await boot({
    config: { ...paused, products: { sub30: { usd: 90, days: 30, methods: ["crypto", "whop"] } } },
  });
  assert.equal(doc.querySelector("#sub_price").textContent, "90");
  assert.equal(doc.querySelector("#scr_card").hidden, true);
  assert.equal(sub(doc, "whop").disabled, false);
});

test("a returning screenshot order still shows its key while new sales stay hidden", async () => {
  const { document: doc } = await boot({
    url: "https://pay.example.test/?lang=en&o=7",
    config: paused,
    storage: { isp_orders: JSON.stringify([{ id: 7, token: "abc", at: Date.now() }]) },
    order: { status: "paid", product: "scr1", usd: 2, key: "ISP-TEST-TEST-TEST", bot_link: "https://t.me/iSpectrumAccessBot?start=key_ISP-TEST-TEST-TEST" },
  });
  assert.match(doc.querySelector("#st_body").textContent, /1 screenshot/);
  assert.match(doc.querySelector("#st_body").textContent, /ISP-TEST-TEST-TEST/);
  assert.equal(doc.querySelector("#scr_card").hidden, true);
  assert.deepEqual(prices(doc), []);
  assert.equal(sub(doc, "crypto").disabled, false);
});
