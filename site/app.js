/* 破局十六週 — site script (all pages) */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const PAGE = document.body.dataset.page;

/* =========================================================
   i18n — Chinese text lives in the HTML; English here.
   ========================================================= */
let LANG = "zh";
try { LANG = localStorage.getItem("lang") || ((navigator.language || "").startsWith("zh") ? "zh" : "en"); } catch {}

const EN = {
  "hero.t1": "Break", "hero.t2": "the 16", "hero.sub": "NCCU Food Street <b>×</b> Holiday Meal Buddies",
  "hero.lead": "Shorter semesters mean longer holidays, and the streets around NCCU go quiet. We bring people back two ways: zoo visitors spin a coupon, and students staying on campus find someone to eat with.",
  "hero.cta1": "🎡 Spin a Coupon", "hero.cta2": "🔔 Find Meal Buddies",
  "hero.s1": "min by bus, Zoo to NCCU", "hero.s2": "local shops around NCCU", "hero.s3": "group-size deal modes",
  "road.zoo": "🦁 Taipei Zoo", "road.nccu": "NCCU Eats 🍜",
  "wheel.h": "Spin a Coupon", "wheel.note": "Came from the zoo QR code? Tell us how many of you there are.",
  "mode.solo.btn": "🧍 Solo", "mode.duo.btn": "👫 Pair", "mode.group.btn": "👨‍👩‍👧‍👦 Group",
  "wheel.spin": "SPIN for a deal", "wheel.terms": "Every coupon lists its minimum spend, valid hours and party size. Final offers are subject to each shop's in-store terms.",
  "coupon.redeem": "Show to redeem", "coupon.map": "🚌 Getting there", "coupon.again": "Spin again", "coupon.stamp": "REDEEMED",
  "coupon.transit": "<b>Taipei Zoo to NCCU</b>: take a bus toward 「政大 NCCU」 from the stops near the zoo, about 10 minutes, and get off at the NCCU stop. The food street is a short walk away. Check Taipei e-bus for live routes.",
  "next.bell.k": "Holiday buddies", "next.bell": "Meal Bell", "next.shops.k": "Around NCCU", "next.shops": "Shops", "next.about.k": "Who we are", "next.about": "About Us",
  "why.k": "Why we do this", "why.h": "Why we're doing this",
  "why.lead": "Semesters went from 18 weeks to 16. Holidays start earlier and last longer. For students that's freedom; for the shops on Zhinan Road it's weeks of empty tables.",
  "why.c1h": "A new calendar", "why.c1p": "Universities moved to 16-week semesters, so students leave earlier and breaks keep getting longer.",
  "why.c2h": "One kind of customer", "why.c2p": "Business around NCCU runs almost entirely on students. When they leave, the whole street goes quiet.",
  "why.c3h": "Shops are struggling", "why.c3p": "Some shops lose close to 60% of their revenue over the holidays, and a few are thinking about closing.",
  "why.q": "“We didn't want to just wait for the semester.”", "why.qs": "Instead of waiting for crowds to return, we bring them in.",
  "why.t1tag": "Bring people in", "why.t1h": "Taipei Zoo × NCCU<br>Spin-a-Coupon", "why.t1p": "The zoo is ten minutes away by bus, but food options inside are limited. Visitors spin a deal sized to their group and come to NCCU for a proper meal.", "why.t1btn": "Try the wheel",
  "why.t2tag": "Keep people here", "why.t2h": "Meal Bell<br>Holiday Buddies", "why.t2p": "Students and international students who stay on campus often skip going out because they have no one to eat with. We match you by time, budget, taste and group size, so shared dishes are back on the table.", "why.t2btn": "Find a buddy",
  "why.goal": "Good for everyone", "why.g1h": "Shops", "why.g1p": "Steady customers during the holidays, and new faces beyond students.", "why.g2h": "Diners", "why.g2p": "Visitors eat well for less; students don't have to eat alone.", "why.g3h": "Community", "why.g3p": "Connecting tourism and campus life keeps the neighborhood lively all year.",
  "bell.k": "Holiday Meal Buddies", "bell.h": "Meal Bell", "bell.lead": "Staying on campus, studying abroad, or craving dishes that are hard to order alone? Ring the bell and we'll fill the table.",
  "bell.nick": "Nickname", "bell.nickph": "What should we call you?", "bell.contact": "Contact", "bell.contactph": "LINE ID or email",
  "bell.date": "Date", "bell.who": "I am", "bell.who1": "NCCU student", "bell.who2": "International student", "bell.who3": "Local resident", "bell.who4": "Other",
  "bell.time": "Time", "bell.t1": "Lunch 12:00", "bell.t2": "Tea 15:00", "bell.t3": "Dinner 18:30", "bell.budget": "Budget / person",
  "bell.pref": "Food preference", "bell.p0": "Anything", "bell.p1": "Chinese", "bell.p2": "Western", "bell.p3": "International", "bell.p4": "Vegetarian",
  "bell.ppl": "Group size", "bell.consent": "I agree that Break the 16 may collect the information above under Taiwan's Personal Data Protection Act, only for matching and notifying me, and delete it after the event.",
  "bell.submit": "Ring the bell", "bell.empty": "Fill in your preferences and ring the bell.<br>We'll match you by time, budget and taste.",
  "bell.rulesh": "Safety first", "bell.r1h": "Meet in public", "bell.r1p": "First meetups always happen at partner shops or other public venues.", "bell.r2h": "Flexible cancellation", "bell.r2p": "Cancel free up to 3 hours before. We'll let you know if a group doesn't fill.", "bell.r3h": "We're reachable", "bell.r3p": "Questions or concerns? Reach us through the contact details on the About page.",
  "shops.k": "Partner Shops", "shops.h": "Shops around NCCU", "shops.lead": "From Zhinan Rd to Wanshou Rd and Xinguang Rd: flavors students have loved for years. Tap a shop to see deals for every group size.", "shops.note": "Final offers are subject to each shop's in-store terms.",
  "f.all": "All", "f.cn": "Chinese", "f.west": "Western", "f.brunch": "Brunch / Sweets", "f.intl": "International",
  "about.k": "About Us", "about.h": "About Us", "about.lead": "We're a small team from <b>National Chengchi University</b>.",
  "about.p1": "We're students who have eaten more meals on Zhinan Road than we can count. When the 16-week calendar arrived, we watched familiar shops go quiet one by one over the long breaks, and decided to do something about it.",
  "about.p2": "The idea is simple: get zoo visitors to ride ten more minutes for a meal at NCCU, and make sure students staying on campus don't eat alone. When the street comes alive again, so does our everyday life.",
  "about.tag1": "Cross-area partnerships", "about.tag2": "Digital matching", "about.tag3": "Group-size deals", "about.tag4": "Good for everyone", "about.why": "Why we're doing this",
  "contact.tag": "Contact", "contact.h": "Partnerships, press, or any ideas", "contact.person": "Contact person", "contact.name": "Hsiao Chih-Hung (蕭志紘)", "contact.phone": "Phone", "contact.loc": "Based at", "contact.locv": "NCCU, Wenshan District, Taipei", "contact.call": "📞 Call now", "contact.copy": "Copy number",
  "admin.h": "Meal Bell Dashboard", "admin.key": "Admin key", "admin.enter": "Enter", "admin.refresh": "Refresh", "admin.csv": "Export CSV", "admin.logout": "Log out",
  "admin.byTime": "By time slot", "admin.byPref": "Food preference", "admin.byPpl": "Group size", "admin.byWho": "Who signed up", "admin.list": "Sign-ups", "admin.c.time": "Submitted", "admin.coupons": "Coupons by shop",
};
const JS = {
  zh: {
    "nav.home": "轉盤優惠", "nav.why": "為什麼做這個", "nav.bell": "心動鈴", "nav.shops": "合作店家", "nav.about": "關於我們", "nav.cta": "立即轉一轉", "nav.menu": "選單",
    "foot.tag": "讓政大商圈的假期也熱鬧。", "foot.links": "頁面", "foot.contact": "聯繫", "foot.copy": "© 2026 破局十六週・國立政治大學",
    "mode.solo": "一人模式", "mode.duo": "二人模式", "mode.group": "多人模式",
    "mode.solo.d": "獨自用餐：個人套餐優惠、主餐加購、飲品或配菜升級。", "mode.duo.d": "朋友、情侶、兩位家人：雙人套餐、分享小菜、雙人加購優惠。", "mode.group.d": "三人以上朋友或家庭：多人分享餐、滿額贈品、指定合菜組合。",
    "min.solo": "最低消費 $150", "min.duo": "最低消費 $300", "min.group": "最低消費 $500", "ppl.solo": "限 1 人", "ppl.duo": "限 2 人同行", "ppl.group": "3 人以上",
    "r.hours": "平日 11:00–17:00 適用", "r.nostack": "不可與其他優惠併用", "r.exp": "領取後 7 日內有效",
    "spinning": "轉動中…", "hours": "營業", "redeemed": "核銷成功！祝用餐愉快 🙌", "redeemDone": "✓ 已核銷",
    "deals": "各人數優惠", "goWheel": "去轉盤試手氣",
    "need.nick": "請填寫暱稱", "need.contact": "請填寫聯絡方式", "need.date": "請選擇用餐日期", "need.consent": "請勾選個資同意", "min2": "最少 2 人成團", "max8": "單團上限 8 人",
    "bell.ok": "叮！已收到你的心動鈴", "bell.okp": "我們正在幫你湊桌，成團後會透過 {c} 通知你時間與店家。", "bell.sum": "你的條件", "bell.sug": "符合口味的店家", "bell.more": "看所有店家", "bell.again": "再按一次", "bell.fail": "送出失敗，請稍後再試或直接聯繫我們。", "bell.sending": "叮鈴鈴…送出中",
    "copied": "已複製電話 0905-116-999",
    "a.total": "心動鈴報名", "a.people": "預計總人數", "a.avgBudget": "平均預算", "a.coupons": "優惠券領取", "a.redeem": "核銷率", "a.updated": "更新於", "a.bad": "金鑰錯誤", "a.err": "讀取失敗", "a.empty": "目前還沒有資料",
    "t.lunch": "午餐", "t.tea": "下午茶", "t.dinner": "晚餐", "p.any": "都可以", "p.chinese": "中式", "p.western": "西式", "p.intl": "異國", "p.veg": "素食",
    "w.student": "政大學生", "w.intl": "外籍／交換生", "w.local": "附近居民", "w.other": "其他", "persons": "人",
  },
  en: {
    "nav.home": "Spin", "nav.why": "Why", "nav.bell": "Meal Bell", "nav.shops": "Shops", "nav.about": "About", "nav.cta": "Spin now", "nav.menu": "Menu",
    "foot.tag": "Keeping NCCU's food street lively, even on holidays.", "foot.links": "Pages", "foot.contact": "Contact", "foot.copy": "© 2026 Break the 16 · National Chengchi University",
    "mode.solo": "Solo", "mode.duo": "Pair", "mode.group": "Group",
    "mode.solo.d": "Dining alone: set-meal deals, add-ons, drink or side upgrades.", "mode.duo.d": "Friends, couples, two family members: combo meals, shared sides, add-on deals for two.", "mode.group.d": "Three or more: sharing platters, spend-and-get gifts, family-style combos.",
    "min.solo": "Min. spend $150", "min.duo": "Min. spend $300", "min.group": "Min. spend $500", "ppl.solo": "1 person", "ppl.duo": "2 people", "ppl.group": "3+ people",
    "r.hours": "Weekdays 11:00–17:00", "r.nostack": "Can't combine with other offers", "r.exp": "Valid 7 days",
    "spinning": "Spinning…", "hours": "Open", "redeemed": "Redeemed! Enjoy your meal 🙌", "redeemDone": "✓ Redeemed",
    "deals": "Deals by group size", "goWheel": "Try the wheel",
    "need.nick": "Please enter a nickname", "need.contact": "Please enter your contact", "need.date": "Please pick a date", "need.consent": "Please agree to the data notice", "min2": "Groups need at least 2", "max8": "Max 8 per group",
    "bell.ok": "Ding! Your bell has been rung", "bell.okp": "We're putting your table together and will contact you via {c} with the time and place once the group is set.", "bell.sum": "Your request", "bell.sug": "Shops that fit your taste", "bell.more": "See all shops", "bell.again": "Ring again", "bell.fail": "Couldn't send. Please try again later or contact us directly.", "bell.sending": "Ringing…",
    "copied": "Copied 0905-116-999",
    "a.total": "Sign-ups", "a.people": "Total diners wanted", "a.avgBudget": "Avg. budget", "a.coupons": "Coupons issued", "a.redeem": "Redemption rate", "a.updated": "Updated", "a.bad": "Wrong key", "a.err": "Couldn't load data", "a.empty": "No data yet",
    "t.lunch": "Lunch", "t.tea": "Tea", "t.dinner": "Dinner", "p.any": "Anything", "p.chinese": "Chinese", "p.western": "Western", "p.intl": "International", "p.veg": "Vegetarian",
    "w.student": "NCCU student", "w.intl": "International", "w.local": "Local", "w.other": "Other", "persons": "ppl",
  },
};
const t = (k) => JS[LANG][k] ?? JS.zh[k] ?? k;

