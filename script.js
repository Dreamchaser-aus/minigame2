
let deck = [];
let playerHand = [];
let dealerHand = [];
let gameStarted = false;
let playerStands = false;

function createDeck() {
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  let deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  return shuffle(deck);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function dealCard(hand, containerId) {
  const card = deck.pop();
  hand.push(card);
  const cardImg = document.createElement('img');
  cardImg.classList.add('card');

  if (card.suit === 'hearts' || card.suit === 'diamonds') {
    cardImg.src = `cards/${card.value}_of_${card.suit}.png`;
  } else {
    cardImg.src = `cards/${card.value}_of_${card.suit}.png`;
  }

  document.getElementById(containerId).appendChild(cardImg);
  return card;
}

function calculatePoints(hand, hideSecondCard = false) {
  let total = 0;
  let aces = 0;

  hand.forEach((card, index) => {
    if (hideSecondCard && index === 1) return;
    if (['J', 'Q', 'K'].includes(card.value)) {
      total += 10;
    } else if (card.value === 'A') {
      aces += 1;
      total += 11;
    } else {
      total += parseInt(card.value);
    }
  });

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  return total;
}

function updatePoints() {
  const playerPoints = calculatePoints(playerHand);
  const dealerPoints = playerStands ? calculatePoints(dealerHand) : calculatePoints(dealerHand, true);

  document.getElementById("player-points").textContent = `玩家点数: ${playerPoints}`;
  document.getElementById("dealer-points").textContent = `庄家点数: ${playerStands ? dealerPoints : '?'}`;
}

function clearBoard() {
  document.getElementById("player-area").innerHTML = '';
  document.getElementById("dealer-area").innerHTML = '';
  playerHand = [];
  dealerHand = [];
  playerStands = false;
}

function startGame() {
  clearBoard();
  deck = createDeck();
  gameStarted = true;

  dealCard(playerHand, "player-area");
  dealCard(dealerHand, "dealer-area");
  dealCard(playerHand, "player-area");
  dealCard(dealerHand, "dealer-area");

  updatePoints();
  document.getElementById("status").textContent = "请选择：要牌 或 停牌";
}

function hitCard() {
  if (!gameStarted || playerStands) return;
  dealCard(playerHand, "player-area");
  updatePoints();

  const points = calculatePoints(playerHand);
  if (points > 21) {
    endGame();
  }
}

function stand() {
  if (!gameStarted || playerStands) return;
  playerStands = true;
  updatePoints();
  dealerTurn();
}

function dealerTurn() {
  const dealerArea = document.getElementById("dealer-area");
  const interval = setInterval(() => {
    const dealerPoints = calculatePoints(dealerHand);
    if (dealerPoints < 17) {
      dealCard(dealerHand, "dealer-area");
      updatePoints();
    } else {
      clearInterval(interval);
      endGame();
    }
  }, 800);
}

function endGame() {
  updatePoints();

  const playerPoints = calculatePoints(playerHand);
  const dealerPoints = calculatePoints(dealerHand);

  let result = "";
  if (playerPoints > 21) {
    result = "你爆了，庄家胜！";
  } else if (dealerPoints > 21 || playerPoints > dealerPoints) {
    result = "你赢了！🎉";
  } else if (playerPoints < dealerPoints) {
    result = "你输了 😢";
  } else {
    result = "平局 🤝";
  }

  document.getElementById("status").textContent = result;
  gameStarted = false;
}
