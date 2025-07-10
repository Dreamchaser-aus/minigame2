let deck = [];
let playerHand = [];
let dealerHand = [];
let playerStands = false;
let gameActive = false;
let coins = 1000;         // 玩家金币余额
let currentBet = 0;       // 当前下注金额

const suits = ['H', 'D', 'C', 'S'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function updateCoins() {
  document.getElementById('coins').innerText = coins;
}

function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  shuffle(deck);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startGame() {
  if (gameActive) {
    alert("请等待本局结束后再开始新游戏！");
    return;
  }
  const bet = parseInt(document.getElementById('bet-amount').value, 10);
  if (isNaN(bet) || bet <= 0) {
    alert("请输入有效的下注金额！");
    return;
  }
  if (bet > coins) {
    alert("余额不足，无法下注！");
    return;
  }
  currentBet = bet;
  coins -= bet;
  updateCoins();

  gameActive = true;
  document.getElementById('start-btn').disabled = true;

  clearBoard();
  createDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  playerStands = false;
  updateStatus('请选择：要牌 或 停牌');
  dealInitialCards();
}

function clearBoard() {
  document.getElementById('player-area').innerHTML = '';
  document.getElementById('dealer-area').innerHTML = '';
  updatePoints();
}

function updatePoints() {
  document.getElementById('player-points').textContent = calculatePoints(playerHand);
  document.getElementById('dealer-points').textContent = playerStands ? calculatePoints(dealerHand) : '?';
}

function dealInitialCards() {
  animateCard(playerHand[0], 'player-area', 0);
  setTimeout(() => animateCard(dealerHand[0], 'dealer-area', 0), 400);
  setTimeout(() => animateCard(playerHand[1], 'player-area', 1), 800);
  setTimeout(() => animateCard({ suit: 'back', value: '' }, 'dealer-area', 1), 1200);
  setTimeout(updatePoints, 1400);
}

function hitCard() {
  if (!gameActive || playerStands) return;
  const card = deck.pop();
  playerHand.push(card);
  animateCard(card, 'player-area', playerHand.length - 1);
  updatePoints();
  if (calculatePoints(playerHand) > 21) {
    endGame();
  }
}

function stand() {
  if (!gameActive || playerStands) return;
  playerStands = true;
  const dealerArea = document.getElementById('dealer-area');
  const secondCard = dealerArea.children[1];
  if (secondCard && secondCard.classList.contains('flip')) {
    secondCard.classList.add('flipped');
  }
  dealerPlay();
}

function dealerPlay() {
  setTimeout(function loop() {
    updatePoints();
    const dealerPoints = calculatePoints(dealerHand);
    if (dealerPoints < 17) {
      const card = deck.pop();
      dealerHand.push(card);
      animateCard(card, 'dealer-area', dealerHand.length - 1);
      setTimeout(loop, 600);
    } else {
      endGame();
    }
  }, 800);
}

function endGame() {
  const playerScore = calculatePoints(playerHand);
  const dealerScore = calculatePoints(dealerHand);
  let result = '';

  if (playerScore > 21) {
    result = '你爆了，庄家获胜！';
  } else if (dealerScore > 21 || playerScore > dealerScore) {
    result = '你赢了！';
    coins += currentBet * 2;
  } else if (playerScore < dealerScore) {
    result = '庄家赢了。';
    // coins 不变，已扣除下注
  } else {
    result = '平局！';
    coins += currentBet; // 返还下注
  }
  updateStatus(result);
  updatePoints();
  updateCoins();
  gameActive = false;
  document.getElementById('start-btn').disabled = false;
  currentBet = 0;
}

function calculatePoints(hand) {
  let total = 0;
  let aces = 0;
  for (let card of hand) {
    if (card.value === 'A') {
      aces++;
      total += 11;
    } else if (['K', 'Q', 'J'].includes(card.value)) {
      total += 10;
    } else {
      total += parseInt(card.value);
    }
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

function updateStatus(msg) {
  document.getElementById('status').textContent = msg;
}

// 动画及庄家第二张牌翻面
function animateCard(card, areaId, index) {
  const container = document.getElementById(areaId);
  const wrapper = document.createElement('div');
  wrapper.className = 'card';
  // 动画初始：居中
  wrapper.style.position = 'absolute';
  wrapper.style.left = '50%';
  wrapper.style.top = '50%';
  wrapper.style.transform = 'translate(-50%, -50%) scale(0.8)';
  wrapper.style.opacity = 0;
  wrapper.style.transition = 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)';

  if (areaId === 'dealer-area' && index === 1 && !playerStands) {
    wrapper.classList.add('flip');
    wrapper.setAttribute('data-card', `${card.value}${card.suit}`);
    const back = document.createElement('img');
    back.className = 'back';
    back.src = 'cards/back.png';
    const front = document.createElement('img');
    front.className = 'front';
    front.src = `cards/${card.value}${card.suit}.png`;
    wrapper.appendChild(back);
    wrapper.appendChild(front);
  } else {
    const img = document.createElement('img');
    img.className = 'card';
    const cardName = card.suit === 'back' ? 'back' : `${card.value}${card.suit}`;
    img.src = `cards/${cardName}.png`;
    wrapper.appendChild(img);
  }
  container.appendChild(wrapper);

  setTimeout(() => {
    // 动画完毕后恢复默认流布局
    wrapper.style.position = '';
    wrapper.style.left = '';
    wrapper.style.top = '';
    wrapper.style.opacity = 1;
    wrapper.style.transform = 'translateY(0) scale(1)';
  }, 50);
}

// 页面初始显示金币
window.onload = function() {
  updateCoins();
};
