window.addEventListener("load", function chekLocalStorage() {
  if (!JSON.parse(localStorage.getItem("users"))) {
    let temporaryListC = [];
    localStorage.setItem("users", JSON.stringify(temporaryListC));
  }
  if (!JSON.parse(localStorage.getItem("activeUser"))) {
    let temporaryListA = [];
    localStorage.setItem("activeUser", JSON.stringify(temporaryListA));
  }
});

const userName = document.getElementById("user-name");
const userPassword = document.getElementById("user-password");
const loginBtn = document.getElementById("login");
let p = document.getElementById("paragraf");
let p2 = document.getElementById("p2");

userName.addEventListener("click", function () {
  p.style.color = "black";
  p.innerText = "Username cannot contain spaces !";
});

loginBtn.addEventListener("click", function () {
  if (userName.value === "" || userPassword.value === "") {
    alert("enter your username or password");
  }

  if (!compare(userName.value)) {
    p2.innerText = "username or password is incorrect";
    return;
  } else {
    let myUser = getLocalStorage("users") || [];
    //find is not function diyor

    const active = myUser.find(
      (element) => element.userName === userName.value
    );

    const activeUser = {
      id: active.id,
      userName: active.userName,
      active_user: true,
    };

    let activeUserList = getLocalStorage("activeUser") || [];
    if (!Array.isArray(activeUserList)) activeUserList = [];
    activeUserList.push(activeUser);
    setLocalStorage("activeUser", activeUserList);
    window.location.href="/main.html"
  }
});

async function compare(name) {
  const user = getLocalStorage("users");

  const findUser = user.find((element) => element.userName === name);

  if (!findUser) return false;
  const password = findUser.userPassword;
  console.log("input:", userPassword.value);
  console.log("hashed:", password);

  const match = await bcrypt.compare(userPassword.value, password);
  return match;
}