/* =========================================================
   Shops — real shops around NCCU
   ========================================================= */
const SHOPS = [
  { id: "waffle", zh: "小木屋鬆餅 政大店", en: "Xiaomuwu Waffles (NCCU)", cat: "早午餐", icon: "🧇", color: "#F6C453", addr: ["政大商圈・指南路二段", "Zhinan Rd Sec. 2"], hours: "10:00–21:00",
    deals: { solo: ["鹹鬆餅＋飲品 折 $30", "$30 off savory waffle + drink"], duo: ["雙人鬆餅分享組 9 折", "10% off waffle set for two"], group: ["滿 $600 送招牌甜鬆餅", "Free signature waffle over $600"] } },
  { id: "juicy", zh: "Juicy Bun Burger", en: "Juicy Bun Burger", cat: "西式", icon: "🍔", color: "#E76F51", addr: ["政大校門口前", "Across from NCCU main gate"], hours: "11:00–21:00",
    deals: { solo: ["主餐加購薯條 半價", "Half-price fries with a main"], duo: ["雙人堡＋分享薯條 折 $60", "$60 off two burgers + fries"], group: ["4 人以上送洋蔥圈拼盤", "Free onion ring platter for 4+"] } },
  { id: "libai", zh: "李白 Breakfast × Coffee", en: "Li Bai Breakfast × Coffee", cat: "早午餐", icon: "☕", color: "#A8DADC", addr: ["政大周邊・萬壽路", "Wanshou Rd, near NCCU"], hours: "07:30–15:00",
    deals: { solo: ["早午餐飲品升級大杯", "Free large drink upgrade"], duo: ["雙人早午餐套餐 85 折", "15% off brunch for two"], group: ["分享盤 滿 $800 折 $100", "$100 off platters over $800"] } },
  { id: "minzhong", zh: "敏忠小吃", en: "Minzhong Eatery", cat: "中式", icon: "🍳", color: "#F4A261", addr: ["政大側門斜對面", "Opposite NCCU side gate"], hours: "11:00–20:30",
    deals: { solo: ["炒飯／蓋飯 加蛋免費", "Free egg with fried rice / rice bowl"], duo: ["兩份主餐送燙青菜", "Free greens with two mains"], group: ["合菜點糖醋魚 折 $50", "$50 off sweet & sour fish"] } },
  { id: "jinghua", zh: "京華小吃", en: "Jinghua Eatery", cat: "中式", icon: "🥟", color: "#E9C46A", addr: ["新光路一段 13 號", "No. 13, Xinguang Rd Sec. 1"], hours: "11:00–20:00",
    deals: { solo: ["炒麵疙瘩 送例湯", "Free soup with fried dough noodles"], duo: ["雙人小菜拼盤 9 折", "10% off side platter for two"], group: ["3 人以上 滿 $500 送小菜", "Free side for 3+ over $500"] } },
  { id: "apo", zh: "阿婆排骨飯", en: "Apo Pork Chop Rice", cat: "中式", icon: "🍱", color: "#D4A373", addr: ["萬壽路 12 號", "No. 12, Wanshou Rd"], hours: "11:15–20:00",
    deals: { solo: ["排骨飯 加購滷蛋 $5", "Braised egg add-on $5"], duo: ["雙人便當 折 $20", "$20 off two bento"], group: ["5 個以上便當 95 折", "5% off 5+ bento"] } },
  { id: "shousiyi", zh: "首思義", en: "Shousiyi Noodles", cat: "中式", icon: "🍜", color: "#BDE0FE", addr: ["政大公車站旁", "Next to NCCU bus stop"], hours: "11:00–20:00",
    deals: { solo: ["意麵 加大不加價", "Free large noodles"], duo: ["兩碗麵送一盤滷味", "Free braised snacks with two bowls"], group: ["多人滷味拼盤 85 折", "15% off group braised platter"] } },
  { id: "hulu", zh: "呼嚕小酒館", en: "Hulu Bistro", cat: "西式", icon: "🍷", color: "#CDB4DB", addr: ["指南路二段 106 號", "No. 106, Zhinan Rd Sec. 2"], hours: "14:00–24:00",
    deals: { solo: ["下午茶套餐 折 $40", "$40 off afternoon tea set"], duo: ["雙人下午茶 9 折", "10% off tea for two"], group: ["分享餐 滿 $1200 送甜點", "Free dessert over $1,200"] } },
  { id: "bangkok", zh: "小曼谷 泰式料理", en: "Little Bangkok Thai", cat: "異國", icon: "🌶️", color: "#90BE6D", addr: ["政大商圈", "Near NCCU"], hours: "11:30–21:00",
    deals: { solo: ["打拋豬飯 送泰式奶茶", "Free Thai tea with basil pork rice"], duo: ["雙人套餐 折 $50", "$50 off set for two"], group: ["合菜 3 道以上送月亮蝦餅", "Free shrimp cake with 3+ dishes"] } },
  { id: "arirang", zh: "阿里郎韓國小吃", en: "Arirang Korean", cat: "異國", icon: "🍲", color: "#F28482", addr: ["政大商圈", "Near NCCU"], hours: "11:00–21:00",
    deals: { solo: ["石鍋拌飯 送小菜", "Free side with bibimbap"], duo: ["部隊鍋雙人份 9 折", "10% off army stew for two"], group: ["4 人以上部隊鍋加料免費", "Free stew toppings for 4+"] } },
  { id: "mcd", zh: "麥當勞 政大店", en: "McDonald's NCCU", cat: "西式", img: "assets/mcd.png", color: "#FFE08A", addr: ["指南路二段", "Zhinan Rd Sec. 2"], hours: "24h",
    deals: { solo: ["超值套餐 升級中薯", "Free medium fries upgrade"], duo: ["雙人分享盒 折 $30", "$30 off sharing box"], group: ["分享餐 加贈雞塊", "Free nuggets with sharing meal"] } },
  { id: "8way", zh: "八方雲集", en: "Bafang Dumpling", cat: "中式", img: "assets/8way.png", color: "#FFD166", addr: ["政大商圈", "Near NCCU"], hours: "10:00–21:00",
    deals: { solo: ["鍋貼 10 顆送豆漿", "Free soy milk with 10 potstickers"], duo: ["雙人水餃組 折 $20", "$20 off dumplings for two"], group: ["滿 $500 送酸辣湯", "Free hot & sour soup over $500"] } },
];
const L = (pair) => (LANG === "en" ? pair[1] : pair[0]);
const nm = (s) => (LANG === "en" ? s.en : s.zh);
const CAT_EN = { 中式: "Chinese", 西式: "Western", 早午餐: "Brunch", 異國: "International" };
const catL = (c) => (LANG === "en" ? CAT_EN[c] : c);
const iconHTML = (s) => (s.img ? `<img src="${s.img}" alt="" loading="lazy">` : s.icon);
const findShop = (id) => SHOPS.find((s) => s.id === id);
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* =========================================================
   Layout: header + footer
   ========================================================= */
