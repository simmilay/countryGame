    let temporaryListC = [];


/* if (!JSON.parse(localStorage.getItem("users"))) {
    localStorage.setItem("users", JSON.stringify(temporaryListC));  
} */
/* window.addEventListener("load", function chekLocalStorage() {
  if (!JSON.parse(localStorage.getItem("users"))) {
    let temporaryListC = [];
    localStorage.setItem("users", JSON.stringify(temporaryListC));
  }
}); */

const userName = document.getElementById("user-name");
const userPassword = document.getElementById("user-password");
const singupBtn = document.getElementById("sing-up");
let p = document.getElementById("paragraf");

/* function checkInformation(event) {
  console.log("bur"); 
  if (event.key === "Space") {
    console.log("buradasın");

    p.innerText = "Username cannot contain spaces";
  }
} */
userName.addEventListener("click", function () {
  p.style.color = "black";
  p.innerText = "Username cannot contain spaces !";
});

singupBtn.addEventListener("click", async function addUser() {
  if (userName.value === "") {
    alert("enter your username");
  }

  if (userPassword.value === "") {
    alert("enter your password");
    return;
  }

  if (!userGenerator(userName.value)) {
    return;
  }

  function idGenerator() {
    const newId =  Date.now() + Math.floor(Math.random() * 100250 + 10000) + 25978;
    let user = getLocalStorage("users");
    const idCheck = user.find((element) => element.id === newId);
    if(idCheck){
      return idGenerator();
    }
    return newId;
  }

  const hashPass = await bcrypt.hash(userPassword.value, 10);
  console.log(hashPass);

  const newUser = {
    id: idGenerator(),
    userName: userName.value,
    userPassword: hashPass,
    max_point: null,
  };

   let user = getLocalStorage("users") || [];
   if (!Array.isArray(user)) user  = [];

  user.push(newUser);

  setLocalStorage("users", user);

  userName.value = "";
  userPassword.value = "";
  alert("Registration completed successfully");
  window.location.href = "/login.html";
});

function userGenerator(userName) {
  let user = getLocalStorage("users");
  console.log(typeof user, "user");

  const checkUserName = user.find((element) => element.userName === userName);
  console.log(checkUserName);

  if (checkUserName) {
    const p = document.getElementById("paragraf");
    p.innerText = "This username is being used by someone else ! ";
    p.style.color = "red";
    return false;
  } else {
    return true;
  }
}
