/**
 * Social Proof Notifications System
 */

(function () {
  const winnerNames = [
    "Sarah Johnson",
    "Miguel Rodriguez",
    "Emma Chen",
    "Ahmed Hassan",
    "Maria Silva",
    "James Wilson",
    "Priya Patel",
    "Luca Rossi",
    "Anna Kowalski",
    "Carlos Mendoza",
    "Yuki Tanaka",
    "David Kim",
    "Isabella Morales",
    "Mohammed Al-Rashid",
    "Sophie Dubois",
    "Oliver Smith",
    "Elena Popa",
    "Hans Weber",
    "Fatima Zahra",
    "Choi Min-ho",
    "Anita Kumar",
    "George Brown",
    "Chloe Martin",
  ];

  const prizesList =
    typeof PRIZES !== "undefined"
      ? PRIZES.filter((p) => p.id !== "tryagain")
      : [
          { shortName: "iPhone 17", image: "assets/prizes/iphone17.png" },
          { shortName: "Macbook", image: "assets/prizes/macbook.png" },
          { shortName: "Smart TV", image: "assets/prizes/tv.png" },
          { shortName: "Washer", image: "assets/prizes/washingmachine.png" },
          { shortName: "iWatch", image: "assets/prizes/applewatch.png" },
        ];

  const timePhrases = [
    "2m ago",
    "5m ago",
    "8m ago",
    "12m ago",
    "15m ago",
    "18m ago",
    "22m ago",
    "25m ago",
    "just now",
    "1m ago",
    "4m ago",
  ];

  let container;
  let isVisible = false;
  let hideTimeout;

  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  function init() {
    container = document.createElement("div");
    container.className = "social-proof-container";
    container.innerHTML = `
            <div class="winner-avatar">
                <img src="" alt="Prize" id="sp-avatar" style="object-fit: contain; padding: 2px;">
            </div>
            <div class="winner-info">
                <div>
                    <span class="winner-name" id="sp-name"></span>
                    <span class="winner-time" id="sp-time"></span>
                </div>
                <span class="winner-prize" id="sp-prize"></span>
            </div>
            <div class="country-tag" id="sp-flag"></div>
            <div class="sp-close" id="sp-close">&times;</div>
        `;
    document.body.appendChild(container);

    document.getElementById("sp-close").onclick = hideNotification;

    setTimeout(showRandomNotification, 3000);
  }

  function formatPrivateName(name) {
    const parts = name.split(" ");
    if (parts.length < 2) return name.substring(0, 2) + "***";

    const firstName = parts[0];
    const lastName = parts[parts.length - 1];

    return `${firstName.substring(0, 2)}*** ${lastName.substring(0, 2)}***`;
  }

  function showRandomNotification() {
    if (isVisible) return;

    const randomIndex = Math.floor(Math.random() * winnerNames.length);
    const name = winnerNames[randomIndex];
    const prizeObj = prizesList[Math.floor(Math.random() * prizesList.length)];
    const time = timePhrases[Math.floor(Math.random() * timePhrases.length)];

    // Get user country from cookie
    const userCountry = getCookie("user_country") || "us";

    const avatarImg = container.querySelector("#sp-avatar");
    if (avatarImg) {
      avatarImg.src = prizeObj.image;
    }

    container.querySelector("#sp-name").textContent = formatPrivateName(name);
    container.querySelector("#sp-prize").innerHTML =
      `Won <strong>${prizeObj.shortName || prizeObj.name}</strong>`;
    container.querySelector("#sp-time").textContent = time;

    // Match user's country flag
    const flagContainer = document.getElementById("sp-flag");
    if (userCountry && userCountry !== "unknown") {
      flagContainer.innerHTML = `<img src="https://flagcdn.com/20x15/${userCountry.toLowerCase()}.png" alt="${userCountry}">`;
    } else {
      flagContainer.innerHTML = "🌍";
    }

    container.classList.add("show");
    isVisible = true;

    hideTimeout = setTimeout(hideNotification, 5000);
  }

  function hideNotification() {
    if (hideTimeout) clearTimeout(hideTimeout);
    container.classList.remove("show");
    isVisible = false;

    const nextDelay = 8000 + Math.random() * 7000;
    setTimeout(showRandomNotification, nextDelay);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
