let score = 0;
let tapCount = 0;
const scoreValue = document.getElementById('scoreValue');
const brainrot = document.getElementById('brainrot');
const tapCountSpan = document.getElementById('tapCount');

// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// 1. Загрузка прогресса из URL (если бот передал его при открытии)
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('score')) score = parseInt(urlParams.get('score')) || 0;
if (urlParams.has('taps')) tapCount = parseInt(urlParams.get('taps')) || 0;
scoreValue.textContent = score;
tapCountSpan.textContent = tapCount;

// 2. Настройка нативной кнопки Telegram для сохранения
tg.MainButton.setText('💾 Сохранить и выйти');
tg.MainButton.show();
tg.MainButton.enable();

// ВАЖНО: правильно обрабатываем нажатие кнопки
tg.onEvent('mainButtonClicked', () => {
    // Отправляем данные боту
    const payload = JSON.stringify({ score, tapCount });
    tg.sendData(payload);
    
    // Закрываем WebApp после отправки
    tg.close();
});

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
        setTimeout(() => particle.remove(), 800);
    }
}

function vibrate() {
    if (navigator.vibrate) navigator.vibrate(30);
}

brainrot.addEventListener('click', () => {
    score++;
    tapCount++;
    scoreValue.textContent = score;
    tapCountSpan.textContent = tapCount;

    const counterWrapper = document.querySelector('.counter-wrapper');
    counterWrapper.classList.add('hit-effect');
    setTimeout(() => counterWrapper.classList.remove('hit-effect'), 200);

    brainrot.style.transform = 'scale(0.92)';
    setTimeout(() => brainrot.style.transform = '', 100);

    const rect = brainrot.getBoundingClientRect();
    createBrainParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    vibrate();
});

window.addEventListener('load', () => {
    console.log('🧠 Брейнрот Тапальщик готов!');
    brainrot.style.animation = 'none';
    brainrot.offsetHeight;
    brainrot.style.animation = 'float 2s ease-in-out infinite';
});