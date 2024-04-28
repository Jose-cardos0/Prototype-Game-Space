const cenario = document.getElementById("cenario");
const nave = document.getElementById("nave");
const botaoIniciar = document.getElementById("iniciar");
const dadosTela = document.getElementById("none");
const dadosTelaLogo = document.getElementById("titulo");
const vida = document.querySelector(".vida");
const pontos = document.getElementById("pontos");
const audioJogo = new Audio("/udx/missaoespaco.mp3");

const larguraCenario = cenario.offsetWidth;
const alturaCenario = cenario.offsetHeight;

const larguraNave = nave.offsetWidth;
const alturaNave = nave.offsetHeight;

const velocidadeNave = 50;
const velocidadeMeteorosInimigos = 5;
const velocidadeTiro = 20;

let checaMoveNave;
let checaMoveTiros;
let checaTiros;
let checaMoveMeteoros;
let checaMoveMeteorosInimigos;
let checaColisao;

let posicaoHorizontal = larguraCenario / 2 - 75;
let posicaoVertical = alturaCenario - alturaNave;
let direcaoHorizontal = 0;
let direcaoVertical = 0;
let vidaAtual = 100;
let pontosAtual = 0;

//audio narrador
function playAudioNarrador() {
  const tocarAudioNarrador = document.getElementById("audioNarrador");
  tocarAudioNarrador.load();
  tocarAudioNarrador.play();
}

window.addEventListener("DOMContentLoaded", (event) => {
  playAudioNarrador();
});

window.addEventListener("beforeunload", (event) => {
  playAudioNarrador();
});
//fim do audio narrador

const teclaPresisonada = (tecla) => {
  if (tecla.key === "ArrowRight") {
    direcaoHorizontal = 1;
  } else if (tecla.key === "ArrowLeft") {
    direcaoHorizontal = -1;
  } else if (tecla.key === "ArrowDown") {
    direcaoVertical = 1;
  } else if (tecla.key === "ArrowUp") {
    direcaoVertical = -1;
  }
};

const teclaSolta = (tecla) => {
  if (tecla.key === "ArrowRight" || tecla.key === "ArrowLeft") {
    direcaoHorizontal = 0;
  } else if (tecla.key === "ArrowDown" || tecla.key === "ArrowUp") {
    direcaoVertical = 0;
  }
};

const moveNave = () => {
  posicaoHorizontal += direcaoHorizontal * velocidadeNave;
  posicaoVertical += direcaoVertical * velocidadeNave;
  if (posicaoHorizontal < 0) {
    posicaoHorizontal = 0;
  } else if (posicaoHorizontal + larguraNave > larguraCenario) {
    posicaoHorizontal = larguraCenario - larguraNave;
  }

  if (posicaoVertical < 0) {
    posicaoVertical = 0;
  } else if (posicaoVertical + alturaNave > alturaCenario) {
    posicaoVertical = alturaCenario - alturaNave;
  }

  nave.style.left = posicaoHorizontal + "px";
  nave.style.top = posicaoVertical + "px";
};

//chamar função de atirar
let estaAtirando = false;
let tiroAtual = 0;
const atirar = () => {
  const delayTiro = Date.now();
  const atrasoTiro = delayTiro - tiroAtual;
  if (estaAtirando && atrasoTiro >= 100) {
    tiroAtual = Date.now();
    desparoDeTiros(posicaoHorizontal + 68, posicaoVertical);
  }
};

//disparar
document.addEventListener("keydown", (tecla) => {
  if (tecla.key === " ") {
    atirar();
    estaAtirando = true;
  }
});
//parar tiro
document.addEventListener("keyup", (tecla) => {
  if (tecla.key === " ") {
    estaAtirando = false;
  }
});

