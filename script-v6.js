
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


// Galería ampliable V6
const galleryImages = [...document.querySelectorAll('.zoomable')];
const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('figcaption');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const lightboxPrev = lightbox.querySelector('.lightbox-prev');
const lightboxNext = lightbox.querySelector('.lightbox-next');
let currentImageIndex = 0;
let touchStartX = 0;

function showImage(index){
  currentImageIndex = (index + galleryImages.length) % galleryImages.length;
  const image = galleryImages[currentImageIndex];
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt || '';
  lightboxCaption.textContent = image.alt || '';
}

function openLightbox(index){
  showImage(index);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden','false');
  document.body.classList.add('lightbox-open');
}

function closeLightbox(){
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden','true');
  document.body.classList.remove('lightbox-open');
}

galleryImages.forEach((image,index)=>{
  image.addEventListener('click',()=>openLightbox(index));
});

lightboxClose.addEventListener('click',closeLightbox);
lightboxPrev.addEventListener('click',()=>showImage(currentImageIndex-1));
lightboxNext.addEventListener('click',()=>showImage(currentImageIndex+1));

lightbox.addEventListener('click',event=>{
  if(event.target===lightbox) closeLightbox();
});

document.addEventListener('keydown',event=>{
  if(!lightbox.classList.contains('open')) return;
  if(event.key==='Escape') closeLightbox();
  if(event.key==='ArrowLeft') showImage(currentImageIndex-1);
  if(event.key==='ArrowRight') showImage(currentImageIndex+1);
});

lightbox.addEventListener('touchstart',event=>{
  touchStartX = event.changedTouches[0].screenX;
},{passive:true});

lightbox.addEventListener('touchend',event=>{
  const touchEndX = event.changedTouches[0].screenX;
  const distance = touchEndX - touchStartX;
  if(Math.abs(distance) < 50) return;
  if(distance > 0) showImage(currentImageIndex-1);
  else showImage(currentImageIndex+1);
},{passive:true});
