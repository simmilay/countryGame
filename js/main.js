const logout = document.getElementById("logout");

logout.addEventListener("click", function () {
  localStorage.removeItem("activeUser");
  location.replace("/login.html");
});
