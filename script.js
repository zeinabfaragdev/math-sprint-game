// Pages
const gamePage = document.getElementById("game-page");
const scorePage = document.getElementById("score-page");
const splashPage = document.getElementById("splash-page");
const countdownPage = document.getElementById("countdown-page");
// Splash Page
const startForm = document.getElementById("start-form");
const radioContainers = document.querySelectorAll(".radio-container");
const radioInputs = document.querySelectorAll("input");
const bestScores = document.querySelectorAll(".best-score-value");
// Countdown Page
const countdown = document.querySelector(".countdown");
// Game Page
const itemContainer = document.querySelector(".item-container");
// Score Page
const finalTimeEl = document.querySelector(".final-time");
const baseTimeEl = document.querySelector(".base-time");
const penaltyTimeEl = document.querySelector(".penalty-time");
const playAgainBtn = document.querySelector(".play-again");

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoresArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = "0.0";

// Scroll
let valueY = 0;

function bestScoresToDOM() {
  bestScores.forEach((score, i) => {
    score.textContent = `${bestScoresArray[i].bestScore}s`;
  });
}

function getSavedBestScores() {
  if (localStorage.getItem("bestScores")) {
    bestScoresArray = JSON.parse(localStorage.getItem("bestScores"));
  } else {
    bestScoresArray = [
      { questions: 10, bestScore: finalTimeDisplay },
      { questions: 25, bestScore: finalTimeDisplay },
      { questions: 50, bestScore: finalTimeDisplay },
      { questions: 99, bestScore: finalTimeDisplay },
    ];
  }
  localStorage.setItem("bestScores", JSON.stringify(bestScoresArray));
  bestScoresToDOM();
}

function updateBestScore() {
  bestScoresArray.forEach((score, i) => {
    if (questionAmount == score.questions) {
      const savedBestScore = Number(bestScoresArray[i].bestScore);
      if (savedBestScore == 0 || savedBestScore > finalTimeDisplay) {
        bestScoresArray[i].bestScore = finalTimeDisplay;
        localStorage.setItem("bestScores", JSON.stringify(bestScoresArray));
      }
    }
  });

  getSavedBestScores();
}

function showScorePage() {
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
  gamePage.hidden = true;
  scorePage.hidden = false;
}

function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  timePlayed = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);

  baseTimeEl.textContent = `Base Time: ${timePlayed}s`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore();
  itemContainer.scrollTo({ top: 0, behavior: "instant" });
  showScorePage();
}

function checkTime() {
  if (playerGuessArray.length == questionAmount) {
    clearInterval(timer);
    checkScores();
  }
}

function checkScores() {
  equationsArray.forEach((equation, i) => {
    if (equation.evaluated !== playerGuessArray[i]) {
      penaltyTime += 0.5;
    }
  });

  finalTime = penaltyTime + timePlayed;
  scoresToDOM();
}

function addTime() {
  timePlayed += 0.1;
  checkTime();
}

function startTimer() {
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener("click", startTimer);
}

function select(guessedTrue) {
  valueY += 80;
  itemContainer.scroll(0, valueY);
  playerGuessArray.push(guessedTrue);
}

function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = Math.floor(Math.random() * questionAmount);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = Math.floor(Math.random() * 10);
    secondNumber = Math.floor(Math.random() * 10);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: true };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = Math.floor(Math.random() * 10);
    secondNumber = Math.floor(Math.random() * 10);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = Math.floor(Math.random() * 3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: false };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

function equationsToDOM() {
  equationsArray.forEach((equation) => {
    const item = document.createElement("div");
    item.classList.add("item");

    const equationText = document.createElement("h1");
    equationText.textContent = equation.value;

    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = "";
  // Spacer
  const topSpacer = document.createElement("div");
  topSpacer.classList.add("height-240");
  // Selected Item
  const selectedItem = document.createElement("div");
  selectedItem.classList.add("selected-item");
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement("div");
  bottomSpacer.classList.add("height-500");
  itemContainer.appendChild(bottomSpacer);
}
function countdownStart() {
  countdown.textContent = 3;

  setTimeout(() => {
    countdown.textContent = 2;
  }, 1000);
  setTimeout(() => {
    countdown.textContent = 1;
  }, 2000);
  setTimeout(() => {
    countdown.textContent = "GO!";
  }, 3000);
}

function showCountDown() {
  splashPage.hidden = true;
  countdownPage.hidden = false;
  countdownStart();
  populateGamePage();
  setTimeout(showGamePage, 4000);
}

function selectQuestionAmount(e) {
  e.preventDefault();
  if (questionAmount) {
    showCountDown();
  }
}

startForm.addEventListener("click", () => {
  radioContainers.forEach((radio) => {
    if (radio.children[1].checked) {
      questionAmount = radio.children[1].value;
      radio.classList.add("selected-label");
    } else {
      radio.classList.remove("selected-label");
    }
  });
});

function playAgain() {
  scorePage.hidden = true;
  splashPage.hidden = false;
  gamePage.addEventListener("click", startTimer);
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
}

startForm.addEventListener("submit", selectQuestionAmount);
gamePage.addEventListener("click", startTimer);
playAgainBtn.addEventListener("click", playAgain);

getSavedBestScores();
