// ----------------------------
// 🗂️ Global Variables
// ----------------------------
let countryLists = [];
let currentQuestionIndex;
let selectedCountries = [];
let userScore = 0;
let timer;
let isRununing = false;
let internalId;
let counter = 1;

// ----------------------------
//   Initialize LocalStorage
// ----------------------------
window.addEventListener("load", function () {
  if (!JSON.parse(localStorage.getItem("allGames"))) {
    localStorage.setItem("allGames", JSON.stringify([]));
  }
  if (!JSON.parse(localStorage.getItem("users"))) {
    localStorage.setItem("users", JSON.stringify([]));
  }
});
let activeUser = getLocalStorage("activeUser");

if (!activeUser || activeUser.length === 0) {
  alert("No active user found, redirecting to login...");
  window.location.href = "login.html";
}

// ----------------------------
//  Fetch All Countries from REST API
// ----------------------------
async function getData() {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=cca2,name,capital,population,flags"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error", error);
    return [];
  }
}

// ----------------------------
//  Random Country Selection Helper
// ----------------------------
function getRandomCountries(countries, counter) {
  const newList = [...countries].sort(() => 0.5 - Math.random());
  return newList.slice(0, counter);
}

// ----------------------------
// 🇺🇳 Get Countries Based on Game Mode (Easy / Medium / Hard)
// ----------------------------
async function getCountry() {
  const countries = await getData();
  const gameModList = getLocalStorage("gameMod");

  if (!gameModList || gameModList.length === 0) {
    console.log("Game mode not found.");
    return;
  }

  if (!countries || countries.length === 0) {
    console.log("Country data could not be retrieved.");
    return;
  }

  const currentGameMod = gameModList[0];
  let filteredCountries;

  // Filter countries based on population and difficulty
  if (currentGameMod.mod === "easy") {
    filteredCountries = countries.filter(
      (country) => country.population > 50000000
    );
  } else if (currentGameMod.mod === "middle") {
    filteredCountries = countries.filter(
      (country) =>
        country.population <= 50000000 && country.population >= 15000000
    );
  } else if (currentGameMod.mod === "hard") {
    filteredCountries = countries.filter(
      (country) => country.population <= 15000000
    );
  } else {
    console.log("Invalid game mode:", currentGameMod.mod);
    return;
  }

  console.log(filteredCountries.length);

  // Select 10 random countries from filtered list
  const randomCountries = getRandomCountries(filteredCountries, 10);
  console.log("Random 10 countries:");
  randomCountries.forEach((country, index) => {
    console.log(
      `${index + 1}. ${country.name.common} - Population: ${country.population}`
    );
  });

  // Prepare country data and store in localStorage
  const gameQuestions = randomCountries.forEach((element) => {
    if (element.capital === null) {
      element.capital = "capital unknown";
    }

    let countries = {
      id: element.cca2,
      name: element.name.common,
      png: element.flags.png,
      capital: element.capital[0],
      population: element.population,
    };

    let countriesList = getLocalStorage("countryLists");
    countryLists.push(countries);
    setLocalStorage("countryLists", countryLists);
  });
}

// ----------------------------
//  Back Button (Return to Main Page)
// ----------------------------
const back = document.getElementById("back");
back.addEventListener("click", function () {
  const confirmMesage = confirm("Are you sure you want to exit the game?");
  if (confirmMesage === true) {
    localStorage.removeItem("gameMod");
    localStorage.removeItem("countryLists");
    localStorage.removeItem("currentGame");
    window.location.href = "/main.html";
  }
});

// ----------------------------
//  Start the Game
// ----------------------------
function startGame() {
  selectedCountries = getLocalStorage("countryLists");
  isRununing = true;
  currentQuestionIndex = 0;
  userScore = 0;
  question(currentQuestionIndex);
  checkAnswer(currentQuestionIndex);
}

// ----------------------------
//  Display Question (Flag)
// ----------------------------
function question(index) {
  let currentCountry = selectedCountries[index];
  const flag = document.getElementById("flag");
  flag.src = currentCountry.png;
}

// ----------------------------
//  Check and Evaluate Answers
// ----------------------------
const control = document.getElementById("control");
const modal_cantainer = document.getElementById("modal_container");
const next = document.getElementById("next");

control.addEventListener("click", function () {
  const score = checkAnswer(currentQuestionIndex);
  modal_cantainer.classList.add("show");
  if (currentQuestionIndex === 9) {
    next.textContent = "Finish Game";
  } else {
    next.textContent = "Next Question";
  }
});

