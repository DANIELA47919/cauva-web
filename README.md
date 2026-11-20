# CAUVA Web V10 · «Ingeniería que resuelve.»

Sitio completo de CAUVA SpA. HTML, CSS y JavaScript sin librerías ni proceso de compilación: se publica tal cual en GitHub Pages (cauva.cl).

## Probar en tu computador
En la carpeta descomprimida ejecuta `python -m http.server 8000` y abre http://localhost:8000
(También funciona con doble clic en `index.html`, pero así se prueba igual que en internet).

## Estructura
```
index.html
css/cauva-v10.css
js/cauva-v10.js
assets/img/      fotografías reales de CAUVA en WebP (varios tamaños)
assets/brand/    logo original (fondo transparente), imagen para compartir, ícono
assets/fonts/    Montserrat, DM Sans y Anonymous Pro (licencia OFL incluida)
favicon-32.png, apple-touch-icon.png, robots.txt, sitemap.xml, CNAME
```

## Secciones
1. **Portada**: «Ingeniería que resuelve.» con la frase de apoyo, botones de cotización y servicios, y accesos directos a las cinco áreas.
2. **Nosotros**: filosofía de CAUVA y presentación de marca con Precisión · Eficiencia · Compromiso.
3. **De la necesidad a la solución**: secuencia animada en cinco etapas (Necesidad → Ingeniería → Diseño → Construcción → Solución) con botón de pausa.
4. **Servicios**: cinco áreas con Qué hacemos / Qué resolvemos / Cómo te ayudamos, una ilustración técnica propia por área y botón de cotización que deja el servicio elegido en el formulario.
5. **Modelado 3D**: cinco pasos del catamarán, del concepto a la construcción, con comparador deslizable modelo / obra.
6. **Proyectos**: catamarán multipropósito, barcaza de servicio, inspección de casco y experimento de inclinación (diagrama interactivo), con galerías por proyecto.
7. **Contacto**: formulario de cotización (FormSubmit → dmunoz@cauva.cl, mismos campos y redirección que antes) y WhatsApp +56 9 6275 7559.

## Publicar
1. Descarga un respaldo del repositorio actual.
2. Elimina los archivos de `ARCHIVOS-A-ELIMINAR.txt` (lo más simple: borrar todo excepto `CNAME`).
3. Sube el contenido de este ZIP con «Add files via upload» y confirma con «Commit changes».
4. Espera unos minutos y abre https://cauva.cl (Ctrl + F5 si ves la versión anterior).
5. Envía una solicitud de prueba desde el formulario y confirma que llega a dmunoz@cauva.cl.
