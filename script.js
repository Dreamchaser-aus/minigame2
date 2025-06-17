let playerCards = [];
let dealerCards = [];
let allCardImages = [
  "cards/AS.png", "cards/KD.png", "cards/5H.png", "cards/9C.png",
  "cards/2D.png", "cards/QH.png", "cards/7S.png", "cards/3C.png",
  "cards/6H.png", "cards/JD.png", "cards/4S.png", "cards/10D.png"
];

function drawCard() {
  const idx = Math.floor(Math.random() * allCardImages.length);
  return allCardImages[idx];
}

function initBlackjack() {
  playerCards = [drawCard(), drawCard()];
  dealerCards = [drawCard(), drawCard()];
  renderCards();
}

function renderCards() {
  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "";

  // 玩家手牌
  playerCards.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "card";
    img.style.top = "60%";
    img.style.left = `calc(50% + ${(i - (playerCards.length - 1) / 2) * 90}px)`;
    img.style.zIndex = 10 + i;
    gameArea.appendChild(img);
  });

  // 庄家手牌
  dealerCards.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "card";
    img.style.top = "25%";
    img.style.left = `calc(50% + ${(i - (dealerCards.length - 1) / 2) * 90}px)`;
    img.style.zIndex = 5 + i;
    gameArea.appendChild(img);
  });
}

function placeBet() {
  const amount = document.getElementById("bet-amount").value;
  alert(`你下注了 ${amount || 0} 元！`);
}

function dealCards() {
  initBlackjack();
}

function resetGame() {
  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "";
  playerCards = [];
  dealerCards = [];
}

function playerHit() {
  if (playerCards.length >= 5) {
    alert("不能再要牌了！");
    return;
  }
  playerCards.push(drawCard());
  renderCards();
}

function playerStand() {
  alert("你已停牌，庄家开始行动（功能即将上线）");
}