function renderChrome() {
  const links = [["index.html#wheel", "nav.home", "home"], ["why.html", "nav.why", "why"], ["bell.html", "nav.bell", "bell"], ["shops.html", "nav.shops", "shops"], ["about.html", "nav.about", "about"]];
  $("#hdr").innerHTML = `
  <header class="nav" id="nav">
    <a href="index.html" class="brand"><span class="dots"><i></i><i></i></span>${LANG === "en" ? "Break the 16" : "破局十六週"}</a>
    <nav class="links" id="links">${links.map(([h, k, p]) => `<a href="${h}" class="${PAGE === p ? "on" : ""}">${t(k)}</a>`).join("")}</nav>
    <button class="lang" id="langBtn" aria-label="Language"><span class="${LANG === "zh" ? "on" : ""}">中</span><span class="${LANG === "en" ? "on" : ""}">EN</span></button>
    <a class="btn btn-ink btn-sm nav-cta" href="index.html#wheel">${t("nav.cta")}</a>
    <button class="burger" id="burger" aria-label="${t("nav.menu")}"><span></span><span></span></button>
  </header>`;
  $("#ftr").innerHTML = `
  <footer class="foot">
    <div class="foot-grid">
      <div><a href="index.html" class="brand big"><span class="dots"><i></i><i></i></span>${LANG === "en" ? "Break the 16" : "破局十六週"}</a><p class="foot-tag">${t("foot.tag")}</p></div>
      <div><small>${t("foot.links")}</small>${links.map(([h, k]) => `<a href="${h}">${t(k)}</a>`).join("")}</div>
      <div><small>${t("foot.contact")}</small><span>${LANG === "en" ? "Hsiao Chih-Hung" : "蕭志紘"}</span><a href="tel:0905116999">0905-116-999</a></div>
    </div>
    <p class="foot-copy">${t("foot.copy")}</p>
  </footer>`;
  $("#burger").onclick = () => { $("#links").classList.toggle("open"); $("#burger").classList.toggle("x"); };
  $("#langBtn").onclick = () => setLang(LANG === "zh" ? "en" : "zh");
}

