const hobbies = [
    "Reading",
    "Rock Climbing",
    "Gym",
    "Scrolling",
    "Being With Friends",
    "Video Games"
];

const colors = {
    "Reading": "red",
    "Rock Climbing": "blue",
    "Gym": "green",
    "Scrolling": "grey",
    "Being With Friends": "yellow",
    "Video Games": "purple"
};

const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
];

async function createDashboard() {

    const response = await fetch("/tracker/v1/data");
    const data = await response.json();

    // Calculate total minutes per hobby
    const hobbyTotals = hobbies.map(hobby => {
        return data
            .filter(entry => entry.hobby === hobby)
            .reduce((total, entry) => total + entry.minutes, 0);
    });

    // Chart 1: Stacked bar chart
    const dailyDatasets = hobbies.map(hobby => ({
        label: hobby,
        data: days.map(day => {
            return data
                .filter(entry =>
                    entry.hobby === hobby &&
                    entry.dayOfWeek === day
                )
                .reduce((total, entry) => total + entry.minutes, 0);
        }),
        backgroundColor: colors[hobby]
    }));

    new Chart(document.getElementById("dailyChart"), {
        type: "bar",
        data: {
            labels: days,
            datasets: dailyDatasets
        },
        options: {
            responsive: true,
            scales: {
                x: { stacked: true },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: "Minutes"
                    }
                }
            }
        }
    });

    // Chart 2: Doughnut chart
    new Chart(document.getElementById("hobbyChart"), {
        type: "doughnut",
        data: {
            labels: hobbies,
            datasets: [{
                data: hobbyTotals,
                backgroundColor: hobbies.map(hobby => colors[hobby])
            }]
        },
        options: {
            responsive: true
        }
    });

    // Create flower sketch
    createFlowers(data);
}

createDashboard();

// p5.js flower sketch
function createFlowers(data) {

    new p5((p) => {

        const flowers = [];

        // Create one flower per entry
        data.forEach((entry, index) => {

            flowers.push({
                x: 70 + (index % 6) * 90,
                y: 70 + Math.floor(index / 6) * 110,
                size: Math.min(50, Math.max(15, entry.minutes / 2)),
                color: colors[entry.hobby]
            });

        });

        p.setup = function() {
            const rows = Math.max(1, Math.ceil(flowers.length / 6));

            const canvas = p.createCanvas(
                600,
                rows * 110 + 20
            );

            canvas.parent("flowerSketch");
        };

        p.draw = function() {

            p.background(245, 245, 235);

            flowers.forEach(flower => {

                // Draw petals
                p.noStroke();
                p.fill(flower.color);

                for (let i = 0; i < 8; i++) {
                    const angle = (p.TWO_PI / 8) * i;

                    const x = flower.x + Math.cos(angle) * flower.size / 2;
                    const y = flower.y + Math.sin(angle) * flower.size / 2;

                    p.ellipse(
                        x,
                        y,
                        flower.size / 2,
                        flower.size / 2
                    );
                }

                // Draw flower center
                p.fill("orange");
                p.circle(
                    flower.x,
                    flower.y,
                    flower.size / 2
                );

                // Draw stem
                p.stroke("green");
                p.strokeWeight(3);
                p.line(
                    flower.x,
                    flower.y + flower.size / 2,
                    flower.x,
                    flower.y + flower.size
                );

            });

            p.noLoop();
        };

    });

}