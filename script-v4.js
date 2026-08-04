
const menuButton=document.querySelector('.menu-button');
const nav=document.querySelector('.nav');
menuButton.addEventListener('click',()=>nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>nav.classList.remove('open')));

document.querySelectorAll('.service-tab').forEach(button=>{
  button.addEventListener('click',()=>{
    document.querySelectorAll('.service-tab').forEach(item=>item.classList.remove('active'));
    document.querySelectorAll('.service-panel').forEach(panel=>panel.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(button.dataset.target).classList.add('active');
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

const modal=document.querySelector('.quote-modal');
const openButtons=document.querySelectorAll('.open-quote');
const closeButton=document.querySelector('.modal-close');
const backdrop=document.querySelector('.modal-backdrop');

function openModal(){
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
}
function closeModal(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}
openButtons.forEach(button=>button.addEventListener('click',openModal));
closeButton.addEventListener('click',closeModal);
backdrop.addEventListener('click',closeModal);

const lightbox=document.querySelector('.lightbox');
const lightboxImage=lightbox.querySelector('img');
document.querySelectorAll('.case-gallery img').forEach(image=>{
  image.addEventListener('click',()=>{
    lightboxImage.src=image.src;
    lightboxImage.alt=image.alt;
    lightbox.classList.add('open');
  });
});
lightbox.querySelector('.lightbox-close').addEventListener('click',()=>lightbox.classList.remove('open'));
lightbox.addEventListener('click',event=>{
  if(event.target===lightbox) lightbox.classList.remove('open');
});

document.addEventListener('keydown',event=>{
  if(event.key==='Escape'){
    closeModal();
    lightbox.classList.remove('open');
  }
});

const params=new URLSearchParams(window.location.search);
if(params.get('cotizacion')==='enviada'){
  alert('La solicitud de cotización fue enviada correctamente.');
  history.replaceState({},document.title,window.location.pathname);
}
document.getElementById('year').textContent=new Date().getFullYear();
