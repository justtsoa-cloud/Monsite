// Sélecteur de monnaie Ariary / Euro / Dollar, dans la barre de menu, partagé par toutes les pages de prix.
// Persisté en localStorage pour rester cohérent quand on navigue entre les pages.
(function () {
    var KEY = "suiteecole_currency";
    var CURR = {
        Ar: { label: "Ar", name: "Ariary (Ar)", attr: "data-ar" },
        EUR: { label: "€", name: "Euro (€)", attr: "data-eur" },
        USD: { label: "$", name: "Dollar ($)", attr: "data-usd" }
    };

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
        document.querySelectorAll(".curr-trigger-label").forEach(function (el) {
            el.textContent = "💱 " + CURR[c].label;
        });
        document.querySelectorAll(".curr-opt").forEach(function (opt) {
            opt.classList.toggle("active", opt.getAttribute("data-curr") === c);
        });
    }

    function injectStyle() {
        var style = document.createElement("style");
        style.textContent =
            ".curr-widget{position:relative;display:inline-flex}" +
            ".curr-trigger{display:flex;align-items:center;gap:6px;padding:9px 14px;border-radius:12px;background:#ffffff;" +
            "border:1.5px solid #e2e8f0;box-shadow:0 3px 0 #e2e8f0;font:inherit;font-weight:700;font-size:0.95rem;color:#1A3C6E;" +
            "cursor:pointer;transition:transform .1s ease, box-shadow .1s ease, background .15s ease, border-color .15s ease}" +
            ".curr-trigger:hover{border-color:rgba(26,60,110,0.35);background:rgba(26,60,110,0.04)}" +
            ".curr-trigger:active{transform:translateY(3px);box-shadow:0 0 0 #e2e8f0}" +
            ".curr-trigger .curr-chev{font-size:0.7rem;color:#94a3b8}" +
            ".curr-menu{display:none;position:absolute;top:calc(100% + 10px);right:0;min-width:170px;background:#fff;" +
            "border:1px solid #e2e8f0;border-radius:16px;box-shadow:0 8px 20px rgba(0,0,0,0.1);padding:6px;z-index:1100}" +
            ".curr-menu.open{display:block}" +
            ".curr-opt{display:flex;align-items:center;width:100%;padding:9px 14px;border-radius:10px;border:none;background:none;" +
            "text-align:left;font:inherit;font-weight:600;font-size:0.92rem;color:#1e293b;cursor:pointer}" +
            ".curr-opt:hover{background:#f8fafc;color:#1A3C6E}" +
            ".curr-opt.active{background:rgba(26,60,110,0.08);color:#1A3C6E}" +
            "@media (max-width:1024px){.curr-menu{position:static;margin-top:8px;box-shadow:none;width:100%}" +
            ".curr-widget{width:100%;flex-direction:column}.curr-trigger{width:100%;justify-content:center}}";
        document.head.appendChild(style);
    }

    function mountSwitch() {
        var mounts = document.querySelectorAll("[data-currency-mount]");
        mounts.forEach(function (mount) {
            var widget = document.createElement("div");
            widget.className = "curr-widget";

            var trigger = document.createElement("button");
            trigger.type = "button";
            trigger.className = "curr-trigger";
            trigger.innerHTML = '<span class="curr-trigger-label"></span><span class="curr-chev">▾</span>';

            var menu = document.createElement("div");
            menu.className = "curr-menu";
            Object.keys(CURR).forEach(function (c) {
                var opt = document.createElement("button");
                opt.type = "button";
                opt.className = "curr-opt";
                opt.setAttribute("data-curr", c);
                opt.textContent = CURR[c].name;
                opt.addEventListener("click", function (e) {
                    e.stopPropagation();
                    setCurrency(c);
                    menu.classList.remove("open");
                });
                menu.appendChild(opt);
            });

            trigger.addEventListener("click", function (e) {
                e.stopPropagation();
                document.querySelectorAll(".curr-menu.open").forEach(function (m) {
                    if (m !== menu) m.classList.remove("open");
                });
                menu.classList.toggle("open");
            });

            widget.appendChild(trigger);
            widget.appendChild(menu);
            mount.appendChild(widget);
        });

        document.addEventListener("click", function () {
            document.querySelectorAll(".curr-menu.open").forEach(function (m) { m.classList.remove("open"); });
        });
    }

    // Exposé pour les pages qui reconstruisent leur prix dynamiquement en JS
    // (ex. offres.html) et doivent ré-appliquer la monnaie après chaque rendu.
    window.SuiteEcoleCurrency = { get: getCurrency, apply: apply };

    document.addEventListener("DOMContentLoaded", function () {
        injectStyle();
        mountSwitch();
        apply(getCurrency());
    });
})();
