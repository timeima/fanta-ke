/**
 * Fanta Spin to Win Game
 * OOP Implementation with Probability and Sound
 */

class FantaWheel {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`Canvas with id ${canvasId} not found.`);
      return;
    }
    this.ctx = this.canvas.getContext("2d");
    this.spinBtn = document.getElementById(options.spinBtnId || "spin-button");

    // Configuration
    this.prizes =
      options.prizes || (typeof PRIZES !== "undefined" ? PRIZES : []);

    // Fallback if PRIZES is not loaded
    if (this.prizes.length === 0) {
      this.prizes = [
        {
          id: "iphone17",
          shortName: "iPhone 17",
          color: "#FFD700",
          text: "#000",
          probability: 0.1,
          image: "assets/prizes/iphone17.png",
        },
        // ... other fallbacks if needed ...
      ];
    }

    this.numPrizes = this.prizes.length;
    this.arcSize = (2 * Math.PI) / this.numPrizes;
    this.isSpinning = false;
    this.logoImage = null;
    this.prizeImages = {};

    // Preload prize images
    this.prizes.forEach((prize) => {
      if (prize.image) {
        const img = new Image();
        img.src = prize.image;
        img.onload = () => this.drawWheel(); // Redraw when any image loads
        this.prizeImages[prize.id] = img;
      }
    });

    // Callbacks
    this.onWin = options.onWin || ((prize) => console.log("Won:", prize));
    this.onTryAgain = options.onTryAgain || (() => console.log("Try again"));

    // Sound Setup
    this.sounds = {
      spin: new Audio(
        "https://assets.mixkit.co/active_storage/sfx/2004/2004-preview.mp3"
      ),
      win: new Audio(
        "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3"
      ),
      fail: new Audio(
        "https://assets.mixkit.co/active_storage/sfx/255/255-preview.mp3"
      ),
    };

    // Adjust volumes
    if (this.sounds.spin) this.sounds.spin.volume = 0.5;

    this.init();
  }

  init() {
    this.drawWheel();

    // Set initial rotation so the top pointer lands on a line between sections
    // The pointer is at -90 degrees (top).
    // We rotate the wheel so a line between slices is at the top.
    const initialRotation = -this.arcSize / 2;
    this.canvas.style.transform = `rotate(${initialRotation}rad)`;

    if (this.spinBtn) {
      this.spinBtn.addEventListener("click", () => this.spin());
    }
  }

  drawWheel() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = this.canvas.width / 2 - 10;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.prizes.forEach((prize, i) => {
      const angle = i * this.arcSize;

      // Draw slice
      this.ctx.beginPath();
      this.ctx.fillStyle = prize.color;
      this.ctx.moveTo(centerX, centerY);
      this.ctx.arc(centerX, centerY, radius, angle, angle + this.arcSize);
      this.ctx.lineTo(centerX, centerY);
      this.ctx.fill();
      this.ctx.strokeStyle = "#fff";
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Draw prize image
      this.ctx.save();
      this.ctx.translate(centerX, centerY);
      this.ctx.rotate(angle + this.arcSize / 2);

      const pImg = this.prizeImages[prize.id];
      if (pImg && pImg.complete && pImg.naturalHeight !== 0) {
        const imgSize = 65; // Larger images
        this.ctx.drawImage(pImg, radius - 110, -imgSize / 2, imgSize, imgSize);
      }

      // Draw curved text
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillStyle = prize.text;
      this.ctx.font = "bold 14px Poppins";

      const text = prize.shortName;
      const textRadius = radius - 30; // Position text near the outer edge
      const characters = text.split("");

      // Calculate angular spacing based on text length to keep it centered
      const charSpacing = 0.07; // Radians between each character
      const totalTextAngle = (characters.length - 1) * charSpacing;

      this.ctx.rotate(-totalTextAngle / 2); // Start at the beginning of the text block

      characters.forEach((char) => {
        this.ctx.save();
        this.ctx.translate(textRadius, 0);
        this.ctx.rotate(Math.PI / 2); // Rotate character to face the center
        this.ctx.fillText(char, 0, 0);
        this.ctx.restore();
        this.ctx.rotate(charSpacing);
      });

      this.ctx.restore();
    });

    // Draw center circle decoration
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
    this.ctx.fillStyle = "#fff";
    this.ctx.fill();
    this.ctx.strokeStyle = "#FF6600";
    this.ctx.lineWidth = 5;
    this.ctx.stroke();

    // Draw logo in center
    if (!this.logoImage) {
      this.logoImage = new Image();
      this.logoImage.src = "assets/logo.png";
      this.logoImage.onload = () => {
        this.drawWheel(); // Redraw when image loads
      };
    }

    if (
      this.logoImage &&
      this.logoImage.complete &&
      this.logoImage.naturalHeight !== 0
    ) {
      // Draw logo image centered
      const logoSize = 50;
      const logoX = centerX - logoSize / 2;
      const logoY = centerY - logoSize / 2;
      this.ctx.drawImage(this.logoImage, logoX, logoY, logoSize, logoSize);
    }
  }

  getWinningIndexByProbability() {
    const random = Math.random();
    let cumulativeProbability = 0;

    for (let i = 0; i < this.prizes.length; i++) {
      cumulativeProbability += this.prizes[i].probability;
      if (random < cumulativeProbability) {
        return i;
      }
    }
    return this.prizes.length - 1; // Fallback
  }

  spin() {
    if (this.isSpinning) return;

    this.isSpinning = true;
    if (this.spinBtn) this.spinBtn.disabled = true;

    // Play spin sound
    if (this.sounds.spin) {
      this.sounds.spin.currentTime = 0;
      this.sounds.spin
        .play()
        .catch((e) => console.log("Sound blocked by browser"));
    }

    const winningIndex = this.getWinningIndexByProbability();

    const extraRotations = 5 + Math.floor(Math.random() * 5);
    // 1. Calculate a random offset within the slice for the initial stop
    // We leave a 5% margin on edges so it doesn't land exactly on the line
    const margin = this.arcSize * 0.05;
    const randomOffset = margin + Math.random() * (this.arcSize - 2 * margin);
    const centerOffset = this.arcSize / 2;

    // Rotation to the random spot
    const rotationToRandom =
      extraRotations * 2 * Math.PI +
      (this.numPrizes - winningIndex) * this.arcSize -
      Math.PI / 2 -
      randomOffset;

    // Rotation to the exact center for the "settle"
    const rotationToCenter =
      extraRotations * 2 * Math.PI +
      (this.numPrizes - winningIndex) * this.arcSize -
      Math.PI / 2 -
      centerOffset;

    // Phase 1: Main fast spin to a random spot
    this.canvas.style.transition =
      "transform 5s cubic-bezier(0.15, 0, 0.15, 1)";
    this.canvas.style.transform = `rotate(${rotationToRandom}rad)`;

    // Phase 2: After the main spin, slowly "settle" into the middle of the notch
    setTimeout(() => {
      this.canvas.style.transition = "transform 1.2s ease-out";
      this.canvas.style.transform = `rotate(${rotationToCenter}rad)`;

      // Final callback after the settle completes
      setTimeout(() => {
        this.isSpinning = false;
        const prize = this.prizes[winningIndex];

        if (prize.id === "tryagain") {
          if (this.sounds.fail) this.sounds.fail.play();
          this.onTryAgain();

          // Reset wheel position for next spin without visible jump
          setTimeout(() => {
            this.canvas.style.transition = "none";
            this.canvas.style.transform = `rotate(${rotationToCenter % (2 * Math.PI)}rad)`;
            if (this.spinBtn) this.spinBtn.disabled = false;
          }, 100);
        } else {
          if (this.sounds.win) this.sounds.win.play();
          this.onWin(prize);
        }
      }, 1300); // Wait for the settle animation to finish
    }, 5000); // Wait for the main spin to finish
  }
}
