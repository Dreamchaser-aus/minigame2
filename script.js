function initBlackjack(roomId) {
  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "";

  const cardImages = [
    "cards/AS.png", // 发给玩家1
    "cards/KD.png", // 发给庄家1
    "cards/5H.png", // 发给玩家2
    "cards/9C.png"  // 发给庄家2
  ];

  cardImages.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "card";

    // 初始位置在中心
    img.style.position = "absolute";
    img.style.width = "80px";
    img.style.left = "50%";
    img.style.top = "50%";
    img.style.transform = "translate(-50%, -50%)";
    img.style.transition = "all 0.6s ease";

    img.onload = () => {
      document.getElementById("game-area").appendChild(img);

      setTimeout(() => {
        const offsetX = (index % 2 === 0 ? -1 : 1) * (100 + index * 10); // 玩家 or 庄家
        const offsetY = index < 2 ? -100 : 100; // 上下偏移
        img.style.left = `calc(50% + ${offsetX}px)`;
        img.style.top = `calc(50% + ${offsetY}px)`;
      }, 100 + index * 300);
    };
  });
}
