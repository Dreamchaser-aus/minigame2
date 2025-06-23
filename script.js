
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
let gameArea;

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
    if (card === "hidden") return;
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

function createCard(card, top, left) {
  const img = document.createElement("img");
  img.src = card === "hidden" ? "cards/back.png" : card;
  img.className = "card";
  img.style.position = "absolute";
  img.style.left = "50%";
  img.style.top = "40%";
  img.style.transform = "scale(0.3)";
  img.style.opacity = "0";
  gameArea.appendChild(img);

  setTimeout(() => {
    img.style.left = left;
    img.style.top = top;
    img.style.opacity = "1";
    img.style.transform = "scale(1)";
  }, 30);
}

function showStatus(text) {
  document.getElementById("status").innerText = text;
}

function startGame() {
  gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "";

  shuffleDeck();
  playerCards = [];
  dealerCards = [];
  dealerHiddenCard = drawCard();
  gameStarted = true;

  const sequence = [
    () => {
      const card = drawCard();
      playerCards.push(card);
      createCard(card, "65%", "100px");
    },
    () => {
      const card = drawCard();
      dealerCards.push(card);
      createCard(card, "15%", "100px");
    },
    () => {
      const card = drawCard();
      playerCards.push(card);
      createCard(card, "65%", "190px");
    },
    () => {
      dealerCards.push("hidden");
      createCard("hidden", "15%", "190px");
      showStatus("请选择：要牌或停牌");
    }
  ];

  sequence.forEach((fn, i) => setTimeout(fn, i * 600));
}

function hitCard() {
  if (!gameStarted || calculatePoints(playerCards) >= 21) return;
  const card = drawCard();
  playerCards.push(card);
  const left = 100 + (playerCards.length - 1) * 90 + "px";
  createCard(card, "65%", left);
  const points = calculatePoints(playerCards);
  if (points > 21) showStatus("你爆了，庄家赢！");
  else if (points === 21) showStatus("你达到21点！");
}

function stand() {
  if (!gameStarted) return;
  dealerCards[1] = dealerHiddenCard;

  gameArea.innerHTML = "";
  dealerCards.forEach((card, i) => {
    const left = 100 + i * 90 + "px";
    createCard(card, "15%", left);
  });

  playerCards.forEach((card, i) => {
    const left = 100 + i * 90 + "px";
    createCard(card, "65%", left);
  });

  while (calculatePoints(dealerCards) < 17) {
    const card = drawCard();
    dealerCards.push(card);
    const left = 100 + (dealerCards.length - 1) * 90 + "px";
    createCard(card, "15%", left);
  }

  const player = calculatePoints(playerCards);
  const dealer = calculatePoints(dealerCards);

  if (dealer > 21 || player > dealer) showStatus("你赢了！");
  else if (player < dealer) showStatus("庄家赢！");
  else showStatus("平局！");
}
