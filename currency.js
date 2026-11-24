// Sélecteur de monnaie Ariary / Euro / Dollar, partagé par toutes les pages de prix.
// Persisté en localStorage pour rester cohérent quand on navigue entre les pages.
(function () {
    var KEY = "suiteecole_currency";
    var CURR = { Ar: { label: "Ar", attr: "data-ar" }, EUR: { label: "€", attr: "data-eur" }, USD: { label: "$", attr: "data-usd" } };

    function getCurrency() {
        try {
            var v = localStorage.getItem(KEY);
            return CURR[v] ? v : "Ar";
        } catch (e) {
            return "Ar";
        }
    }

    function setCurrency(c) {
        try { localStorage.setItem(KEY, c); } catch (e) {}
        apply(c);
    }

    function apply(c) {
        var attr = CURR[c].attr;
        document.querySelectorAll("[data-ar]").forEach(function (el) {
            var val = el.getAttribute(attr) || el.getAttribute("data-ar");
            el.textContent = val;
        });
        document.querySelectorAll(".eur-usd-hide").forEach(function (el) {
            el.style.display = (c === "Ar") ? "" : "none";
        });
        if (c !== "Ar") {
            document.querySelectorAll('input[name="formule"]').forEach(function (r, i) {
                if (i === 0) r.checked = true;
            });
        }
        document.querySelectorAll(".curr-btn").forEach(function (btn) {
            btn.classList.toggle("active", btn.getAttribute("data-curr") === c);
        });
    }

    function injectStyle() {
        var style = document.createElement("style");
        style.textContent =
            ".currency-switch{display:flex;justify-content:center;gap:8px;margin-bottom:18px;flex-wrap:wrap}" +
            ".curr-btn{font-size:0.85rem;font-weight:700;padding:8px 18px;border-radius:999px;background:white;" +
            "border:1.5px solid #e2e8f0;color:#64748b;cursor:pointer;transition:0.2s}" +
            ".curr-btn:hover{border-color:#1A3C6E;color:#1A3C6E}" +
            ".curr-btn.active{background:#1A3C6E;border-color:#1A3C6E;color:white}";
        document.head.appendChild(style);
    }

    function mountSwitch() {
        var mounts = document.querySelectorAll("[data-currency-mount]");
        mounts.forEach(function (mount) {
            var bar = document.createElement("div");
            bar.className = "currency-switch";
            Object.keys(CURR).forEach(function (c) {
                var btn = document.createElement("button");
                btn.type = "button";
                btn.className = "curr-btn";
                btn.setAttribute("data-curr", c);
                btn.textContent = CURR[c].label;
                btn.addEventListener("click", function () { setCurrency(c); });
                bar.appendChild(btn);
            });
            mount.appendChild(bar);
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        injectStyle();
        mountSwitch();
        apply(getCurrency());
    });
})();