function applyStatic() {
  document.documentElement.lang = LANG === "en" ? "en" : "zh-Hant";
  $$("[data-i18n],[data-i18n-html]").forEach((el) => {
    const k = el.dataset.i18n || el.dataset.i18nHtml;
    if (el.dataset.zh === undefined) el.dataset.zh = el.innerHTML;
    el.innerHTML = LANG === "en" && EN[k] ? EN[k] : el.dataset.zh;
  });
  $$("[data-i18n-ph]").forEach((el) => {
    if (el.dataset.zhph === undefined) el.dataset.zhph = el.placeholder;
    el.placeholder = LANG === "en" ? EN[el.dataset.i18nPh] || el.dataset.zhph : el.dataset.zhph;
  });
}
const langHooks = [];
function setLang(l) {
  LANG = l; try { localStorage.setItem("lang", l); } catch {}
  document.body.classList.add("lang-swap");
  setTimeout(() => { renderChrome(); applyStatic(); langHooks.forEach((f) => f()); document.body.classList.remove("lang-swap"); }, 180);
}

/* =========================================================
   Shared interactions
   ========================================================= */
let toastT;
function toast(msg) {
  const el = $("#toast"); el.textContent = msg; el.classList.add("on");
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("on"), 2600);
}
document.addEventListener("pointerdown", (e) => {
  const b = e.target.closest(".btn,.chip,.seg-btn,.step,.pick,.wheel-hub,.lang,.next");
  if (!b) return;
  const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height), s = document.createElement("span");
  s.className = "ripple";
  Object.assign(s.style, { width: d + "px", height: d + "px", left: e.clientX - r.left - d / 2 + "px", top: e.clientY - r.top - d / 2 + "px" });
  if (getComputedStyle(b).position === "static") b.style.position = "relative";
  b.style.overflow = "hidden"; b.appendChild(s); setTimeout(() => s.remove(), 650);
});
document.addEventListener("click", (e) => {
  const g = e.target.closest("[data-go]");
  if (g) { $(g.dataset.go)?.scrollIntoView({ behavior: "smooth" }); }
  if (e.target.closest("#links a")) { $("#links").classList.remove("open"); $("#burger").classList.remove("x"); }
});
let lastY = 0;
addEventListener("scroll", () => {
  const y = scrollY, nav = $("#nav"); if (!nav) return;
  nav.classList.toggle("scrolled", y > 20);
  nav.classList.toggle("hide", y > lastY && y > 400 && !$("#links").classList.contains("open"));
  lastY = y;
}, { passive: true });
const rev = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in"); rev.unobserve(e.target);
  $$("[data-count]", e.target).forEach(countUp);
}), { threshold: 0.1 });
function countUp(el) {
  const end = +el.dataset.count, t0 = performance.now();
  const f = (now) => { const p = Math.min(1, (now - t0) / 1400); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); };
  requestAnimationFrame(f);
}
addEventListener("pointermove", (e) => {
  document.documentElement.style.setProperty("--ex", (e.clientX / innerWidth - 0.5) * 8 + "px");
  document.documentElement.style.setProperty("--ey", (e.clientY / innerHeight - 0.5) * 8 + "px");
}, { passive: true });
function confetti(origin) {
  const colors = ["#111", "#FFE45C", "#E76F51", "#90BE6D", "#A8DADC"];
  const r = origin.getBoundingClientRect();
  for (let i = 0; i < 60; i++) {
    const p = document.createElement("i"); p.className = "confetti"; p.style.background = colors[i % 5];
    p.style.left = r.left + r.width / 2 + "px"; p.style.top = r.top + r.height / 2 + "px";
    document.body.appendChild(p);
    const a = Math.random() * Math.PI * 2, d = 120 + Math.random() * 260;
    p.animate([{ transform: "translate(0,0)", opacity: 1 }, { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d + 200}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }],
      { duration: 1200 + Math.random() * 600, easing: "cubic-bezier(.2,.8,.3,1)" }).onfinish = () => p.remove();
  }
}
const track = (data) => fetch("api/track", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });

