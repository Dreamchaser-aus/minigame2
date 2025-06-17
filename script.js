const cardImages = {
  "AS": "cards/AS.png",
  "10D": "cards/10D.png",
  "7S": "cards/7S.png",
  "KH": "cards/KH.png",
  "2C": "cards/2C.png",
  "3H": "cards/3H.png"
};

function setCard(id, code) {
  const el = document.getElementById(id);
  el.style.backgroundImage = `url('${cardImages[code]}')`;
}

function startGame() {
  setCard("dealer-card1", "7S");
  setCard("dealer-card2", "back"); // 可以做背面图

  setCard("player-card1", "AS");
  setCard("player-card2", "10D");

  document.getElementById("bet").innerText = "10";
  document.getElementById("balance").innerText = "100";
}

function hit() {
  alert("Hit pressed (demo)");
}
function stand() {
  alert("Stand pressed (demo)");
}

window.onload = startGame;