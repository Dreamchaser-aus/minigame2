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

function getCardValue(filename) {
  const name = filename.split("/").pop().replace(".png", "");
  const rank = name.slice(0, -1); // 去掉花色部分

  if (["J", "Q", "K"].includes(rank)) return 10;
  if (rank === "A") return 11;
  return parseInt(rank);
}

function calculatePoints(cards) {
  let total = 0;
  let aceCount = 0;

  cards.forEach(card => {
    const val = getCardValue(card);
    total += val;
    if (val === 11) aceCount++;
  });

  // 如果超过21点，尝试将 A 从11变成1
  while (total > 21 && aceCount > 0) {
    total -= 10;
    aceCount--;
  }

  return total;
}

function renderCards() {
  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "";

  playerCards.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "card";
    img.style.top = "60%";
    img.style.left = `calc(50% + ${(i - (playerCards.length - 1) / 2) * 90}px)`;
    img.style.zIndex = 10 + i;
    gameArea.appendChild(img);
  });

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

function initBlackjack() {
  playerCards = [drawCard(), drawCard()];
  dealerCards = [drawCard(), drawCard()];
  renderCards();
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

  const points = calculatePoints(playerCards);
  if (points > 21) {
    alert(`你的点数是 ${points}，爆牌！你输了 😢`);
  }
}

function playerStand() {
  const playerPoints = calculatePoints(playerCards);

  // 庄家规则：小于17点必须补牌
  let dealerPoints = calculatePoints(dealerCards);
  while (dealerPoints < 17) {
    dealerCards.push(drawCard());
    dealerPoints = calculatePoints(dealerCards);
  }

  renderCards();

  // 胜负判定
  if (playerPoints > 21) {
    alert(`你爆牌了 (${playerPoints})，你输了 😢`);
  } else if (dealerPoints > 21) {
    alert(`庄家爆牌了 (${dealerPoints})，你赢了 🎉`);
  } else if (playerPoints > dealerPoints) {
    alert(`你赢了！你的点数：${playerPoints}，庄家：${dealerPoints} 🎉`);
  } else if (playerPoints < dealerPoints) {
    alert(`你输了！你的点数：${playerPoints}，庄家：${dealerPoints} 😢`);
  } else {
    alert(`平局！双方都是 ${playerPoints} 🤝`);
  }
}
