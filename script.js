let score = 0;
let tapCount = 0;
const scoreValue = document.getElementById('scoreValue');
const brainrot = document.getElementById('brainrot');
const tapCountSpan = document.getElementById('tapCount');

// Функция для создания брейнрот-частиц
function createBrainParticles(x, y) {
  const emojis = ['🧠', '💀', '⚡', '🌀', '💥', '🔊', '🎮', '🧟', '👁️', '🕳️', '💜', '🌀'];
  
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('div');
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    particle.className = 'brain-particle';
    particle.style.left = (x + (Math.random() - 0.5) * 60) + 'px';
    particle.style.top = (y + (Math.random() - 0.5) * 50) + 'px';
    particle.style.fontSize = (18 + Math.random() * 24) + 'px';
    particle.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(particle);
    
    setTimeout(() => {
      particle.remove();
    }, 800);
  }
}

// Функция вибрации на мобилках
function vibrate() {
  if (navigator.vibrate) {
    navigator.vibrate(30);
  }
}

// Обработчик клика
brainrot.addEventListener('click', (event) => {
  // Увеличиваем счёт
  score++;
  tapCount++;
  
  // Обновляем отображение
  scoreValue.textContent = score;
  tapCountSpan.textContent = tapCount;
  
  // Анимация счётчика
  const counterWrapper = document.querySelector('.counter-wrapper');
  counterWrapper.classList.add('hit-effect');
  setTimeout(() => counterWrapper.classList.remove('hit-effect'), 200);
  
  // Анимация кнопки
  brainrot.style.transform = 'scale(0.92)';
  setTimeout(() => {
    brainrot.style.transform = '';
  }, 100);
  
  // Частицы от места клика
  const rect = brainrot.getBoundingClientRect();
  const clickX = rect.left + rect.width / 2;
  const clickY = rect.top + rect.height / 2;
  createBrainParticles(clickX, clickY);
  
  // Вибрация
  vibrate();
  
  // Дополнительный звуковой эффект (опционально — раскомментируй если хочешь)
  // const audio = new Audio('data:audio/wav;base64,U3RlYWx0aCBzb3VuZA==');
  // audio.volume = 0.2;
  // audio.play().catch(() => {});
});

// Эффект при загрузке страницы
window.addEventListener('load', () => {
  console.log('🧠 Брейнрот Тапальщик готов!');
  
  // Небольшая анимация появления
  brainrot.style.animation = 'none';
  brainrot.offsetHeight;
  brainrot.style.animation = 'float 2s ease-in-out infinite';
});

// Сохраняем прогресс в localStorage (опционально)
function saveProgress() {
  localStorage.setItem('brainrotScore', score);
  localStorage.setItem('brainrotTaps', tapCount);
}

function loadProgress() {
  const savedScore = localStorage.getItem('brainrotScore');
  const savedTaps = localStorage.getItem('brainrotTaps');
  if (savedScore) {
    score = parseInt(savedScore);
    tapCount = parseInt(savedTaps) || 0;
    scoreValue.textContent = score;
    tapCountSpan.textContent = tapCount;
  }
}

// Автосохранение каждые 5 секунд
setInterval(saveProgress, 5000);

// Загружаем прогресс при старте
loadProgress();

// Сохраняем перед закрытием страницы
window.addEventListener('beforeunload', saveProgress);