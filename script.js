const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const STORAGE_KEY = 'brainrot_progress';

let score = 0;
let tapCount = 0;

const scoreValue = document.getElementById('scoreValue');
const tapCountSpan = document.getElementById('tapCount');
const brainrot = document.getElementById('brainrot');

function updateUI() {
  if (scoreValue) scoreValue.textContent = score;
  if (tapCountSpan) tapCountSpan.textContent = tapCount;
}

function saveLocalProgress() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        score,
        tapCount,
        updatedAt: Date.now()
      })
    );
  } catch (e) {
    console.error('Ошибка сохранения в localStorage:', e);
  }
}

function loadLocalProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;

    const data = JSON.parse(raw);

    score = Number(data.score) || 0;
    tapCount = Number(data.tapCount) || 0;

    return true;
  } catch (e) {
    console.error('Ошибка загрузки из localStorage:', e);
    return false;
  }
}

function loadProgressFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);

    const urlScore = Number(params.get('score'));
    const urlTaps = Number(params.get('taps'));

    if (!Number.isNaN(urlScore) && urlScore > score) {
      score = urlScore;
    }

    if (!Number.isNaN(urlTaps) && urlTaps > tapCount) {
      tapCount = urlTaps;
    }
  } catch (e) {
    console.error('Ошибка чтения параметров URL:', e);
  }
}

function sendProgressToBot() {
  try {
    const payload = {
      score,
      tapCount
    };

    tg.sendData(JSON.stringify(payload));
    console.log('Прогресс отправлен в бота:', payload);
  } catch (e) {
    console.error('Ошибка отправки данных в бота:', e);
  }
}

function handleTap() {
  score += 1;
  tapCount += 1;

  updateUI();
  saveLocalProgress();
}

function setupMainButton() {
  tg.MainButton.setText('Сохранить и выйти');
  tg.MainButton.show();
  tg.MainButton.enable();

  tg.onEvent('mainButtonClicked', () => {
    saveLocalProgress();
    sendProgressToBot();
    tg.close();
  });
}

function autosaveBeforeClose() {
  saveLocalProgress();

  // Пытаемся отправить прогресс перед закрытием.
  // Не во всех сценариях Telegram гарантированно доставит sendData,
  // но локальное сохранение точно сработает.
  try {
    sendProgressToBot();
  } catch (e) {
    console.error('Ошибка автосохранения перед закрытием:', e);
  }
}

function init() {
  loadLocalProgress();
  loadProgressFromUrl();
  saveLocalProgress();
  updateUI();
  setupMainButton();

  if (brainrot) {
    brainrot.addEventListener('click', handleTap);
  } else {
    console.error('Элемент #brainrot не найден');
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      autosaveBeforeClose();
    }
  });

  window.addEventListener('beforeunload', autosaveBeforeClose);
  window.addEventListener('pagehide', autosaveBeforeClose);
}

init();
