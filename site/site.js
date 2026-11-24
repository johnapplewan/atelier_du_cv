/* Atelier Candidature : comportements communs de la landing, de la page tarifs et des maquettes SaaS.
   Amélioration progressive : sans JavaScript, tout le contenu reste lisible. */
(function(){
  var nav = document.querySelector(".nav"), btn = document.querySelector(".menu-btn");
  if(nav && btn){
    btn.addEventListener("click", function(){ var o = nav.classList.toggle("open"); btn.setAttribute("aria-expanded", o ? "true" : "false"); });
    nav.querySelectorAll(".nav-links a").forEach(function(a){ a.addEventListener("click", function(){ nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }); });
  }
  // Onglets « Pour qui » : tous les volets restent visibles sans JavaScript.
  var box = document.querySelector("[data-tabs]");
  if(box){
    box.classList.remove("noscript-panes");
    var tabs = [].slice.call(box.querySelectorAll("[role=tab]")), panes = [].slice.call(box.querySelectorAll(".pane"));
    var show = function(id, focus){
      tabs.forEach(function(t){ var on = t.getAttribute("aria-controls") === id; t.setAttribute("aria-selected", on ? "true" : "false"); t.tabIndex = on ? 0 : -1; if(on && focus) t.focus(); });
      panes.forEach(function(p){ var on = p.id === id; p.classList.toggle("on", on); p.hidden = !on; });
    };
    tabs.forEach(function(t, i){
      t.addEventListener("click", function(){ show(t.getAttribute("aria-controls")); history.replaceState(null, "", "#" + t.getAttribute("aria-controls")); });
      t.addEventListener("keydown", function(e){
        var n = e.key === "ArrowRight" ? (i + 1) % tabs.length : e.key === "ArrowLeft" ? (i - 1 + tabs.length) % tabs.length : -1;
        if(n >= 0){ e.preventDefault(); show(tabs[n].getAttribute("aria-controls"), true); }
      });
    });
    var h = location.hash.replace("#", ""), first = panes.some(function(p){ return p.id === h; }) ? h : panes[0].id;
    show(first);
  }
})();
