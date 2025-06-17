function initBlackjack(roomId) {
  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "";

  const cards = [
    "cards/AS.png", "cards/KD.png", "cards/5H.png", "cards/9C.png"
  ];

  cards.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "card";
    img.style.zIndex = 10 + index;
    gameArea.appendChild(img);

    setTimeout(() => {
      const offsetX = (index % 2 === 0 ? -1 : 1) * (100 + index * 10);
      const offsetY = index < 2 ? -100 : 100;
      img.style.left = `calc(50% + ${offsetX}px)`;
      img.style.top = `calc(50% + ${offsetY}px)`;
    }, 200 + index * 300);
  });
}
