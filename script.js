const startButton = document.getElementById("start-button");
const nextButton = document.getElementById("next-button");
const peopleSelect = document.getElementById("people-count");
const peopleSection = document.getElementById("people-select-section");
const nameInputsDiv = document.getElementById("name-inputs");
const chestList = document.getElementById("chest-list");
const legList = document.getElementById("leg-list");
const blackout = document.getElementById("blackout-screen");
const resultsSection = document.getElementById("results");

const sharedAudioPlayer = new Audio(); // Still used for compatibility, not for flip sounds

const chestQuotes = [
  { text: "പ പ പാാാാ 🎶🤣", video: "https://ik.imagekit.io/ojuathkud/videos/jay.mp4?updatedAt=1752833778729" },
  { text: "ഉന്നാല്‍ മുഡിയാത് തമ്പി 🔥😹", video: "https://ik.imagekit.io/ojuathkud/videos/sra.mp4?updatedAt=1752833773017" },
  { text: "ഹെ ഹെ ഹെ… 😏🗿", video: "https://ik.imagekit.io/ojuathkud/videos/in.mp4?updatedAt=1752833784761" },
  { text: "🕺🕺🕺🕺🕺", video: "https://ik.imagekit.io/ojuathkud/videos/su.mp4?updatedAt=1752833772066" }
];

const legQuotes = [
  { text: "അഹാാാാാ... ഇപ്പോ എങ്ങനുണ്ട് 🚶", video: "https://ik.imagekit.io/ojuathkud/videos/pettu_o.mp4?updatedAt=1752833752604" },
  { text: "എന്താ അവസ്ഥ 😩😭😭", video: "https://ik.imagekit.io/ojuathkud/videos/avastha.mp4?updatedAt=1752833778274" },
  { text: "ചാച്ചിക്കോ 😢😹", video: "https://ik.imagekit.io/ojuathkud/videos/thala.mp4?updatedAt=1752833782508" },
  { text: "ബ്രോ ഒന്ന് കരഞ്ഞുടേ 🤣😭 ", video: "https://ik.imagekit.io/ojuathkud/videos/hari_o.mp4?updatedAt=1752833747414" }
];

// Preload all videos on page load for faster playback
function preloadAllVideos() {
  const allVideos = [...chestQuotes, ...legQuotes].map(q => q.video);
  allVideos.forEach(src => {
    const video = document.createElement('video');
    video.src = src;
    video.preload = 'auto';
    video.style.display = 'none';
    document.body.appendChild(video);
  });
}
window.addEventListener('DOMContentLoaded', preloadAllVideos);

let usedChestQuotes = [], usedLegQuotes = [];

const fightButton = document.createElement("button");
fightButton.textContent = "💥 Fight";
fightButton.style.marginTop = "10px";

const goBackButton = document.createElement("button");
goBackButton.textContent = "Go Back";
goBackButton.style.marginTop = "10px";

startButton.addEventListener("click", () => {
  startButton.style.display = "none";
  document.querySelector(".description").style.display = "none";
  document.querySelector("h1").classList.add("shake");
  setTimeout(() => document.querySelector("h1").classList.remove("shake"), 400);
  peopleSection.style.display = "block";
  nameInputsDiv.innerHTML = "";
  resultsSection.style.display = "none";
});

nextButton.addEventListener("click", () => {
  const count = parseInt(peopleSelect.value);
  if (!count || count < 2 || count > 8) {
    alert("Please select between 2 to 8 players.");
    return;
  }

  peopleSection.style.display = "none";
  nameInputsDiv.style.display = "block";
  nameInputsDiv.innerHTML = `<p>Enter player names:</p>`;

  for (let i = 0; i < count; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `Enter the name`;
    input.className = "player-name";
    input.style.margin = "6px 0";
    input.style.padding = "10px";
    input.style.width = "90%";
    input.style.borderRadius = "8px";
    nameInputsDiv.appendChild(input);
    nameInputsDiv.appendChild(document.createElement("br"));
  }

  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "center";
  buttonContainer.style.alignItems = "center";
  buttonContainer.style.columnGap = "20px";
  buttonContainer.style.marginTop = "15px";

  buttonContainer.appendChild(goBackButton);
  buttonContainer.appendChild(fightButton);
  nameInputsDiv.appendChild(buttonContainer);
});

