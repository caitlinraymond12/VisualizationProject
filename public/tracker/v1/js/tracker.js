const form = document.getElementById("hobbyForm");
const message = document.getElementById("message");
const entries = document.getElementById("entries");
const clearButton = document.getElementById("clearButton");

// Display saved entries
async function loadEntries() {
    const response = await fetch("/tracker/v1/data");
    const hobbies = await response.json();

    entries.innerHTML = "";

    hobbies.forEach(entry => {
        const p = document.createElement("p");

        p.textContent =
            `${entry.hobby}: ${entry.minutes} minutes - ${entry.dayOfWeek}`;

        entries.appendChild(p);
    });
}

// Submit a new entry
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const response = await fetch("/tracker/v1/form", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(formData)
    });

    if (response.ok) {
        message.textContent = "Entry saved!";
        form.reset();
        loadEntries();
    } else {
        message.textContent = "Invalid entry.";
    }
});

// Clear all entries
clearButton.addEventListener("click", async () => {
    const response = await fetch("/tracker/v1/clear", {
        method: "DELETE"
    });

    if (response.ok) {
        message.textContent = "Data cleared.";
        loadEntries();
    }
});

// Load entries when page opens
loadEntries();