//atirar
const desparoDeTiros = (posicaoLeftTiro, posicaoTopTiro) => {
  const tiro = document.createElement("div");
  tiro.className = "tiro";
  tiro.style.position = "absolute";
  tiro.style.width = "20px";
  tiro.style.height = "20px";
  tiro.style.backgroundImage = "url(/img/disparo.gif)";
  tiro.style.backgroundSize = "contain";
  tiro.style.left = posicaoLeftTiro + "px";
  tiro.style.top = posicaoTopTiro + "px";
  tiro.style.transform = "rotate(-90deg)";
  cenario.appendChild(tiro);
  audioTiros();
};

//audio tiros
const audioTiros = () => {
  const audioDoTiro = document.createElement("audio");
  audioDoTiro.className = "audiotiro";
  audioDoTiro.setAttribute("src", "/udx/tiro.mp3");
  audioDoTiro.play();
  cenario.appendChild(audioDoTiro);
  audioDoTiro.addEventListener("ended", () => {
    audioDoTiro.remove();
  });
};

//movendo o desparo

const moveTiros = () => {
  const tiros = document.querySelectorAll(".tiro");
  for (let i = 0; i < tiros.length; i++) {
    if (tiros[i]) {
      let posicaoTopTorp = tiros[i].offsetTop;
      posicaoTopTorp -= velocidadeTiro;
      tiros[i].style.top = posicaoTopTorp + "px";
      if (posicaoTopTorp < -10) {
        tiros[i].remove();
      }
    }
  }
};

//meteoros inimigos
const meteorosInimigos = () => {
  const inimigos = document.createElement("div");
  inimigos.className = "inimigos";
  inimigos.style.position = "absolute";
  inimigos.setAttribute("data-vida", 5);
  inimigos.style.width = "100px";
  inimigos.style.height = "100px";
  inimigos.style.backgroundImage = "url(/img/meteor.gif)";
  inimigos.style.backgroundPosition = "center";
  inimigos.style.backgroundRepeat = "no-repeat";
  inimigos.style.backgroundSize = "contain";
  inimigos.style.left =
    Math.floor(Math.random() * (larguraCenario - larguraNave)) + "px";
  inimigos.style.top = "-100px";
  inimigos.style.transform = "rotate(90deg)";
  cenario.appendChild(inimigos);
};

//movimento dos meteoros

const moveMeteorosInimigos = () => {
  const meteorosInimigos = document.querySelectorAll(".inimigos");
  for (let i = 0; i < meteorosInimigos.length; i++) {
    if (meteorosInimigos[i]) {
      let posicaoMeteoroInimigo = meteorosInimigos[i].offsetTop;
      let posicaoLeftMeteoroInimigo = meteorosInimigos[i].offsetLeft;
      posicaoMeteoroInimigo += velocidadeMeteorosInimigos;
      meteorosInimigos[i].style.top = posicaoMeteoroInimigo + "px";
      if (posicaoMeteoroInimigo > alturaCenario) {
        vidaAtual -= 10;
        vida.textContent = `vida:${vidaAtual}`;
        explosaoMeteoroNoChao(posicaoLeftMeteoroInimigo);
        if (vidaAtual <= 0) {
          gameOver();
        }
        meteorosInimigos[i].remove();
      }
    }
  }
};

//Colisão entre tiro e meteoro
const colisao = () => {
  const todosInimigos = document.querySelectorAll(".inimigos");
  const todosTiros = document.querySelectorAll(".tiro");
  todosInimigos.forEach((meteoroInimigo) => {
    todosTiros.forEach((tiro) => {
      const colisaoMeteoroInimigo = meteoroInimigo.getBoundingClientRect();
      const colisaoTiro = tiro.getBoundingClientRect();
      const posicaoMeteoroInimigoLeft = meteoroInimigo.offsetLeft;
      const posicaoMeteoroInimigoTop = meteoroInimigo.offsetTop;
      let vidaAtualMeteoroInimigo = parseInt(
        meteoroInimigo.getAttribute("data-vida"),
        10
      );
      if (
        colisaoMeteoroInimigo.left < colisaoTiro.right &&
        colisaoMeteoroInimigo.right > colisaoTiro.left &&
        colisaoMeteoroInimigo.top < colisaoTiro.bottom &&
        colisaoMeteoroInimigo.bottom > colisaoTiro.top
      ) {
        vidaAtualMeteoroInimigo--;
        tiro.remove();
        if (vidaAtualMeteoroInimigo === 0) {
          pontosAtual += 20;
          pontos.textContent = `Pontos: ${pontosAtual}`;
          meteoroInimigo.remove();
          explosaoMeteoroDestruido(
            posicaoMeteoroInimigoLeft,
            posicaoMeteoroInimigoTop
          );
        } else {
          meteoroInimigo.setAttribute("data-vida", vidaAtualMeteoroInimigo);
        }
      }
    });
  });
};

