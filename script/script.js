const dateInput = document.querySelector('input[type= "date"]');
const searchBtn = document.querySelector("#search-btn");

dateInput.value = `${new Date().getFullYear()}-${`${
  new Date().getMonth() + 1
}`.padStart(2, "0")}-${`${new Date().getDate()}`.padStart(2, "0")}`;

searchBtn.addEventListener("click", () => {
  console.log(dateInput.value);
});
