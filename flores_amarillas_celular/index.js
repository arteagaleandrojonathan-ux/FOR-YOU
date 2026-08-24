// ---------- Petals canvas (solo fondo) ----------
const canvas = document.getElementById('petal-canvas');
const ctx = canvas.getContext('2d');
let dpr = Math.max(1, window.devicePixelRatio || 1);

// ---------- Fireworks overlay ----------
const fireworksOverlay = document.getElementById('fireworksOverlay');
const fwCanvas = document.getElementById('fireworksCanvas');
const fwCtx = fwCanvas.getContext('2d');
const heartShape = document.getElementById('heartShape');

function resizeFW() {
  fwCanvas.width = window.innerWidth;
  fwCanvas.height = window.innerHeight;
}
resizeFW();
window.addEventListener('resize', () => { resizeFW(); heartPts = heartPoints(200, window.innerWidth, window.innerHeight); });

// Partículas
class Particle {
  constructor(x, y, color, vx, vy) {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.alpha = 1;
    this.color = color;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.02; // gravedad
    this.alpha -= 0.01;
  }
  draw(ctx) {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

let particles = [];
function explode(x, y, color) {
  for (let i = 0; i < 80; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1;
    particles.push(new Particle(
      x, y, color,
      Math.cos(angle) * speed,
      Math.sin(angle) * speed
    ));
  }
}

// Corazón paramétrico
function heartPoints(count, w, h) {
  const pts = [];
  for (let i = 0; i < count; i++) {
    const t = Math.PI - (i / count) * 2 * Math.PI;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    pts.push({ x: w / 2 + x * 20, y: h / 2 - y * 20 });
  }
  return pts;
}
let heartPts = heartPoints(200, window.innerWidth, window.innerHeight);

// Animación fireworks
let showHeart = false;
function animateFW() {
  fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);

  particles.forEach((p, i) => {
    if (!showHeart) {
      p.update();
    } else {
      let target = heartPts[i % heartPts.length];
      p.x += (target.x - p.x) * 0.05;
      p.y += (target.y - p.y) * 0.05;
      p.alpha = 1;
    }
    p.draw(fwCtx);
  });

  requestAnimationFrame(animateFW);
}

// ========================================
// ABRIR SORPRESA
// ========================================

let surpriseOpened = false;

function openFireworks() {

    if (surpriseOpened) return;
    surpriseOpened = true;
    fireworksOverlay.classList.remove('d-none');

    // Primera explosión
    setTimeout(() => {
        explode(
            window.innerWidth / 2,
            window.innerHeight / 2,
            "gold"
        );
    }, 1000);

    // Segunda explosión
    setTimeout(() => {
        explode(
            window.innerWidth / 3,
            window.innerHeight / 2.5,
            "pink"
        );
    }, 2000);

    // Tercera explosión
    setTimeout(() => {
        explode(
            window.innerWidth * 0.7,
            window.innerHeight / 3,
            "cyan"
        );
    }, 3000);

    // ====================================
    // AQUÍ EMPIEZAN LAS FOTOS
    // mientras el corazón se está formando
    // ====================================
    setTimeout(() => {

        mostrarFotos();

    }, 3200);

    // ====================================
    // CORAZÓN
    // ====================================
    setTimeout(() => {

        showHeart = true;
        heartShape.style.opacity = 1;

    }, 4500);

    setTimeout(() => {

    mostrarSiguienteTexto();

}, 5000);
}

animateFW();

// Pantalla final
const pantallaFinal = document.getElementById('pantallaFinal');

// ========================================
// MENSAJES DEL SEGUNDO PLANO
// ========================================

const mensajeCorazon =
    document.getElementById('mensajeCorazon');
const mensajeEspecial =
    document.getElementById('mensajeEspecial');
    const textoEspecial =
    "Y a pesar de las adversidades que tengas... Nunca dejes de sonreír. Vive. ama y come ❤️ ";