//audio destruicao meteoro
const audioExplosoes = () => {
  const audioDestruicaoDoMeteoro = document.createElement("audio");
  audioDestruicaoDoMeteoro.className = "audioDestruicaoDoMeteoro";
  audioDestruicaoDoMeteoro.setAttribute("src", "/udx/destruido.mp3");
  audioDestruicaoDoMeteoro.play();
  cenario.appendChild(audioDestruicaoDoMeteoro);
  audioDestruicaoDoMeteoro.addEventListener("ended", () => {
    audioDestruicaoDoMeteoro.remove();
  });
};

//explosao do meteoro
const explosaoMeteoroDestruido = (
  posicaoLeftMeteoroInimigo,
  posicaoTopMeteoroInimigo
) => {
  const explosaoMeteoroInimigo = document.createElement("div");
  explosaoMeteoroInimigo.className = "explosaoMeteoroInimigo";
  explosaoMeteoroInimigo.style.position = "absolute";
  explosaoMeteoroInimigo.style.width = "100px";
  explosaoMeteoroInimigo.style.height = "100px";
  explosaoMeteoroInimigo.style.backgroundImage = "url(/img/explosion2.gif)";
  explosaoMeteoroInimigo.style.backgroundSize = "contain";
  explosaoMeteoroInimigo.style.backgroundRepeat = "no-repeat";
  explosaoMeteoroInimigo.style.backgroundPosition = "center";
  explosaoMeteoroInimigo.style.left = posicaoLeftMeteoroInimigo + "px";
  explosaoMeteoroInimigo.style.top = posicaoTopMeteoroInimigo + "px";
  audioExplosoes();
  cenario.appendChild(explosaoMeteoroInimigo);
  setTimeout(() => {
    cenario.removeChild(explosaoMeteoroInimigo);
  }, 1500);
};

//explosao do contato com o planeta
const explosaoMeteoroNoChao = (posicaoLeftMeteoroInimigo) => {
  const explosaoMeteoroInimigoNoChao = document.createElement("div");
  explosaoMeteoroInimigoNoChao.className = "explosaoMeteoroInimigoNoChao";
  explosaoMeteoroInimigoNoChao.style.position = "absolute";
  explosaoMeteoroInimigoNoChao.style.width = "100px";
  explosaoMeteoroInimigoNoChao.style.height = "100px";
  explosaoMeteoroInimigoNoChao.style.backgroundImage =
    "url(/img/eliminado.gif)";
  explosaoMeteoroInimigoNoChao.style.backgroundSize = "contain";
  explosaoMeteoroInimigoNoChao.style.backgroundRepeat = "no-repeat";
  explosaoMeteoroInimigoNoChao.style.backgroundPosition = "center";
  explosaoMeteoroInimigoNoChao.style.left = posicaoLeftMeteoroInimigo + "px";
  explosaoMeteoroInimigoNoChao.style.top = alturaCenario - 100 + "px";
  audioExplosoes();
  cenario.appendChild(explosaoMeteoroInimigoNoChao);
  setTimeout(() => {
    cenario.removeChild(explosaoMeteoroInimigoNoChao);
  }, 1500);
};

