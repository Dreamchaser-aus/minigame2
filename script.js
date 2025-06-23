const allCardImages = [
  "cards/AC.png","cards/2C.png","cards/3C.png","cards/4C.png","cards/5C.png","cards/6C.png","cards/7C.png","cards/8C.png","cards/9C.png","cards/10C.png","cards/JC.png","cards/QC.png","cards/KC.png",
  "cards/AD.png","cards/2D.png","cards/3D.png","cards/4D.png","cards/5D.png","cards/6D.png","cards/7D.png","cards/8D.png","cards/9D.png","cards/10D.png","cards/JD.png","cards/QD.png","cards/KD.png",
  "cards/AH.png","cards/2H.png","cards/3H.png","cards/4H.png","cards/5H.png","cards/6H.png","cards/7H.png","cards/8H.png","cards/9H.png","cards/10H.png","cards/JH.png","cards/QH.png","cards/KH.png",
  "cards/AS.png","cards/2S.png","cards/3S.png","cards/4S.png","cards/5S.png","cards/6S.png","cards/7S.png","cards/8S.png","cards/9S.png","cards/10S.png","cards/JS.png","cards/QS.png","cards/KS.png"
];

let deck = [];
let playerCards = [];
let dealerCards = [];
let dealerHiddenCard = null;
let gameStarted = false;

function shuffleDeck() {
  deck = [...allCardImages];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function drawCard() {
  return deck.pop();
}

function getCardValue(filename) {
  const rank = filename.split("/").pop().replace(".png", "").slice(0, -1);
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
  while (total > 21 && aceCount > 0) {
    total -= 10;
    aceCount--;
  }
  return total;
}

function animateCard(img) {
  setTimeout(() => {
    img.style.transform = "scale(1)";
    img.style.opacity = "1";
  }, 50);
}

function renderCards() {
  const area = document.getElementById("game-area");
  area.innerHTML = "";

  playerCards.forEach((card, i) => {
    const img = document.createElement("img");
    img.src = card;
    img.className = "card";
    img.style.left = `${100 + i * 90}px`;
    img.style.top = `65%`;
    img.style.position = "absolute";
    area.appendChild(img);
    animateCard(img);
  });

  dealerCards.forEach((card, i) => {
    const img = document.createElement("img");
    img.src = card === "hidden" ? "cards/back.png" : card;
    img.className = "card";
    img.style.left = `${100 + i * 90}px`;
    img.style.top = `15%`;
    img.style.position = "absolute";
    area.appendChild(img);
    animateCard(img);
  });
}

function showStatus(text) {
  document.getElementById("status").innerText = text;
}

function startGame() {
  shuffleDeck();
  playerCards = [];
  dealerCards = [];
  dealerHiddenCard = drawCard(); // 第二张庄家牌，先隐藏

  gameStarted = true;

  // 动画发牌：玩家1张 ➜ 庄家1张 ➜ 玩家2张 ➜ 庄家盖牌
  playerCards.push(drawCard());
  renderCards();

  setTimeout(() => {
    dealerCards.push(drawCard());
    renderCards();
  }, 400);

  setTimeout(() => {
    playerCards.push(drawCard());
    renderCards();
  }, 800);

  setTimeout(() => {
    dealerCards.push("hidden"); // 显示背面图
    renderCards();
    showStatus("请选择：要牌或停牌");
  }, 1200);
}

function hitCard() {
  if (!gameStarted || calculatePoints(playerCards) >= 21) return;
  playerCards.push(drawCard());
  renderCards();
  const points = calculatePoints(playerCards);
  if (points > 21) showStatus("你爆了，庄家赢！");
  else if (points === 21) showStatus("你达到21点！");
}

function stand() {
  if (!gameStarted) return;

  // 翻开庄家第二张牌
  dealerCards[1] = dealerHiddenCard;

  // 庄家补牌直到17点以上
  while (calculatePoints(dealerCards) < 17) {
    dealerCards.push(drawCard());
  }

  renderCards();

  const player = calculatePoints(playerCards);
  const dealer = calculatePoints(dealerCards);

  if (dealer > 21 || player > dealer) showStatus("你赢了！");
  else if (player < dealer) showStatus("庄家赢！");
  else showStatus("平局！");
}