    function mostrarMensajeEspecial() {

    mensajeEspecial.textContent = "";

    let i = 0;

    mensajeEspecial.style.opacity = "1";

    function escribirEspecial() {

        if (i < textoEspecial.length) {

            mensajeEspecial.textContent += textoEspecial.charAt(i);

            i++;

            setTimeout(escribirEspecial, 80);

        }

    }

    escribirEspecial();
}
const textosFinales = [

    "Gracias por estar en mi vida. ❤️",

    "Cada momento contigo se vuelve un recuerdo especial. 💛",

    "Espero poder seguir compartiendo muchos momentos contigo. 🌼",

    "Y aunque las palabras no siempre sean suficientes...",

    "Quiero que sepas que te quiero muchísimo. ❤️"

];

let indiceTexto = 0;

function mostrarSiguienteTexto() {

    const texto = textosFinales[indiceTexto];

    mensajeCorazon.textContent = "";
    mensajeCorazon.classList.remove("ocultar");
    mensajeCorazon.classList.add("mostrar");

    let i = 0;

    function escribir() {

        if (i < texto.length) {

            mensajeCorazon.textContent += texto.charAt(i);

            i++;

            setTimeout(escribir, 65);

        }

    }

    escribir();

    // Después de 4 segundos empieza a desaparecer
    setTimeout(() => {

        mensajeCorazon.classList.remove("mostrar");
        mensajeCorazon.classList.add("ocultar");

    }, 4000);

    // Después aparece el siguiente
    setTimeout(() => {

    indiceTexto++;

    // Si ya terminaron todos los textos
    if (indiceTexto >= textosFinales.length) {

        // Esperar a que el último termine de desaparecer
        setTimeout(() => {

            mostrarMensajeEspecial();

        }, 1000);

        return;
    }

    // Mostrar el siguiente texto
    mostrarSiguienteTexto();

}, 7000);
}

// ========================================
// FOTOS DE FONDO
// ========================================

const fotosFinales = document.querySelectorAll('#fotosFinales img');

let grupoFotos = 0;
function mostrarFotos() {

    // ========================================
    // 3 FOTOS POR GRUPO
    // ========================================

    const cantidad = 3;

    const todasLasFotos = [...fotosFinales];

    // Tenemos 15 fotos = 5 grupos de 3
    const totalGrupos = Math.ceil(
        todasLasFotos.length / cantidad
    );

    const grupoActual = grupoFotos % totalGrupos;

    // ========================================
    // OCULTAR FOTOS ANTERIORES
    // ========================================

    fotosFinales.forEach(foto => {
        foto.style.opacity = '0';
    });

    // ========================================
    // OBTENER LAS 3 FOTOS DEL GRUPO
    // ========================================

    const inicio = grupoActual * cantidad;

    const fotosGrupo = todasLasFotos.slice(
        inicio,
        inicio + cantidad
    );

    // ========================================
    // COLOCAR CADA FOTO EN SU COLUMNA
    // ========================================

    fotosGrupo.forEach((foto, i) => {

        /*
            i = 0 → IZQUIERDA
            i = 1 → CENTRO
            i = 2 → DERECHA
        */

        let izquierda;
        let arriba;

        // ====================================
        // COLUMNA IZQUIERDA
        // ====================================
if (i === 0) {

    // IZQUIERDA
    izquierda = Math.random() * 12 + 2;

} else if (i === 1) {

    // CENTRO
    izquierda = Math.random() * 12 + 44;

} else {

    // DERECHA
    izquierda = Math.random() * 12 + 76;
}

        // Puede aparecer arriba, centro o abajo
        arriba =
            Math.random() * 55 + 5;

        const rotacion =
            Math.random() * 20 - 10;

        foto.style.left =
            izquierda + '%';

        foto.style.top =
            arriba + '%';

        foto.style.transform =
            `rotate(${rotacion}deg) scale(1)`;

        setTimeout(() => {

            foto.style.opacity = '0.45';

        }, i * 500);

    });


    grupoFotos++;

    setTimeout(() => {

        mostrarFotos();

    }, 7000);
}
// Botón sorpresa
document.getElementById('btnSurpriseBottom')
  .addEventListener('click', openFireworks);

// ---------- Petals ----------
function resizeCanvas() {
  dpr = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let wind = 0;
let mouseX = window.innerWidth / 2;
window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  const center = window.innerWidth / 2;
  wind = (mouseX - center) / center * 0.6;
});

