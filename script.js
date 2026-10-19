const TEL = "5493512512525";
const wa = (msg) => `https://wa.me/${TEL}?text=${encodeURIComponent(msg)}`;

// Configurador de etiquetas
const stockConfig = {
  stock:    { label: "En stock",       class: "stock" },
  limitado: { label: "Stock limitado", class: "limitado" },
  encargo:  { label: "Por encargo",    class: "encargo" }
};

// Lista de piezas con sus estados asignados
const piezas = [
  {n:"Anillo Labra",       t:"anillo",    p:37000, stock:"limitado", f:["labra-1","labra-2","labra-3"]},
  {n:"Collar Pliegue",     t:"collar",    p:35000, stock:"encargo",  f:["pliegue-1","pliegue-2","pliegue-3","pliegue-4"]},
  {n:"Collar Ágata",       t:"collar",    p:44000, stock:"limitado", f:["agata-1","agata-2"]},
  {n:"Anillo Calcedonia",  t:"anillo",    p:40000, stock:"limitado", f:["calcedonia-1","calcedonia-2","calcedonia-3"]},
  {n:"Collar Antonia",     t:"collar",    p:25000, stock:"encargo",  f:["antonia-1"]},
  {n:"Collar Hera",        t:"collar",    p:30000, stock:"encargo",  f:["hera-collar-1","hera-collar-2"]},
  {n:"Brazalete Hera",     t:"brazalete", p:28000, stock:"encargo",  f:["hera-brazalete-1","hera-brazalete-2","hera-collar-2"]},
  {n:"Aros Tina",          t:"aros",      p:25000, stock:"encargo",  f:["tina-aros-1","tina-set"]},
  {n:"Brazalete Tina",     t:"brazalete", p:30000, stock:"encargo",  f:["tina-brazalete-1","tina-brazalete-2","tina-set","tina-brazalete-4"]},
  {n:"Collar Luna",        t:"collar",    p:46000, stock:"encargo",  f:["luna-1","luna-2","luna-3","luna-4"]},
  {n:"Anillo Numa",        t:"anillo",    p:20000, stock:"encargo",  f:["numa-1","numa-2"]},
];

const fmt = (v) => "$" + v.toLocaleString("es-AR");
const waIcon = document.querySelector("#wa-pedido svg").outerHTML;
const chev = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const grid = document.getElementById("grid");

piezas.forEach((x, i) => {
  const el = document.createElement("article");
  el.className = "pieza";
  el.dataset.t = x.t;
  const many = x.f.length > 1;
  const badge = stockConfig[x.stock] || stockConfig.stock;

  el.innerHTML = `
    <div class="foto">
      <span class="badge-stock ${badge.class}">${badge.label}</span>
      <div class="slides" tabindex="0" aria-label="Fotos de ${x.n}">
        ${x.f.map((s, k) => `<img src="img/${s}.webp" alt="${x.n}, foto ${k+1}" width="840" height="1050" loading="${i < 3 ? "eager" : "lazy"}">`).join("")}
      </div>
      ${many ? `
        <button class="arrow prev" type="button" aria-label="Foto anterior">${chev("M15 6l-6 6 6 6")}</button>
        <button class="arrow next" type="button" aria-label="Foto siguiente">${chev("M9 6l6 6-6 6")}</button>
        <div class="dots">${x.f.map((_, k) => `<button type="button" aria-label="Ver foto ${k+1}" ${k===0?'aria-current="true"':""}></button>`).join("")}</div>` : ""}
    </div>
    <div class="info">
      <h3><span class="tipo">${x.t}</span>${x.n}</h3>
      <span class="precio">${fmt(x.p)}</span>
    </div>
    <a class="wa" href="${wa(`¡Hola Fran! ¿Tenés stock de ${x.n}? 💛`)}" target="_blank" rel="noopener">${waIcon}consultar stock</a>`;
  grid.appendChild(el);

  if (many) {
    const track = el.querySelector(".slides");
    const dots = [...el.querySelectorAll(".dots button")];
    const go = (k) => track.scrollTo({left: k * track.clientWidth, behavior: "smooth"});
    const cur = () => Math.round(track.scrollLeft / track.clientWidth);
    dots.forEach((d, k) => d.addEventListener("click", () => go(k)));
    el.querySelector(".prev").addEventListener("click", () => go((cur() - 1 + x.f.length) % x.f.length));
    el.querySelector(".next").addEventListener("click", () => go((cur() + 1) % x.f.length));
    track.addEventListener("scroll", () => {
      const k = cur();
      dots.forEach((d, j) => j === k ? d.setAttribute("aria-current","true") : d.removeAttribute("aria-current"));
    }, {passive: true});
  }
});

document.getElementById("wa-pedido").href = wa("¡Hola Fran! Quiero consultar por una pieza a medida 💛");

const chips = [...document.querySelectorAll(".chip")];
chips.forEach(c => c.addEventListener("click", () => {
  chips.forEach(o => o.setAttribute("aria-pressed", String(o === c)));
  const f = c.dataset.f;
  document.querySelectorAll(".pieza").forEach(p => { p.hidden = !(f === "todo" || p.dataset.t === f); });
}));

const wf = document.getElementById("wa-footer");
wf.href = wa("¡Hola Fran! 💛");
wf.insertAdjacentHTML("afterbegin", waIcon);