let flippad = false;
let stay = false;
let first, second;
let spelarTur = 0;
let nuvarandeSpelare = 1;
let spelareEttScore = 0;
let spelareTvaScore = 0;
let playerOne = localStorage.getItem("PlayerOne");
let playerTwo = localStorage.getItem("PlayerTwo");
let highScores = [];

// SAVE NAMES

function sparaNamn() {
  const playerOne = document.getElementById("player-one");
  const playerTwo = document.getElementById("player-two");

  if (playerOne.value && playerTwo.value) {
    localStorage.setItem("PlayerOne", playerOne.value);
    localStorage.setItem("PlayerTwo", playerTwo.value);
    window.location.href = "./memory-players.html";
  } else {
    const alertSolo = document.getElementById("name-alert");
    alertSolo.innerHTML = "";

    const alert = document.createElement("p");
    alert.classList.add("alert");
    alert.textContent = `NEED INPUT TO CONTINUE`;
    alertSolo.appendChild(alert);
  }
}

// GET NAMES

document.addEventListener("DOMContentLoaded", function () {
  let playerOne = localStorage.getItem("PlayerOne");
  let playerTwo = localStorage.getItem("PlayerTwo");

  document.getElementById("spelarnamn1").innerText = playerOne + ":";
  document.getElementById("spelarnamn2").innerText = playerTwo + ":";

  if (localStorage.getItem("highScores")) {
    laddaHighScores();
    visaHighScores();
  }
});

//MEMORY
const kort = document.querySelectorAll(".kort");
kort.forEach((kort) => kort.addEventListener("click", flip));

//FLIP CARDS

function flip() {
  if (stay) return;
  if (this === first) return;

  this.classList.add("flip");

  if (!flippad) {
    flippad = true;
    first = this;
    return;
  }

  second = this;

  kollaMatchning();
}

function kollaMatchning() {
  if (first.id === second.id) {
    inaktiveraKort();
    uppdateraScore(true);
    checkWinner();
    return true;
  } else {
    deflippaKort();
    uppdateraScore(false);
    return false;
  }
}

function inaktiveraKort() {
  first.removeEventListener("click", flip);
  second.removeEventListener("click", flip);
  reset();
}

function deflippaKort() {
  stay = true;
  setTimeout(() => {
    first.classList.remove("flip");
    second.classList.remove("flip");
    reset();
  }, 1500);
}

function reset() {
  [flippad, stay] = [false, false];
  [first, second] = [null, null];
}

//RANDOMIZE CARDS
kort.forEach(function (kort) {
  let randomNum = Math.floor(Math.random() * 12);
  kort.style.order = randomNum;
});

//SCORE
function uppdateraScore(matchning) {
  if (matchning) {
    if (nuvarandeSpelare === 1) {
      spelareEttScore += 1;
    } else {
      spelareTvaScore += 1;
    }
  }
  if (!matchning) {
    nuvarandeSpelare = nuvarandeSpelare === 1 ? 2 : 1;
  }
  spelarTur += 1;

  uppdateraSidansScore(spelareEttScore, spelareTvaScore);
}

function uppdateraSidansScore(spelareEttScore, spelareTvaScore) {
  const spelarnamn1 = document.getElementById("spelarnamn1");
  const spelarnamn2 = document.getElementById("spelarnamn2");

  if (nuvarandeSpelare === 1) {
    spelarnamn1.classList.add("spelarnamn-bold");
    spelarnamn2.classList.remove("spelarnamn-bold");
  } else {
    spelarnamn1.classList.remove("spelarnamn-bold");
    spelarnamn2.classList.add("spelarnamn-bold");
  }

  document.getElementById("score1").innerText = spelareEttScore;
  document.getElementById("score2").innerText = spelareTvaScore;
}

// SAVE AND SHOW SCORES
function uppdateraHighScores(
  playerOne,
  spelareEttScore,
  playerTwo,
  spelareTvaScore
) {
  highScores.push({
    spelare1: playerOne,
    score1: spelareEttScore,
    spelare2: playerTwo,
    score2: spelareTvaScore,
  });

  sparaHighScores();
  visaHighScores();
}

function laddaHighScores() {
  highScores = JSON.parse(localStorage.getItem("highScores") || []);
}

function sparaHighScores() {
  localStorage.setItem("highScores", JSON.stringify(highScores));
}

function visaHighScores() {
  const highScoresLista = document.getElementById("highScores-lista");
  highScoresLista.innerHTML = "";

  highScores.forEach((entry) => {
    const p = document.createElement("p");

    p.textContent = `${entry.spelare1}: ${entry.score1} vs ${entry.spelare2}: ${entry.score2}`;
    highScoresLista.appendChild(p);
  });
}

// RESET POINTS

function resettaScore() {
  let nuvarandeSpelare = 1;

  uppdateraHighScores(playerOne, spelareEttScore, playerTwo, spelareTvaScore);

  spelareEttScore = 0;
  spelareTvaScore = 0;

  uppdateraSidansScore(spelareEttScore, spelareTvaScore, nuvarandeSpelare);

  kort.forEach((kort) => {
    kort.classList.remove("flip");
    kort.addEventListener("click", flip);
  });

  kort.forEach(function (kort) {
    let randomNum = Math.floor(Math.random() * 12);
    kort.style.order = randomNum;
  });
}

// CHECK FOR WINNER
function checkWinner() {
  const oflippadeKort = Array.from(
    document.querySelectorAll(".kort:not(.flip)")
  );
  let ingenWinner = "";
  let winnerName;
  if (spelareEttScore > spelareTvaScore) {
    winnerName = `Grattis ${playerOne} du vann!`;
  } else if (spelareEttScore < spelareTvaScore) {
    winnerName = `Grattis ${playerTwo} du vann!`;
  } else if ((spelareEttScore = spelareTvaScore)) {
    ingenWinner = "Ingen vinnare denna runda";
  }
  if (oflippadeKort.length === 0) {
    const winnerMessage = document.createElement("p");
    winnerMessage.textContent = ingenWinner != "" ? ingenWinner : winnerName;
    winnerMessage.classList.add("winner-message");
    document.body.appendChild(winnerMessage);
    setTimeout(() => {
      winnerMessage.remove();
    }, 5000);
  }
}
// END GAME

function sparaOchAvsluta() {
  if (spelareEttScore != 0 && spelareTvaScore != 0) {
    uppdateraHighScores(playerOne, spelareEttScore, playerTwo, spelareTvaScore);
  }

  window.location.href = "./index.html";
}

//DARKREADER