class Petal {
  constructor(w, h) { this.reset(w, h); }
  reset(w, h) {
    this.w = w; this.h = h;
    this.x = Math.random() * w;
    this.y = Math.random() * -h;
    this.size = 10 + Math.random() * 28;
    this.speed = 0.6 + Math.random() * 2.2;
    this.rot = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() * 0.02) - 0.01;
    const yellow = 200 + Math.floor(Math.random() * 55);
    const r = 255, g = yellow, b = 50 + Math.floor(Math.random() * 60);
    this.color = `rgba(${r},${g},${b},0.88)`;
    this.sway = Math.random() * 1.5;
    this.phase = Math.random() * Math.PI * 2;
  }
  update() {
    this.phase += 0.02 + Math.random() * 0.01;
    this.rot += this.rotSpeed;
    this.y += this.speed;
    this.x += Math.sin(this.phase) * 0.4 + wind * 0.6 * this.size / 30;
    if (this.y > this.h + 40) {
      this.y = -30 - Math.random() * 100;
      this.x = Math.random() * this.w;
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size * 0.6, this.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

let petals = [];
function createPetals() {
  petals = [];
  const count = Math.floor(Math.max(window.innerWidth / 24, 28));
  for (let i = 0; i < count; i++) petals.push(new Petal(window.innerWidth, window.innerHeight));
}
createPetals();
window.addEventListener('resize', () => {
  createPetals(); resizeCanvas();
});

function loop() {
  ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
  for (const p of petals) {
    p.update();
    p.draw(ctx);
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// ---------- Typewriter ----------
const msg = "Hoy quiero recordarte lo especial que eres 💛";
const writer = document.getElementById('typewriter');
let idx = 0;
function typeTick() {
  if (idx < msg.length) {
    writer.textContent += msg.charAt(idx);
    idx++;
    setTimeout(typeTick, 56 + Math.random() * 40);
  }
}
setTimeout(typeTick, 700);

// ---------- Audio autoplay fallback / overlay ----------
const bg = document.getElementById('bgMusic');
const startOverlay = document.getElementById('startOverlay');
const startBtn = document.getElementById('startBtn');
const audioToggle = document.getElementById('audioToggle');
const audioIcon = document.getElementById('audioIcon');

function tryPlayAudio() {
  bg.play().then(() => {
    audioIcon.className = 'bi bi-pause-fill';
  }).catch(() => {
    startOverlay.classList.remove('d-none');
  });
}
window.addEventListener('load', () => {
  tryPlayAudio();
});

// botón inicial
startBtn.addEventListener('click', () => {
  bg.play().then(() => {
    startOverlay.classList.add('d-none');
    audioIcon.className = 'bi bi-pause-fill';
  }).catch(() => {});
});

// toggle música navbar
audioToggle.addEventListener('click', () => {
  if (bg.paused) {
    bg.play(); audioIcon.className = 'bi bi-pause-fill';
  } else {
    bg.pause(); audioIcon.className = 'bi bi-play-fill';
  }
});

// ---------- Love Note ----------
const btnLoveNote = document.getElementById('btnLoveNote');
const loveNote = document.getElementById('loveNote');

btnLoveNote.addEventListener('click', () => {
  loveNote.classList.remove('d-none', 'hide');
  loveNote.classList.add('show');

  setTimeout(() => {
    loveNote.classList.remove('show');
    loveNote.classList.add('hide');
    setTimeout(() => loveNote.classList.add('d-none'), 600);

    
  }, 4000);
});
