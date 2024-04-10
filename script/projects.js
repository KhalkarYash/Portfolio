let courseAttainment = document.querySelector(".courseAttainment");
let recommendationSystem = document.querySelector(".recommendationSystem");
let bloggingSite = document.querySelector(".bloggingSite");
let todoList = document.querySelector(".todoList");
let instagramClone = document.querySelector(".instagramClone");
let TicTacToe = document.querySelector(".TicTacToe");
let courseAttainmentCross = document.querySelector(".courseAttainmentCross");
let recommendationSystemCross = document.querySelector(
  ".recommendationSystemCross"
);
let bloggingSiteCross = document.querySelector(".bloggingSiteCross");
let todoListCross = document.querySelector(".todoListCross");
let instagramCloneCross = document.querySelector(".instagramCloneCross");
let TicTacToeCross = document.querySelector(".TicTacToeCross");
let courseAttainmentData = document.querySelector(".courseAttainmentData");
let recommendationSystemData = document.querySelector(
  ".recommendationSystemData"
);
let bloggingSiteData = document.querySelector(".bloggingSiteData");
let todoListData = document.querySelector(".todoListData");
let instagramCloneData = document.querySelector(".instagramCloneData");
let TicTacToeData = document.querySelector(".TicTacToeData");
console.log(courseAttainment);
courseAttainment.addEventListener("click", () => {
  courseAttainmentData.style.visibility = "visible";
});
courseAttainmentCross.addEventListener("click", () => {
  courseAttainmentData.style.visibility = "hidden";
});
recommendationSystem.addEventListener("click", () => {
  recommendationSystemData.style.visibility = "visible";
});
recommendationSystemCross.addEventListener("click", () => {
  recommendationSystemData.style.visibility = "hidden";
});
bloggingSite.addEventListener("click", () => {
  bloggingSiteData.style.visibility = "visible";
});
bloggingSiteCross.addEventListener("click", () => {
  bloggingSiteData.style.visibility = "hidden";
});
todoList.addEventListener("click", () => {
  todoListData.style.visibility = "visible";
});
todoListCross.addEventListener("click", () => {
  todoListData.style.visibility = "hidden";
});
instagramClone.addEventListener("click", () => {
  instagramCloneData.style.visibility = "visible";
});
instagramCloneCross.addEventListener("click", () => {
  instagramCloneData.style.visibility = "hidden";
});
TicTacToe.addEventListener("click", () => {
  TicTacToeData.style.visibility = "visible";
});
TicTacToeCross.addEventListener("click", () => {
  TicTacToeData.style.visibility = "hidden";
});

courseAttainment.style.visibility = "hidden";
recommendationSystem.style.visibility = "hidden";
bloggingSite.style.visibility = "hidden";
todoList.style.visibility = "hidden";
TicTacToe.style.visibility = "hidden";
instagramClone.style.visibility = "hidden";

setTimeout(() => {
  courseAttainment.style.visibility = "visible";
  courseAttainment.style.opacity = "1";
}, 1000);
setTimeout(() => {
  recommendationSystem.style.visibility = "visible";
  recommendationSystem.style.opacity = "1";
}, 2000);
setTimeout(() => {
  bloggingSite.style.visibility = "visible";
  bloggingSite.style.opacity = "1";
}, 3000);
setTimeout(() => {
  todoList.style.visibility = "visible";
  todoList.style.opacity = "1";
}, 4000);
setTimeout(() => {
  instagramClone.style.visibility = "visible";
  instagramClone.style.opacity = "1";
}, 5000);
setTimeout(() => {
  TicTacToe.style.visibility = "visible";
  TicTacToe.style.opacity = "1";
}, 6000);
