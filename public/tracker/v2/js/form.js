const minutesChoice = document.getElementById("minutesChoice");
const customMinutes = document.getElementById("customMinutes");
const minutesInput = document.getElementById("minutes");
const hobbyForm = document.getElementById("hobbyForm");

minutesChoice.addEventListener("change", () => {
  const isCustom = minutesChoice.value === "custom";
  customMinutes.hidden = !isCustom;
  customMinutes.required = isCustom;

  if (!isCustom) {
    customMinutes.value = "";
    minutesInput.value = minutesChoice.value;
  } else {
    minutesInput.value = "";
    customMinutes.focus();
  }
});

customMinutes.addEventListener("input", () => {
  minutesInput.value = customMinutes.value;
});

hobbyForm.addEventListener("submit", (event) => {
  const selectedMinutes = minutesChoice.value === "custom"
    ? customMinutes.value
    : minutesChoice.value;

  if (!selectedMinutes || !Number.isInteger(Number(selectedMinutes)) ||
      Number(selectedMinutes) <= 0) {
    event.preventDefault();
    alert("Enter a valid number of minutes.");
    return;
  }

  minutesInput.value = selectedMinutes;
});

document.getElementById("clearButton").addEventListener("click", async () => {
  const response = await fetch("/tracker/v2/clear", { method: "DELETE" });

  if (response.ok) {
    // The form contains no displayed entry data; reload it in a clean state.
    window.location.reload();
  }
});