//Gameover
const gameOver = () => {
  document.removeEventListener("keydown", teclaPresisonada);
  document.removeEventListener("keyup", teclaSolta);
  clearInterval(checaMoveNave);
  clearInterval(checaMoveTiros);
  clearInterval(checaMoveMeteoros);
  clearInterval(checaMoveMeteorosInimigos);
  clearInterval(checaTiros);
  clearInterval(checaColisao);
  const perdeu = document.createElement("div");
  perdeu.style.position = "absolute";
  perdeu.style.backgroundImage = "url(/img/backgraundgame.gif)";
  perdeu.style.backgroundPosition = "center";
  perdeu.style.backgroundRepeat = "no-repeat";
  perdeu.style.backgroundSize = "cover";
  perdeu.style.left = "0";
  perdeu.style.top = "0";
  perdeu.style.width = "100vw";
  perdeu.style.height = "100vh";
  //   perdeu.style.transform = "rotate(180deg)";
  cenario.appendChild(perdeu);
  cenario.removeChild(nave);
  audioJogo.pause();
  const meteorosInimigos = document.querySelectorAll(".inimigos");
  meteorosInimigos.forEach((inimigoss) => {
    inimigoss.remove;
  });

  const todosTiros = document.querySelectorAll(".tiro");
  function removeTiros() {
    for (let i = 0; i < todosTiros.length; i++) {
      todosTiros[i].remove;
    }
    removeTiros();
  }

  const restartEndGame = document.createElement("div");
  restartEndGame.style.position = "absolute";
  restartEndGame.innerHTML = `<button id="restartButton">>RESTART</button>`;
  restartEndGame.style.backgroundColor = "white";
  restartEndGame.style.borderRadius = "0.3rem";
  restartEndGame.style.padding = "0.2rem";
  restartEndGame.style.left = "50%";
  restartEndGame.style.top = "80%";
  restartEndGame.style.transform = "translate(-50%, -50%)";
  cenario.appendChild(restartEndGame);

  const restartButton = document.getElementById("restartButton");
  restartButton.addEventListener("click", () => {
    window.location.reload();
  });

  const estiloBotaoRestart = `
  #restartButton {
    background-color: white;
    border: none;
    color: blueviolet;
    text-align: center;
    text-decoration: none;
    cursos: pointer;
  }`;

  const styleElement = document.createElement("style");
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = estiloBotaoRestart;
  } else {
    styleElement.appendChild(document.createTextNode(estiloBotaoRestart));
  }

  document.head.appendChild(styleElement);
};

//controle nave celular
const controleNaveToque = (evento) => {
  if (evento.targetTouches.length === 1) {
    const toque = evento.targetTouches[0];
    const centroX = window.innerWidth / 2;
    direcaoHorizontal =
      toque.pageX > centroX ? 1 : toque.pageX < centroX ? -1 : 0;
  }
};

const dispararToque = () => {
  atirar();
};

botaoIniciar.addEventListener("touchstart", () => {
  iniciarJogo();
});
//fim contorle nave celular

const iniciarJogo = () => {
  document.addEventListener("keydown", teclaPresisonada);
  document.addEventListener("keyup", teclaSolta);
  document.addEventListener("touchstart", controleNaveToque);
  document.addEventListener("touchmove", controleNaveToque);
  document.addEventListener("touchend", dispararToque);
  checaColisao = setInterval(colisao, 10);
  checaMoveNave = setInterval(moveNave, 50);
  checaMoveTiros = setInterval(moveTiros, 50);
  checaMoveMeteoros = setInterval(meteorosInimigos, 1500);
  checaMoveMeteorosInimigos = setInterval(moveMeteorosInimigos, 50);
  botaoIniciar.style.display = "none";
  dadosTela.style.display = "none";
  dadosTelaLogo.classList.add("transparente");
  checaTiros = setInterval(atirar, 10);
  cenario.style.animation = "animarCenario 20s infinite linear";
  audioJogo.loop = true;
  audioJogo.play();
  audioNarrador.pause();
};
