// Variables para la posición y velocidad de la pelota
let pelotaX, pelotaY, velocidadPelotaX, velocidadPelotaY, radioPelota;

// Variables para el efecto de giro
let anguloPelota = 0; // Ángulo inicial de la pelota
let velocidadGiro; // Velocidad del giro de la pelota

// Variables para las raquetas
let raquetaJugadorY, raquetaComputadoraY;
let raquetaAncho, raquetaAlto;
let velocidadComputadora;

// Variables del canvas y marcos
let anchoCanvas = 600;
let altoCanvas = 400;
let marcoAlto = 10; // Altura del marco superior e inferior

// Puntuación
let puntosJugador = 0;
let puntosComputadora = 0;

// Estado de pausa del juego
let juegoPausado = false;

// Imagen de fondo y sprites
let fondo, barraJugador, barraComputadora, bola;

// Variables de audio
let sonidoRebote;
let sonidoGol;

function preload() {
  // Cargamos las imágenes y los sonidos
  fondo = loadImage("fondo1.png");
  barraJugador = loadImage("barra1.png");
  barraComputadora = loadImage("barra2.png");
  bola = loadImage("bola.png");
  sonidoRebote = loadSound("bounce.wav"); // Sonido de rebote
  sonidoGol = loadSound("game_over.wav"); // Sonido de gol
}

function setup() {
  createCanvas(anchoCanvas, altoCanvas);
  setupGame();
}

function draw() {
  background(fondo); // Utiliza la imagen como fondo
  drawGame();
  
  // Verifica si el juego está en pausa
  if (!juegoPausado) {
    moveBall();
    checkCollisions();
    movePaddles();
  } else {
    mostrarMensajePausa(); // Muestra un mensaje de pausa en la pantalla
  }
  
  displayScore();
}

// Configuración inicial del juego
function setupGame() {
  // Inicializamos las variables de la pelota
  pelotaX = anchoCanvas / 2;
  pelotaY = altoCanvas / 2;
  velocidadPelotaX = 5;
  velocidadPelotaY = 3;
  radioPelota = 15;
  
  // Inicializamos la velocidad de giro
  velocidadGiro = 0.1;
  
  // Tamaño de las raquetas
  raquetaAncho = 10;
  raquetaAlto = 70;

  // Posiciones iniciales de las raquetas
  raquetaJugadorY = altoCanvas / 2 - raquetaAlto / 2;
  raquetaComputadoraY = altoCanvas / 2 - raquetaAlto / 2;

  // Velocidad de la computadora
  velocidadComputadora = 3;
}

// Dibuja el juego: la pelota, las raquetas y los marcos
function drawGame() {
  // Dibujar marcos superior e inferior
  fill("#2B3FD6");
  rect(0, 0, anchoCanvas, marcoAlto); // Marco superior
  rect(0, altoCanvas - marcoAlto, anchoCanvas, marcoAlto); // Marco inferior

  // Dibujar la pelota con giro
  push();
  translate(pelotaX, pelotaY); // Mover el origen de coordenadas a la posición de la pelota
  rotate(anguloPelota); // Rotar en base al ángulo actual
  imageMode(CENTER); // Asegura que la imagen se dibuje desde el centro
  image(bola, 0, 0, radioPelota * 2, radioPelota * 2); // Dibuja la pelota
  pop();
  
  // Dibujar raquetas usando las imágenes
  image(barraJugador, 5, raquetaJugadorY, raquetaAncho, raquetaAlto); // Raqueta del jugador
  image(barraComputadora, anchoCanvas - 15, raquetaComputadoraY, raquetaAncho, raquetaAlto); // Raqueta de la computadora
}

// Mueve la pelota
function moveBall() {
  // Mover la pelota
  pelotaX += velocidadPelotaX;
  pelotaY += velocidadPelotaY;

  // Actualizar el ángulo de giro en función de la velocidad de la pelota
  let velocidadTotal = sqrt(velocidadPelotaX ** 2 + velocidadPelotaY ** 2); // Magnitud de la velocidad
  anguloPelota += velocidadTotal * velocidadGiro; // Incremento del ángulo proporcional a la velocidad
}

