const hobbies = [
  "Gym",
  "Rock Climbing",
  "Reading",
  "Scrolling",
  "Video Games",
  "Being With Friends"
];

const days = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday"
];

const hobbyColors = {
  "Gym": "#A9D6C8",
  "Rock Climbing": "#F2B8A0",
  "Reading": "#B8C5E8",
  "Scrolling": "#F2D58A",
  "Video Games": "#C9B3DF",
  "Being With Friends": "#A9D8E8"
};

let hobbyTotals = Object.fromEntries(hobbies.map(hobby => [hobby, 0]));

async function loadDashboard() {
  const response = await fetch("/tracker/v2/data");

  if (!response.ok) {
    throw new Error("Could not load hobby data.");
  }

  const entries = await response.json();
  const dailyTotals = Object.fromEntries(
    days.map(day => [day, Object.fromEntries(hobbies.map(hobby => [hobby, 0]))])
  );

  hobbyTotals = Object.fromEntries(hobbies.map(hobby => [hobby, 0]));

  entries.forEach(entry => {
    if (!hobbies.includes(entry.hobby) || !days.includes(entry.dayOfWeek)) return;

    const minutes = Number(entry.minutes);
    if (!Number.isFinite(minutes) || minutes <= 0) return;

    dailyTotals[entry.dayOfWeek][entry.hobby] += minutes;
    hobbyTotals[entry.hobby] += minutes;
  });

  createDailyChart(dailyTotals);
  createTotalChart();
  window.hobbyFlowerTotals = hobbyTotals;

  // Notify the p5 sketch after its page script has initialized.
  window.dispatchEvent(new Event("hobby-data-loaded"));
}

function createDailyChart(dailyTotals) {
  const datasets = hobbies.map(hobby => ({
    label: hobby,
    data: days.map(day => dailyTotals[day][hobby]),
    backgroundColor: hobbyColors[hobby],
    borderWidth: 0
  }));

  new Chart(document.getElementById("dailyChart"), {
    type: "bar",
    data: { labels: days, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: "Minutes Per Day" },
        legend: { position: "bottom" }
      },
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true, title: { display: true, text: "Minutes" } }
      }
    }
  });
}

function createTotalChart() {
  new Chart(document.getElementById("totalChart"), {
    type: "doughnut",
    data: {
      labels: hobbies,
      datasets: [{
        data: hobbies.map(hobby => hobbyTotals[hobby]),
        backgroundColor: hobbies.map(hobby => hobbyColors[hobby]),
        borderWidth: 1,
        borderColor: "#ffffff"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: "Minutes Per Hobby" },
        legend: { position: "bottom" }
      }
    }
  });
}

loadDashboard().catch(error => console.error(error));
