window.addEventListener("load", function () {
  if (!JSON.parse(localStorage.getItem("gameMod"))) {
    let temporaryListGame = [];
    localStorage.setItem("gameMod", JSON.stringify(temporaryListGame));
  }
  let activeUser = getLocalStorage("activeUser");

if (!activeUser || activeUser.length === 0) {
    console.log("No active user found, redirecting to login...");
    window.location.href = "login.html";
}
});

const logout = document.getElementById("logout");

logout.addEventListener("click", function () {
  localStorage.removeItem("activeUser");
  location.replace("/login.html");
});

const open = document.getElementById("play");
const modal_cantainer = document.getElementById("modal_container");
const close = document.getElementById("close");

open.addEventListener("click", function () {
  modal_cantainer.classList.add("show");
});

close.addEventListener("click", function () {
  modal_cantainer.classList.remove("show");
});
//local storage a hangi bilgileri kaydedeceğini araştır

function getGameMod(element) {
  let gmMod = element.getAttribute("id");

  let gameMod = {
    mod: gmMod,
  };
   
  const gameModList = getLocalStorage("gameMod");
  gameModList.push(gameMod);
  setLocalStorage("gameMod", gameModList);
  window.location.href = "/game.html";
}
