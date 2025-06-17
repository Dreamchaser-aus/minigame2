const suits = ["♠", "♥", "♣", "♦"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
let deck = [], player = [], dealer = [], gameOver = false;
let balance = 100;

function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let val of values) {
      deck.push({ value: val, suit: suit });
    }
  }
  deck.sort(() => Math.random() - 0.5);
}

function getCardValue(card) {
  if (["J", "Q", "K"].includes(card.value)) return 10;
  if (card.value === "A") return 11;
  return parseInt(card.value);
}

function calculateScore(cards) {
  let score = 0, aceCount = 0;
  for (let card of cards) {
    score += getCardValue(card);
    if (card.value === "A") aceCount++;
  }
  while (score > 21 && aceCount > 0) {
    score -= 10;
    aceCount--;
  }
  return score;
}

function drawCard(who) {
  const card = deck.pop();
  who.push(card);
}

function displayCards() {
  document.getElementById("player-cards").innerHTML = player.map(c => `<div class="card">${c.value}${c.suit}</div>`).join("");
  document.getElementById("dealer-cards").innerHTML = dealer.map(c => `<div class="card">${c.value}${c.suit}</div>`).join("");
  document.getElementById("player-score").innerText = "Score: " + calculateScore(player);
  document.getElementById("dealer-score").innerText = "Score: " + calculateScore(dealer);
  document.getElementById("balance").innerText = "Balance: $" + balance;
}

function hit() {
  if (gameOver) return;
  drawCard(player);
  displayCards();
  const score = calculateScore(player);
  if (score > 21) {
    document.getElementById("result").innerText = "You Busted!";
    balance -= getBetAmount();
    endGame();
  }
}

function stand() {
  if (gameOver) return;
  while (calculateScore(dealer) < 17) {
    drawCard(dealer);
  }
  const playerScore = calculateScore(player);
  const dealerScore = calculateScore(dealer);
  let result = "";
  if (dealerScore > 21 || playerScore > dealerScore) {
    result = "You Win!";
    balance += getBetAmount();
  } else if (playerScore < dealerScore) {
    result = "You Lose!";
    balance -= getBetAmount();
  } else {
    result = "It's a Tie!";
  }
  document.getElementById("result").innerText = result;
  endGame();
}

function getBetAmount() {
  const bet = parseInt(document.getElementById("bet").value);
  return isNaN(bet) ? 0 : bet;
}

function endGame() {
  gameOver = true;
  displayCards();
}

function startGame() {
  gameOver = false;
  player = [];
  dealer = [];
  createDeck();
  drawCard(player);
  drawCard(player);
  drawCard(dealer);
  drawCard(dealer);
  document.getElementById("result").innerText = "";
  displayCards();
}