function checkAnswer(index) {
  let currentCountry = selectedCountries[index];
  const countryName = document.getElementById("countryName").value;
  const countryCapital = document.getElementById("countryCapital").value;
  const countryPopulation = document.getElementById("countryPopulation").value;
  const scoreText = document.getElementById("score");
  const answerName = document.getElementById("answer-name");
  const answerCapital = document.getElementById("answer-capital");
  const answerPopulation = document.getElementById("answer-population");

  answerName.style.color = "";
  answerCapital.style.color = "";
  answerPopulation.style.color = "";

  // --- Check Country Name ---
  if (
    countryName.toLowerCase().trim() == currentCountry.name.toLowerCase().trim()
  ) {
    userScore += 15;
    answerName.style.color = "green";
    answerName.value = `${currentCountry.name}`;
  } else {
    answerName.style.color = "red";
    answerName.value = `${currentCountry.name}`;
  }

  // --- Check Capital ---
  if (
    countryCapital.toLowerCase().trim() ==
    currentCountry.capital.toLowerCase().trim()
  ) {
    userScore += 15;
    answerCapital.style.color = "green";
    answerCapital.value = `${currentCountry.capital}`;
  } else {
    answerCapital.style.color = "red";
    answerCapital.value = `${currentCountry.capital}`;
  }

  // --- Check Population ---
  const userPopulation = parseInt(countryPopulation.replace(/,/g, ""));
  let populationScore = 0;

  if (!isNaN(userPopulation) && userPopulation > 0) {
    populationScore = checkPopulation(
      userPopulation,
      currentCountry.population
    );

    if (populationScore > 0) {
      answerPopulation.style.color = "green";
    } else {
      answerPopulation.style.color = "red";
    }
  } else {
    answerPopulation.style.color = "red";
    populationScore = 0;
  }

  const difference = Math.abs(userPopulation - currentCountry.population);
  if (!isNaN(userPopulation) && userPopulation > 0) {
    answerPopulation.value = `${currentCountry.population.toLocaleString()} (Fark: ${difference.toLocaleString()})`;
  } else {
    answerPopulation.value = `${currentCountry.population.toLocaleString()}`;
  }

  scoreText.innerText = ` Score: ${userScore}`;

  // Clear input fields after each question
  countryName.value = "";
  countryCapital.value = "";
  countryPopulation.value = "";

  // --- Save game score after last question ---
  if (index === 9) {
    const currentUser = getLocalStorage("activeUser")[0];
    const gameMod = getLocalStorage("gameMod")[0];
    const allGames = getLocalStorage("allGames") || [];

    let gameScore = {
      gameId: idGenerator(),
      userId: currentUser.id,
      userName: currentUser.userName,
      score: userScore,
      date: new Date().toISOString(),
      gameMode: gameMod.mod,
    };

    allGames.push(gameScore);
    setLocalStorage("allGames", allGames);
    updateUserMaxScore(currentUser.id, userScore);
  }
}

// ----------------------------
//  Check Population Accuracy by Difficulty
// ----------------------------
function checkPopulation(userPopulation, population) {
  const modData = getLocalStorage("gameMod");
  const mod = modData[0].mod;

  if (isNaN(userPopulation) || userPopulation <= 0) {
    return 0;
  }

  let scoreToAdd = 0;
  const difference = Math.abs(userPopulation - population);

  switch (mod) {
    case "easy":
      if (difference <= 1000000) {
        scoreToAdd = 15;
      } else if (difference <= 2000000) {
        scoreToAdd = 10;
      } else if (difference <= 3000000) {
        scoreToAdd = 5;
      }
      break;

    case "middle":
      if (difference <= 500000) {
        scoreToAdd = 15;
      } else if (difference <= 1000000) {
        scoreToAdd = 10;
      } else if (difference <= 1500000) {
        scoreToAdd = 5;
      }
      break;

    case "hard":
      if (difference <= 250000) {
        scoreToAdd = 15;
      } else if (difference <= 500000) {
        scoreToAdd = 10;
      } else if (difference <= 750000) {
        scoreToAdd = 5;
      }
      break;

    default:
      console.log("Unknown game mode:", mod);
      break;
  }

  userScore += scoreToAdd;
  return scoreToAdd;
}

// ----------------------------
//  Update User Max Score
// ----------------------------
function updateUserMaxScore(userId, newScore) {
  const users = getLocalStorage("users");
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex !== -1 && newScore > users[userIndex].maxScore) {
    users[userIndex].maxScore = newScore;
    setLocalStorage("users", users);
    console.log(`new max score: ${newScore}`);
  }
}

// ----------------------------
//  Finish Game Modal and Navigation
// ----------------------------
const modal_finish = document.getElementById("modal-finish");
const close = document.getElementById("close");
close.addEventListener("click", function () {
  window.location.replace("main.html");
});

// ----------------------------
//  Next Question or Finish Game
// ----------------------------
next.addEventListener("click", function nextQuestion() {
  const counterText = document.getElementById("progress");
  const endScore = document.getElementById("score2");
  const greeting = document.getElementById("greeting");

  if (next.textContent === "Finish Game") {
    modal_finish.classList.add("shows");
    if (userScore >= 300) {
      greeting.innerText = "Perfect";
    } else if (userScore < 300 && userScore >= 150) {
      greeting.innerText = "Good Job";
    } else {
      greeting.innerText = "Good Try";
    }
    endScore.innerText = `Score : ${userScore}`;
    modal_cantainer.classList.remove("show");
    return;
  }
  modal_cantainer.classList.remove("show");

  if (currentQuestionIndex < 9) {
    currentQuestionIndex++;
    counter++;

    if (counter === 1) {
      counterText.innerText = `${counter}st Question`;
    } else if (counter === 2) {
      counterText.innerText = `${counter}nd Question`;
    } else if (counter === 3) {
      counterText.innerText = `${counter}rd Question`;
    } else if (counter >= 4 && counter <= 10) {
      counterText.innerText = `${counter}th Question`;
    }

    question(currentQuestionIndex);
  }
});

// ----------------------------
//  Initialize Game on Page Load
// ----------------------------
async function starter() {
  await getCountry();
  await startGame();
}
starter();

// ----------------------------
//  Play Again / Scoreboard / Logout
// ----------------------------
const playAgain = document.getElementById("play-again");
const scoreboard = document.getElementById("scoreboard");
const logout = document.getElementById("logout");

logout.addEventListener("click", function () {
  localStorage.removeItem("activeUser");
  location.replace("/login.html");
});

scoreboard.addEventListener("click", function () {
  window.location.href = "/scoreborad.html";
});

playAgain.addEventListener("click", function () {
  location.reload();
});
