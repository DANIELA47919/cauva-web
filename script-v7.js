// Navegación por escenas: se conserva el desplazamiento nativo y accesible.
const sceneLinks=[...document.querySelectorAll('.scene-link')];
const sceneSections=sceneLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
const sceneObserver=new IntersectionObserver(entries=>{
  const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
  if(!visible.length)return;
  const id=visible[0].target.id;
  sceneLinks.forEach(a=>{const active=a.getAttribute('href')==='#'+id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
},{rootMargin:'-20% 0px -45% 0px',threshold:[0,.15,.4,.7]});
sceneSections.forEach(s=>sceneObserver.observe(s));
