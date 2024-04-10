let name = document.querySelector(".name");
let mainText = document.querySelector(".mainText");
document.addEventListener("DOMContentLoaded", () => {
  setInterval(() => {
    setTimeout(function () {
      name.style.visibility = "visible";
      name.style.opacity = "1";
    }, 1000);
    setTimeout(function () {
      name.style.visibility = "hidden";
      name.style.opacity = "0";
    }, 2000);
    setTimeout(function () {
      name.style.visibility = "visible";
      name.style.opacity = "1";
    }, 3000);
  }, 500);
});
