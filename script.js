
const menu=document.querySelector('.menu');
const nav=document.querySelector('.nav');
menu.addEventListener('click',()=>nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

document.querySelectorAll('.tab').forEach(button=>{
  button.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(button.dataset.tab).classList.add('active');
  });
});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const lightbox=document.querySelector('.lightbox');
const lightboxImg=lightbox.querySelector('img');
document.querySelectorAll('.case-gallery img,.render-grid img').forEach(img=>{
  img.addEventListener('click',()=>{
    lightboxImg.src=img.src;
    lightboxImg.alt=img.alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
  });
});
lightbox.querySelector('.close').addEventListener('click',()=>{
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden','true');
});
lightbox.addEventListener('click',e=>{
  if(e.target===lightbox) lightbox.querySelector('.close').click();
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape') lightbox.querySelector('.close').click();
});
document.getElementById('year').textContent=new Date().getFullYear();
