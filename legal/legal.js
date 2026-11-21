// Remplit les champs « éditeur » depuis config.js et signale ce qui reste à compléter.
(function(){
  var L = window.LEGAL || {}, missing = 0;
  document.querySelectorAll("[data-l]").forEach(function(el){
    var path = el.getAttribute("data-l").split("."), v = L;
    path.forEach(function(k){ v = v && v[k]; });
    if(v){ el.textContent = v; el.classList.remove("todo"); }
    else { el.textContent = "À COMPLÉTER"; el.classList.add("todo"); missing++; }
  });
  var b = document.getElementById("todo-banner");
  if(b){ b.hidden = missing === 0; }
})();
