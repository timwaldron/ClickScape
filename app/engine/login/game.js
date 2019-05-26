const loginEventListeners = () => {
  let loginButton = document.querySelector("#login-button");
  
  loginButton.addEventListener("click", function (event) {
    console.log("Moved to main page");
    window.location.href = "../views/main/main.html";
  });
}