/* =========================================================
   Home: wheel + coupon
   ========================================================= */
function initHome() {
  const mq = $("#marquee");
  const fillMq = () => { const row = SHOPS.map((s) => `<span>${nm(s)}</span><span>●</span>`).join(""); mq.innerHTML = row + row; };
  fillMq(); langHooks.push(fillMq);

  let mode = "solo", rot = 0, spinning = false, pool = [], current = null, code = "";
  const svg = $("#wheelSvg"), PAL = ["#111", "#FFF4A3", "#2b2b2b", "#FFE45C"];
  function buildWheel() {
    const seed = { solo: 1, duo: 2, group: 3 }[mode];
    pool = SHOPS.slice().sort((a, b) => ((a.id.charCodeAt(0) * seed) % 7) - ((b.id.charCodeAt(0) * seed) % 7) || a.id.localeCompare(b.id)).slice(0, 8);
    const n = pool.length, a = (2 * Math.PI) / n, R = 100;
    let h = "";
    pool.forEach((s, i) => {
      const a0 = i * a - Math.PI / 2 - a / 2, a1 = a0 + a, mid = a0 + a / 2, deg = (mid * 180) / Math.PI;
      const tx = 60 * Math.cos(mid), ty = 60 * Math.sin(mid), ix = 88 * Math.cos(mid), iy = 88 * Math.sin(mid);
      const label = (LANG === "en" ? s.en.replace(/ \(NCCU\)| NCCU/, "").split(" ").slice(0, 2).join(" ") : s.zh.split(" ")[0]).slice(0, LANG === "en" ? 12 : 6);
      h += `<path d="M0 0 L${R * Math.cos(a0)} ${R * Math.sin(a0)} A${R} ${R} 0 0 1 ${R * Math.cos(a1)} ${R * Math.sin(a1)} Z" fill="${PAL[i % 4]}" stroke="#111"/>`;
      h += `<text x="${tx}" y="${ty}" fill="${i % 2 ? "#111" : "#FFF4A3"}" font-size="${LANG === "en" ? 7 : 8.5}" font-weight="900" text-anchor="middle" dominant-baseline="middle" transform="rotate(${deg + 90} ${tx} ${ty})">${esc(label)}</text>`;
      h += s.img ? `<image href="${s.img}" x="${ix - 6}" y="${iy - 6}" width="12" height="12" transform="rotate(${deg + 90} ${ix} ${iy})"/>`
                 : `<text x="${ix}" y="${iy}" font-size="10" text-anchor="middle" dominant-baseline="middle" transform="rotate(${deg + 90} ${ix} ${iy})">${s.icon}</text>`;
    });
    h += `<circle r="${R}" fill="none" stroke="#111" stroke-width="4"/>`;
    for (let i = 0; i < n; i++) { const q = i * a - Math.PI / 2 - a / 2; h += `<circle cx="${96 * Math.cos(q)}" cy="${96 * Math.sin(q)}" r="2.2" fill="#FFF4A3" stroke="#111" stroke-width=".8"/>`; }
    svg.innerHTML = h;
    $("#modeDesc").textContent = t(`mode.${mode}.d`);
  }
  $$(".seg-btn").forEach((b, i) => b.addEventListener("click", () => {
    if (spinning) return;
    mode = b.dataset.mode;
    $$(".seg-btn").forEach((x) => x.classList.toggle("active", x === b));
    $(".seg-pill").style.transform = `translateX(${i * 100}%)`;
    svg.style.transition = "transform .6s cubic-bezier(.34,1.56,.64,1)"; rot += 45; svg.style.transform = `rotate(${rot}deg)`;
    setTimeout(() => { svg.style.transition = ""; buildWheel(); }, 300);
  }));
  function spin() {
    if (spinning) return;
    spinning = true; $(".wheel-stage").classList.add("spinning"); $("#spinBtn").textContent = t("spinning");
    const n = pool.length, idx = Math.floor(Math.random() * n), seg = 360 / n;
    rot = rot - (rot % 360) + 360 * 6 + (360 - idx * seg) + (Math.random() - 0.5) * seg * 0.6;
    svg.style.transform = `rotate(${rot}deg)`;
    let k = 0; const tk = setInterval(() => { const p = $(".pointer"); p.classList.remove("tick"); void p.offsetWidth; p.classList.add("tick"); if (++k > 26) clearInterval(tk); }, 160);
    setTimeout(() => {
      spinning = false; $(".wheel-stage").classList.remove("spinning"); applyStatic();
      current = pool[idx]; code = "NCCU-" + Math.random().toString(36).slice(2, 7).toUpperCase();
      showCoupon(true); confetti($(".wheel-stage"));
      track({ type: "coupon_issue", shop: current.id, mode, code }).catch(() => {});
    }, 4700);
  }
  function showCoupon(fresh) {
    if (!current) return;
    const s = current, c = $("#coupon");
    $("#cIcon").innerHTML = iconHTML(s); $("#cIcon").style.background = s.color;
    $("#cMode").textContent = t("mode." + mode); $("#cShop").textContent = nm(s);
    $("#cAddr").textContent = `${L(s.addr)}・${t("hours")} ${s.hours}`;
    $("#cOffer").textContent = L(s.deals[mode]);
    $("#cRules").innerHTML = [t("min." + mode), t("ppl." + mode), t("r.hours"), t("r.nostack"), t("r.exp")].map((r) => `<li>${r}</li>`).join("");
    $("#cCode").textContent = code;
    if (!fresh) return;
    $("#qr").innerHTML = Array.from({ length: 169 }, (_, i) => {
      const x = i % 13, y = (i / 13) | 0, f = (x < 3 && y < 3) || (x > 9 && y < 3) || (x < 3 && y > 9);
      return `<i class="${f || Math.random() > 0.5 ? "" : "o"}"></i>`;
    }).join("");
    $("#stamp").classList.remove("on"); $("#transit").hidden = true; $("#redeemBtn").disabled = false;
    c.hidden = false; c.style.animation = "none"; void c.offsetWidth; c.style.animation = "";
    setTimeout(() => c.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
  }
  $("#spinBtn").addEventListener("click", spin);
  $("#hubBtn").addEventListener("click", spin);
  $("#redeemBtn").addEventListener("click", (e) => {
    $("#stamp").classList.add("on"); e.currentTarget.textContent = t("redeemDone"); e.currentTarget.disabled = true;
    toast(t("redeemed")); track({ type: "coupon_redeem", shop: current.id, mode, code }).catch(() => {});
  });
  $("#mapBtn").addEventListener("click", () => { $("#transit").hidden = !$("#transit").hidden; });
  $("#againBtn").addEventListener("click", () => { $("#wheel").scrollIntoView({ behavior: "smooth" }); setTimeout(spin, 600); });
  langHooks.push(() => { buildWheel(); showCoupon(false); if ($("#redeemBtn").disabled) $("#redeemBtn").textContent = t("redeemDone"); });
  buildWheel();
}

/* =========================================================
   Shops page
   ========================================================= */
function initShops() {
  let f = "all";
  const render = () => {
    $("#shopGrid").innerHTML = SHOPS.filter((s) => f === "all" || s.cat === f).map((s, i) => `
      <button class="shop" style="animation-delay:${i * 0.05}s" data-id="${s.id}">
        <div class="shop-head"><div class="shop-icon" style="background:${s.color}">${iconHTML(s)}</div>
        <div><h4>${esc(nm(s))}</h4><p class="meta">${L(s.addr)}</p></div></div>
        <span class="cat">${catL(s.cat)}</span>
        <p class="meta">${t("hours")} ${s.hours}</p>
        <div class="deal">${L(s.deals.solo)}</div>
      </button>`).join("");
  };
  $("#filter").addEventListener("click", (e) => {
    const c = e.target.closest(".chip"); if (!c) return;
    f = c.dataset.f; $$("#filter .chip").forEach((x) => x.classList.toggle("active", x === c)); render();
  });
  const dlg = $("#shopModal");
  $("#shopGrid").addEventListener("click", (e) => {
    const card = e.target.closest(".shop"); if (!card) return;
    const s = findShop(card.dataset.id);
    $("#modalBody").innerHTML = `
      <div class="shop-head"><div class="shop-icon" style="background:${s.color}">${iconHTML(s)}</div><div><h3>${esc(nm(s))}</h3><p class="meta">${L(s.addr)}・${t("hours")} ${s.hours}</p></div></div>
      <p class="modal-k">${t("deals")}</p>
      ${["solo", "duo", "group"].map((m) => `<div class="modal-deal"><span class="tag">${t("mode." + m)}</span><b>${L(s.deals[m])}</b><small>${t("min." + m)}</small></div>`).join("")}
      <a class="btn btn-ink" href="index.html#wheel" style="margin-top:18px;width:100%">${t("goWheel")}</a>`;
    dlg.showModal();
  });
  $("#modalX").onclick = () => dlg.close();
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  langHooks.push(render); render();
}

/* =========================================================
   Bell page — real sign-ups stored on the server
   ========================================================= */
function initBell() {
  const d = new Date(); d.setDate(d.getDate() + 1);
  $("#bDate").value = d.toISOString().slice(0, 10); $("#bDate").min = new Date().toISOString().slice(0, 10);
  $$(".chips").forEach((g) => g.addEventListener("click", (e) => {
    const c = e.target.closest(".chip"); if (!c) return;
    if (g.classList.contains("multi")) {
      const all = g.firstElementChild;
      if (c === all) $$(".chip", g).forEach((x) => x.classList.toggle("active", x === all));
      else { c.classList.toggle("active"); all.classList.toggle("active", !$$(".chip.active", g).filter((x) => x !== all).length); if (c.classList.contains("active")) all.classList.remove("active"); }
    } else $$(".chip", g).forEach((x) => x.classList.toggle("active", x === c));
  }));
  const budget = $("#budget");
  const upd = () => { $("#budgetVal").textContent = "$" + budget.value; budget.style.setProperty("--p", ((budget.value - 100) / 500) * 100 + "%"); };
  budget.addEventListener("input", upd); upd();
  let ppl = 2;
  $$(".step").forEach((b) => b.addEventListener("click", () => {
    const n = ppl + +b.dataset.d;
    if (n < 2) return toast(t("min2")); if (n > 8) return toast(t("max8"));
    ppl = n; const el = $("#ppl"); el.textContent = ppl; el.classList.add("bump"); setTimeout(() => el.classList.remove("bump"), 200);
  }));
  const shake = (el) => { el.focus?.(); (el.closest("label") || el).animate([{ transform: "translateX(0)" }, { transform: "translateX(-8px)" }, { transform: "translateX(8px)" }, { transform: "translateX(0)" }], { duration: 300 }); };

  $("#bellForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nick = $("#bNick").value.trim(), contact = $("#bContact").value.trim(), date = $("#bDate").value;
    if (!nick) { shake($("#bNick")); return toast(t("need.nick")); }
    if (!contact) { shake($("#bContact")); return toast(t("need.contact")); }
    if (!date) { shake($("#bDate")); return toast(t("need.date")); }
    if (!$("#bConsent").checked) { shake($(".consent")); return toast(t("need.consent")); }
    const time = $(".chips[data-name=time] .chip.active").dataset.v;
    const pref = $$(".chips[data-name=pref] .chip.active").map((c) => c.dataset.v);
    const data = { type: "bell", nick, contact, date, who: $("#bWho").value, time, budget: +budget.value, pref, ppl, lang: LANG };
    const btn = $("#ringBtn"), out = $("#bellResult");
    btn.classList.add("ringing"); btn.disabled = true;
    out.innerHTML = `<div class="empty"><div class="big-bell ring">🔔</div><p>${t("bell.sending")}</p></div>`;
    try {
      const [res] = await Promise.all([track(data), new Promise((r) => setTimeout(r, 1200))]);
      if (!res.ok) throw new Error(res.status);
    } catch {
      btn.classList.remove("ringing"); btn.disabled = false;
      out.innerHTML = `<div class="empty"><div class="big-bell">🔕</div><p>${t("bell.fail")}</p></div>`;
      return toast(t("bell.fail"));
    }
    btn.classList.remove("ringing"); btn.disabled = false;
    const catOf = { chinese: "中式", western: "西式", intl: "異國", veg: "早午餐" };
    let fit = SHOPS.filter((s) => pref.includes("any") || pref.some((p) => catOf[p] === s.cat));
    if (!fit.length) fit = SHOPS;
    fit = fit.slice().sort(() => Math.random() - 0.5).slice(0, 4);
    const mode = ppl >= 3 ? "group" : "duo";
    const render = () => {
      out.innerHTML = `<div class="match">
        <span class="tag" style="align-self:flex-start">🔔 ${ppl} ${t("persons")}</span>
        <h3>${t("bell.ok")}</h3>
        <p>${t("bell.okp").replace("{c}", `<b>${esc(contact)}</b>`)}</p>
        <div class="summary"><small>${t("bell.sum")}</small>
          <span>${date.replace(/-/g, "/")}・${t("t." + time)}</span><span>$${budget.value} / ${LANG === "en" ? "person" : "人"}</span><span>${pref.map((p) => t("p." + p)).join("、")}</span></div>
        <p class="modal-k">${t("bell.sug")}</p>
        <div class="pick-shops">${fit.map((s) => `<a class="pick" href="shops.html"><span class="shop-icon" style="background:${s.color}">${iconHTML(s)}</span><span>${esc(nm(s))}<br><small class="muted">${L(s.deals[mode])}</small></span></a>`).join("")}</div>
        <div class="coupon-actions"><a class="btn btn-ink" href="shops.html">${t("bell.more")}</a><button type="button" class="btn btn-ghost" id="againBell">${t("bell.again")}</button></div>
      </div>`;
      $("#againBell").onclick = () => $("#bellForm").scrollIntoView({ behavior: "smooth" });
    };
    render(); langHooks.push(() => { if ($(".match", out)) render(); });
    confetti(out); out.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

/* =========================================================
   About page
   ========================================================= */
function initAbout() {
  $("#copyBtn").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText("0905116999"); toast(t("copied")); } catch { toast("0905-116-999"); }
  });
}