fightButton.addEventListener("click", () => {
  const inputs = document.querySelectorAll(".player-name");
  const names = Array.from(inputs).map(i => i.value.trim()).filter(n => n !== "");

  if (names.length < 2) {
    alert("Enter at least 2 valid names!");
    return;
  }

  chestList.innerHTML = "";
  legList.innerHTML = "";
  usedChestQuotes = [];
  usedLegQuotes = [];

  const total = names.length;
  const chestCount = Math.floor(total / 2);
  const shuffled = [...names].sort(() => Math.random() - 0.5);
  const chestWinners = shuffled.slice(0, chestCount);
  const legReceivers = shuffled.slice(chestCount);

  blackout.style.display = "flex";

  setTimeout(() => {
    blackout.style.display = "none";
    resultsSection.style.display = "block";
    nameInputsDiv.style.display = "none";

    chestWinners.forEach(name => {
      const quoteObj = getUniqueQuote(chestQuotes, usedChestQuotes);
      const li = createCard(name, quoteObj);
      chestList.appendChild(li);
    });

    legReceivers.forEach(name => {
      const quoteObj = getUniqueQuote(legQuotes, usedLegQuotes);
      const li = createCard(name, quoteObj);
      legList.appendChild(li);
    });

    // Add single reroll button after results
    let rerollBtn = document.getElementById("reroll-all-btn");
    if (!rerollBtn) {
      rerollBtn = document.createElement("button");
      rerollBtn.id = "reroll-all-btn";
      rerollBtn.textContent = "Re roll";
      rerollBtn.style.marginTop = "20px";
      rerollBtn.style.display = "block";
      rerollBtn.style.marginLeft = "auto";
      rerollBtn.style.marginRight = "auto";
      resultsSection.appendChild(rerollBtn);
    } else {
      rerollBtn.textContent = "Re roll";
      rerollBtn.style.display = "block";
    }

    rerollBtn.onclick = function() {
      // Get current player names from cards
      const allNames = [];
      Array.from(chestList.children).forEach(li => {
        const name = li.querySelector(".name").textContent;
        if (name) allNames.push(name);
      });
      Array.from(legList.children).forEach(li => {
        const name = li.querySelector(".name").textContent;
        if (name) allNames.push(name);
      });
      // Reshuffle and reassign
      chestList.innerHTML = "";
      legList.innerHTML = "";
      usedChestQuotes = [];
      usedLegQuotes = [];
      const total = allNames.length;
      const chestCount = Math.floor(total / 2);
      const shuffled = [...allNames].sort(() => Math.random() - 0.5);
      const chestWinners = shuffled.slice(0, chestCount);
      const legReceivers = shuffled.slice(chestCount);
      chestWinners.forEach(name => {
        const quoteObj = getUniqueQuote(chestQuotes, usedChestQuotes);
        const li = createCard(name, quoteObj);
        chestList.appendChild(li);
      });
      legReceivers.forEach(name => {
        const quoteObj = getUniqueQuote(legQuotes, usedLegQuotes);
        const li = createCard(name, quoteObj);
        legList.appendChild(li);
      });
    };
  }, 1000);
});

goBackButton.addEventListener("click", () => {
  nameInputsDiv.style.display = "none";
  nameInputsDiv.innerHTML = "";
  peopleSection.style.display = "block";
});

// Stop all other videos
function stopAllVideos() {
  const allVideos = document.querySelectorAll("video");
  allVideos.forEach(v => {
    v.pause();
    v.currentTime = 0;
  });
  sharedAudioPlayer.pause();
  sharedAudioPlayer.currentTime = 0;
}

// Create flip card with video replay on every click without overlap
function createCard(name, quoteObj) {
  const li = document.createElement("li");
  li.className = "flip-card";
  li.innerHTML = `
    <div class="flip-inner">
      <div class="flip-front">Click to Reveal 🔒</div>
      <div class="flip-back">
        <div class="name">${name}</div>
        <div class="quote">${quoteObj.text}</div>
        <video class="quote-video" preload="metadata" src="${quoteObj.video}" muted></video>
      </div>
    </div>
  `;

  li.addEventListener("click", () => {
    const video = li.querySelector("video");
    const flipBack = li.querySelector(".flip-back");
    let loader = flipBack.querySelector('.video-loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.className = 'video-loader';
      loader.style.display = 'none';
      flipBack.appendChild(loader);
    }

    function showLoader() {
      loader.style.display = 'block';
    }
    function hideLoader() {
      loader.style.display = 'none';
    }

    function onReady() {
      hideLoader();
      video.removeEventListener('canplaythrough', onReady);
      video.play();
    }

    if (!li.classList.contains("flipped")) {
      stopAllVideos();
      li.classList.add("flipped");
      setTimeout(() => {
        showLoader();
        video.muted = false;
        video.currentTime = 0;
        video.addEventListener('canplaythrough', onReady);
        video.load();
      }, 100);
    } else {
      stopAllVideos();
      showLoader();
      video.muted = false;
      video.currentTime = 0;
      video.addEventListener('canplaythrough', onReady);
      video.load();
    }
  });

  return li;
}

// Quote shuffler
function getUniqueQuote(quotes, usedList) {
  if (usedList.length >= quotes.length) usedList.length = 0;
  const remaining = quotes.filter(q => !usedList.includes(q));
  const quote = remaining[Math.floor(Math.random() * remaining.length)];
  usedList.push(quote);
  return quote;
}