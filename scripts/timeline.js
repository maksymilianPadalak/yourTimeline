const complementText = document.getElementById("complement-text");
const getComplementButton = document.getElementById("complement-button");
let complementIndex = 0;
getComplementButton.addEventListener("click", () => {
  complementText.textContent = complementsList[complementIndex];
  if (complementIndex <= 2) {
    complementIndex += 1;
  } else {
    complementIndex = 0;
  }
});

const complementsList = [
  "Niezła z Ciebie foka",
  "Do perfekcji brakuje Ci tylko majonezu",
  "Ładnie wyglądasz jak się opierdalasz w pracy",
  "Jesteś tak piękna jak choinki w mojej kuchni",
  "Cudownie wyglądasz jak zwalniasz ludzi",
];