/* =========================================================
   Admin dashboard
   ========================================================= */
function initAdmin() {
  let key = ""; try { key = sessionStorage.getItem("adminKey") || ""; } catch {}
  let data = null;
  async function load() {
    try {
      const r = await fetch("api/admin", { headers: { "x-admin-key": key } });
      if (r.status === 401) { toast(t("a.bad")); logout(); return; }
      if (!r.ok) throw 0;
      data = await r.json();
      try { sessionStorage.setItem("adminKey", key); } catch {}
      $("#loginForm").hidden = true; $("#dash").hidden = false; render();
    } catch { toast(t("a.err")); }
  }
  function logout() { key = ""; try { sessionStorage.removeItem("adminKey"); } catch {} $("#loginForm").hidden = false; $("#dash").hidden = true; }
  const count = (arr, f) => arr.reduce((m, x) => { [].concat(f(x)).forEach((k) => (m[k] = (m[k] || 0) + 1)); return m; }, {});
  function bars(el, obj, label) {
    const entries = Object.entries(obj).sort((a, b) => b[1] - a[1]), max = Math.max(1, ...entries.map((e) => e[1]));
    el.innerHTML = entries.length ? entries.map(([k, v]) => `<div class="bar"><span>${esc(label(k))}</span><i style="--w:${(v / max) * 100}%"></i><b>${v}</b></div>`).join("") : `<p class="muted">${t("a.empty")}</p>`;
  }
  function render() {
    if (!data) return;
    const bells = data.bell || [], issued = data.coupon_issue || [], redeemed = data.coupon_redeem || [];
    const people = bells.reduce((s, b) => s + (+b.ppl || 0), 0);
    const avg = bells.length ? Math.round(bells.reduce((s, b) => s + (+b.budget || 0), 0) / bells.length) : 0;
    const rate = issued.length ? Math.round((redeemed.length / issued.length) * 100) : 0;
    $("#kpis").innerHTML = [[t("a.total"), bells.length], [t("a.people"), people], [t("a.avgBudget"), "$" + avg], [t("a.coupons"), issued.length], [t("a.redeem"), rate + "%"]]
      .map(([k, v]) => `<div class="kpi"><small>${k}</small><b>${v}</b></div>`).join("");
    bars($("#barTime"), count(bells, (b) => b.time), (k) => t("t." + k));
    bars($("#barPref"), count(bells, (b) => b.pref || []), (k) => t("p." + k));
    bars($("#barPpl"), count(bells, (b) => b.ppl), (k) => k + " " + t("persons"));
    bars($("#barWho"), count(bells, (b) => b.who), (k) => t("w." + k));
    bars($("#barShop"), count(issued, (c) => c.shop), (k) => (findShop(k) ? nm(findShop(k)) : k));
    $("#bellTable tbody").innerHTML = bells.length ? bells.sort((a, b) => b.ts - a.ts).map((b) => `<tr>
      <td>${new Date(b.ts).toLocaleString()}</td><td>${esc(b.nick)}</td><td>${esc(b.contact)}</td><td>${t("w." + b.who)}</td><td>${esc(b.date)}</td>
      <td>${t("t." + b.time)}</td><td>$${esc(b.budget)}</td><td>${(b.pref || []).map((p) => t("p." + p)).join("、")}</td><td>${esc(b.ppl)}</td></tr>`).join("")
      : `<tr><td colspan="9" class="muted">${t("a.empty")}</td></tr>`;
    $("#dashUpdated").textContent = `${t("a.updated")} ${new Date().toLocaleTimeString()}`;
  }
  $("#loginForm").addEventListener("submit", (e) => { e.preventDefault(); key = $("#adminKey").value.trim(); if (key) load(); });
  $("#refreshBtn").addEventListener("click", load);
  $("#logoutBtn").addEventListener("click", logout);
  $("#csvBtn").addEventListener("click", () => {
    const rows = [["submitted", "nickname", "contact", "who", "date", "time", "budget", "pref", "people"]]
      .concat((data?.bell || []).map((b) => [new Date(b.ts).toISOString(), b.nick, b.contact, b.who, b.date, b.time, b.budget, (b.pref || []).join("|"), b.ppl]));
    const csv = "﻿" + rows.map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "meal-bell.csv"; a.click();
  });
  langHooks.push(render);
  if (key) load();
}

/* =========================================================
   Boot
   ========================================================= */
renderChrome(); applyStatic();
$$(".reveal").forEach((el) => rev.observe(el));
({ home: initHome, shops: initShops, bell: initBell, about: initAbout, admin: initAdmin })[PAGE]?.();
