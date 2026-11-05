// One flower per hobby. More logged minutes produce a larger flower.
const flowerNames = [
  "Gym", "Rock Climbing", "Reading",
  "Scrolling", "Video Games", "Being With Friends"
];
const flowerPalette = [
  "#A9D6C8", "#F2B8A0", "#B8C5E8",
  "#F2D58A", "#C9B3DF", "#A9D8E8"
];

new p5((p) => {
  let totals = {};

  function updateTotals() {
    totals = window.hobbyFlowerTotals || {};
  }

  p.setup = () => {
    const holder = document.getElementById("flowerSketch");
    const canvas = p.createCanvas(Math.min(1000, holder.clientWidth - 4), 220);
    canvas.parent("flowerSketch");
    p.noLoop();
    updateTotals();
    p.redraw();
    window.addEventListener("hobby-data-loaded", () => {
      updateTotals();
      p.redraw();
    });
  };

  p.windowResized = () => {
    const holder = document.getElementById("flowerSketch");
    p.resizeCanvas(Math.max(280, Math.min(1000, holder.clientWidth - 4)), 220);
    p.redraw();
  };

  p.draw = () => {
    p.clear();
    p.stroke("#9ABDAA");
    p.strokeWeight(3);

    const spacing = p.width / (flowerNames.length + 1);
    const groundY = 185;

    p.line(12, groundY, p.width - 12, groundY);

    flowerNames.forEach((name, index) => {
      const x = spacing * (index + 1);
      const minutes = Number(totals[name] || 0);
      const growth = Math.min(1, minutes / 600);
      const stemHeight = 28 + growth * 65;
      const flowerSize = 7 + growth * 15;
      const flowerY = groundY - stemHeight;

      p.stroke("#83B49A");
      p.line(x, groundY, x, flowerY + 5);

      // Two simple leaves on each stem.
      p.noStroke();
      p.fill("#A9D6B8");
      p.ellipse(x - 7, groundY - stemHeight * 0.42, 13, 6);
      p.ellipse(x + 7, groundY - stemHeight * 0.62, 13, 6);

      p.fill(flowerPalette[index]);
      for (let petal = 0; petal < 8; petal++) {
        const angle = (p.TWO_PI * petal) / 8;
        p.ellipse(
          x + Math.cos(angle) * flowerSize * 0.65,
          flowerY + Math.sin(angle) * flowerSize * 0.65,
          flowerSize,
          flowerSize
        );
      }

      p.fill("#E9C96B");
      p.circle(x, flowerY, flowerSize * 0.8);

      p.fill("#405766");
      p.textAlign(p.CENTER);
      p.textSize(10);
      p.text(name, x, 207);
    });
  };
});
