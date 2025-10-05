function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function setLocalStorage(key, value) {
  return  localStorage.setItem(key, JSON.stringify(value));
}

function idGenerator() {
    const newId =
      Date.now() + Math.floor(Math.random() * 100250 + 10000) + 25978;
    let user = getLocalStorage("users");
    let game = getLocalStorage("allGame");
    const idCheck = user.find((element) => element.id === newId);
    const gameIdCheck = game.find((element) => element.gameId === gameId);
    
    if (idCheck || gameIdCheck) {
      return idGenerator();
    }
    return newId;
  }