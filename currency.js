// Sélecteur de monnaie Ariary / Euro / Dollar, affiché à côté du nom de chaque pack.
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
            el.textContent = CURR[c].label;
        });
        document.querySelectorAll(".curr-opt").forEach(function (opt) {
            opt.classList.toggle("active", opt.getAttribute("data-curr") === c);
        });
    }

    function injectStyle() {
        var style = document.createElement("style");
        style.textContent =
            ".curr-select-row{display:flex;align-items:center;justify-content:center;gap:16px 10px;flex-wrap:wrap;margin-bottom:20px}" +
            ".curr-select-label{font-size:0.8rem;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;color:#64748b}" +
            ".curr-widget{position:relative;display:inline-flex}" +
            ".curr-trigger{display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:40px;background:#ffffff;" +
            "border:1.5px solid #1A3C6E;font:inherit;font-weight:700;font-size:0.9rem;color:#1A3C6E;cursor:pointer;transition:0.2s}" +
            ".curr-trigger:hover{background:#1A3C6E;color:#ffffff}" +
            ".curr-trigger .curr-chev{font-size:0.7rem}" +
            ".curr-menu{display:none;position:absolute;top:calc(100% + 8px);left:50%;transform:translateX(-50%);min-width:170px;" +
            "background:#fff;border:1px solid #e2e8f0;border-radius:16px;box-shadow:0 8px 20px rgba(0,0,0,0.1);padding:6px;" +
            "z-index:50;text-align:left}" +
            ".curr-menu.open{display:block}" +
            ".curr-opt{display:flex;align-items:center;width:100%;padding:9px 14px;border-radius:10px;border:none;background:none;" +
            "text-align:left;font:inherit;font-weight:600;font-size:0.92rem;color:#1e293b;cursor:pointer}" +
            ".curr-opt:hover{background:#f8fafc;color:#1A3C6E}" +
            ".curr-opt.active{background:rgba(26,60,110,0.08);color:#1A3C6E}";
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
    }

    var outsideClickBound = false;
    function bindOutsideClick() {
        if (outsideClickBound) return;
        outsideClickBound = true;
        document.addEventListener("click", function () {
            document.querySelectorAll(".curr-menu.open").forEach(function (m) { m.classList.remove("open"); });
        });
    }

    // Exposé pour les pages qui reconstruisent leur prix (et leur point de montage)
    // dynamiquement en JS (ex. offres.html) : mount() pour reconstruire le widget après
    // un innerHTML, apply() pour ré-appliquer la monnaie courante après chaque rendu.
    window.SuiteEcoleCurrency = { get: getCurrency, apply: apply, mount: mountSwitch };

    document.addEventListener("DOMContentLoaded", function () {
        injectStyle();
        mountSwitch();
        bindOutsideClick();
        apply(getCurrency());
    });
})();