// Verifica colisiones con las raquetas y los marcos
function checkCollisions() {
  // Colisiones con los marcos superior e inferior
  if (pelotaY - radioPelota < marcoAlto || pelotaY + radioPelota > altoCanvas - marcoAlto) {
    velocidadPelotaY *= -1;
    sonidoRebote.play(); // Reproducir sonido de rebote
  }

  // Colisión con la raqueta del jugador
  if (pelotaX - radioPelota < 20 && pelotaY > raquetaJugadorY && pelotaY < raquetaJugadorY + raquetaAlto) {
    velocidadPelotaX *= -1;
    sonidoRebote.play(); // Reproducir sonido de rebote

    // Ajuste de velocidad vertical según la posición de impacto en la raqueta
    let puntoImpacto = pelotaY - (raquetaJugadorY + raquetaAlto / 2);
    velocidadPelotaY = map(puntoImpacto, -raquetaAlto / 2, raquetaAlto / 2, -5, 5);
  }

  // Colisión con la raqueta de la computadora
  if (pelotaX + radioPelota > anchoCanvas - 20 && pelotaY > raquetaComputadoraY && pelotaY < raquetaComputadoraY + raquetaAlto) {
    velocidadPelotaX *= -1;
    sonidoRebote.play(); // Reproducir sonido de rebote

    // Ajuste de velocidad vertical según la posición de impacto en la raqueta
    let puntoImpacto = pelotaY - (raquetaComputadoraY + raquetaAlto / 2);
    velocidadPelotaY = map(puntoImpacto, -raquetaAlto / 2, raquetaAlto / 2, -5, 5);
  }

  // Puntuación cuando la pelota sale por los lados (anotar gol)
  if (pelotaX < 0) {
    puntosComputadora++;
    sonidoGol.play(); // Reproducir sonido de gol
    narrarMarcador(); // Narra el marcador actual
    reiniciarPelota();
  }
  if (pelotaX > anchoCanvas) {
    puntosJugador++;
    sonidoGol.play(); // Reproducir sonido de gol
    narrarMarcador(); // Narra el marcador actual
    reiniciarPelota();
  }
}

// Función para narrar el marcador actual
function narrarMarcador() {
  const mensaje = `El marcador es ${puntosJugador} a ${puntosComputadora}`;
  const narrador = new SpeechSynthesisUtterance(mensaje);
  narrador.lang = 'es-ES'; // Ajusta el idioma a español
  window.speechSynthesis.speak(narrador);
}

// Función para alternar el estado de pausa
function togglePause() {
  juegoPausado = !juegoPausado;
}

// Función para mostrar el mensaje de pausa en la pantalla
function mostrarMensajePausa() {
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Juego en Pausa", anchoCanvas / 2, altoCanvas / 2);
}

// Detecta si se presionó la tecla P para pausar
function keyPressed() {
  if (key === 'P' || key === 'p') {
    togglePause();
  }
}

// Mueve las raquetas
function movePaddles() {
  // Movimiento de la raqueta del jugador
  if (keyIsDown(UP_ARROW)) {
    raquetaJugadorY -= 4;
  }
  if (keyIsDown(DOWN_ARROW)) {
    raquetaJugadorY += 4;
  }

  // Movimiento de la raqueta de la computadora (intenta seguir la pelota)
  if (pelotaY > raquetaComputadoraY + raquetaAlto / 2) {
    raquetaComputadoraY += velocidadComputadora;
  } else {
    raquetaComputadoraY -= velocidadComputadora;
  }

  // Limitar la posición de las raquetas
  raquetaJugadorY = constrain(raquetaJugadorY, marcoAlto, altoCanvas - raquetaAlto - marcoAlto);
  raquetaComputadoraY = constrain(raquetaComputadoraY, marcoAlto, altoCanvas - raquetaAlto - marcoAlto);
}

// Muestra la puntuación en la pantalla
function displayScore() {
  fill("#2B3FD6");
  textSize(32);
  textAlign(LEFT, TOP);
  text("Jugador: " + puntosJugador, 20, 20);
  textAlign(RIGHT, TOP);
  text("Computadora: " + puntosComputadora, anchoCanvas - 20, 20);
}

// Reinicia la posición y velocidad de la pelota
function reiniciarPelota() {
  pelotaX = anchoCanvas / 2;
  pelotaY = altoCanvas / 2;
  velocidadPelotaX *= -1; // Cambia de dirección
  velocidadPelotaY = random(-3, 3); // Asigna una nueva velocidad vertical aleatoria
}
