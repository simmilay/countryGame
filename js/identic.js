function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function setLocalStorage(key, value) {
  return  localStorage.setItem(key, JSON.stringify(value));
}
