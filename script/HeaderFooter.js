let onButtonClick = document.querySelector(".onButtonClick");
let mobileNavButton = document.querySelector(".mobileNavButton");
mobileNavButton.addEventListener("click", () => {
  onButtonClick.style.display = "flex";
  onButtonClick.style.color = "black";
  mobileNavButton.style.visibility = "hidden";
});

let crossBtn = document.querySelector(".crossBtn");
crossBtn.addEventListener("click", () => {
  onButtonClick.style.display = "none";
  mobileNavButton.style.visibility = "visible";
});

let mobLI = document.querySelector(".mobLI");
array.forEach((mobLI) => {
  mobLI.addEventListener("click", () => {
    onButtonClick.style.display = "none";
  });
});
