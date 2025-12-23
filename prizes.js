/**
 * Central Prizes Configuration
 */
const PRIZES = [
  {
    id: "iphone17",
    shortName: "iPhone 17",
    fullName: "iPhone 17 Pro Max - 256GB",
    image: "assets/prizes/iphone17.png",
    color: "#FFD700",
    text: "#000",
    probability: 0.1,
  },
  {
    id: "macbook",
    shortName: "Macbook",
    fullName: "Macbook Pro M3 - 14-inch",
    image: "assets/prizes/macbook.png",
    color: "#FF6600",
    text: "#fff",
    probability: 0.05,
  },
  {
    id: "tv",
    shortName: "Smart TV",
    fullName: 'Sony Bravia 55" Smart LED TV',
    image: "assets/prizes/tv.png",
    color: "#003087",
    text: "#fff",
    probability: 0.05,
  },
  {
    id: "washer",
    shortName: "Washer",
    fullName: "Samsung Front Load Washing Machine",
    image: "assets/prizes/washingmachine.png",
    color: "#003087",
    text: "#fff",
    probability: 0.05,
  },
  {
    id: "iwatch",
    shortName: "iWatch",
    fullName: "Apple Watch Series 9 GPS",
    image: "assets/prizes/applewatch.png",
    color: "#DC143C",
    text: "#fff",
    probability: 0.15,
  },
  {
    id: "tryagain",
    shortName: "Try Again",
    fullName: "Better luck next time!",
    image: null,
    color: "#555",
    text: "#fff",
    probability: 0.6,
  },
];

/**
 * Get prize by ID
 * @param {string} id
 * @returns {object|null}
 */
function getPrizeById(id) {
  return PRIZES.find((p) => p.id === id) || null;
}
