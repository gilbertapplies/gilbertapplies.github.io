// Optional: tiny floating hearts for extra softness
function createFloatingHeart() {
  const heart = document.createElement('div');
  heart.innerHTML = ['💗','💞','💓','💕'][Math.floor(Math.random()*4)];
  heart.style.position = 'absolute';
  heart.style.fontSize = (10 + Math.random()*20) + 'px';
  heart.style.left = Math.random()*100 + 'vw';
  heart.style.bottom = '-10px';
  heart.style.opacity = 0.6 + Math.random()*0.4;
  heart.style.pointerEvents = 'none';
  heart.style.zIndex = '10';
  heart.style.animation = `floatUp ${8 + Math.random()*6}s linear forwards`;

  document.body.appendChild(heart);

  setTimeout(() => heart.remove(), 15000);
}

const style = document.createElement('style');
style.textContent = `
  @keyframes floatUp {
    to {
      transform: translateY(-120vh) rotate(${Math.random()*40-20}deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

setInterval(createFloatingHeart, 2200);

// Start after page load
window.addEventListener('load', () => {
  setTimeout(createFloatingHeart, 4000);
});