/*  REST Countries API'sinden tüm ülkeleri çek
Nüfusu 50 milyondan fazla olan ülkeleri filtrele
Bu ülkeleri alfabetik sıraya göre sırala
Sonuçları konsola yazdır */
let countryLists = [];

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

function getRandomCountries(countries, counter) {
  const newList = [...countries].sort(() => 0.5 - Math.random());
  return newList.slice(0, counter);
}

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

  const sortedCountries = filteredCountries.sort((a, b) =>
    a.name.common.localeCompare(b.name.common)
  );

  const randomCountries = getRandomCountries(filteredCountries, 10);
  console.log("Random 10 countries:");
  randomCountries.forEach((country, index) => {
    console.log(
      `${index + 1}. ${country.name.common} - Population: ${country.population}`
    );
  });

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

const back = document.getElementById("back");
back.addEventListener("click", function () {
  localStorage.removeItem("gameMod");
  localStorage.removeItem("undefined");
  localStorage.removeItem("countryLists");
  window.location.href = "/main.html";
});

//Game Will Start
let currentQuestionIndex;
let selectedCountries = [];
let userScore = 0;
let timer;
let counter = 1;

function startGame() {
  selectedCountries = getLocalStorage("countryLists");

  currentQuestionIndex = 0;
  userScore = 0;
  question(currentQuestionIndex);
  checkAnswer(currentQuestionIndex);
}

function question(index) {
  let currentCountry = selectedCountries[index];
  const flag = document.getElementById("flag");
  flag.src = currentCountry.png;
}

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

  const userPopulation = parseInt(countryPopulation);
  if (!isNaN(userPopulation)) {
    checkPopulation(userPopulation, currentCountry.population);
    answerPopulation.style.color = "orange"; 
  } else {
    answerPopulation.style.color = "red";
  }
  answerPopulation.value = currentCountry.population.toLocaleString();
scoreText.innerText = `Score: ${userScore}`
}


function checkPopulation(userPopulation, population) {
  const modData = getLocalStorage("gameMod");
  const mod = modData[0].mod; 

  switch (mod) {
    case "easy":
      if (
        userPopulation >= population - 50000 &&
        userPopulation <= population + 50000
      ) {
        userScore += 15;
      } else if (
        userPopulation >= population - 100000 &&
        userPopulation <= population + 100000
      ) {
        userScore += 10;
      } else if (
        userPopulation >= population - 150000 &&
        userPopulation <= population + 150000
      ) {
        userScore += 5;
      }
      break;
    case "middle":
      if (
        userPopulation >= population - 500000 &&
        userPopulation <= population + 500000
      ) {
        userScore += 15;
      } else if (
        userPopulation >= population - 1000000 &&
        userPopulation <= population + 1000000
      ) {
        userScore += 10;
      } else if (
        userPopulation >= population - 1500000 &&
        userPopulation <= population + 1500000
      ) {
        userScore += 5;
      }
      break;
    case "hard":
      if (
        userPopulation >= population - 1000000 &&
        userPopulation <= population + 1000000
      ) {
        userScore += 15;
      } else if (
        userPopulation >= population - 1500000 &&
        userPopulation <= population + 1500000
      ) {
        userScore += 10;
      } else if (
        userPopulation >= population - 2000000 &&
        userPopulation <= population + 2000000
      ) {
        userScore += 5;
      }
      break;
    default:
      console.log("Unknown game mode:", mod);
      break;
  }
}
next.addEventListener("click", function nextQuestion() {
  const counterText = document.getElementById("progress");
  counterText.innerText = "";
  if (currentQuestionIndex <= 9) {
    currentQuestionIndex++;
    question(currentQuestionIndex);
  } else {
    finishGame();
  }
  /* counterText.innerText = `${counter}. Question`; 
  if(counter === 1 ){
    counterText.innerText = `${counter}st Question`;
    counter++;
  }else if(counter === 2){
    counterText.innerText = `${counter}nd Question`;
    counter++;

  }else if(counter === 3){
    counter.innerText = `${counter}rd Question`;
    counter++;

  }else if(counter <3 && counter<10 ){
    counter.innerText = `${counter}th Question`;
    counter++;
  } */
  modal_cantainer.classList.remove("show");
});

function finishGame() {
  //oyun bitirme modalı oluştur.
  console.log("game over");
}

async function starter() {
  await getCountry();
  await startGame();
}
starter();

//add event listener onksiyon adı ver timer mesela 30'dan başlayıp geri geri gidecek.
// Ve en son butona batrığında olan değer çarpı bir katsayı olacak
//ardında bu değer puana eklenecek .
