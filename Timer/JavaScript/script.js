// 現在時刻と日付の更新
function updateDateTime() {
  const now = new Date();

  // 時間の更新（HH:MM:SS形式）
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('current-time').textContent = `${hours}:${minutes}:${seconds}`;

  // 日付の更新（YYYY年MM月DD日（曜日）形式）
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const weekday = weekdays[now.getDay()];
  document.getElementById('current-date').textContent = `${year}年${month}月${day}日（${weekday}）`;
}

// カレンダー関連の変数とメソッド
let currentCalendarDate = new Date();
let selectedDay = null;
let calendarEvents = {};

// カレンダーイベントをローカルストレージから読み込む
function loadEvents() {
  const savedEvents = localStorage.getItem('calendarEvents');
  if (savedEvents) {
    calendarEvents = JSON.parse(savedEvents);
  }
}

// カレンダーイベントをローカルストレージに保存
function saveEvents() {
  localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
}

function formatDateKey(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function updateCalendar() {
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();

  // 月と年の表示を更新
  document.getElementById('month-year').textContent = `${year}年${month + 1}月`;

  // カレンダーグリッドをクリア
  const calendarGrid = document.getElementById('calendar-grid');
  calendarGrid.innerHTML = '';

  // 曜日ヘッダーを追加
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  weekdays.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.className = 'day-header';
    dayHeader.textContent = day;
    calendarGrid.appendChild(dayHeader);
  });

  // 月の最初の日の曜日を取得（0:日曜日 - 6:土曜日）
  const firstDay = new Date(year, month, 1).getDay();

  // 月の最終日を取得
  const lastDate = new Date(year, month + 1, 0).getDate();

  // 空のセルを追加（月の最初の日の前）
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'day empty';
    calendarGrid.appendChild(emptyDay);
  }

  // 今日の日付を取得
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  // 日付を追加
  for (let i = 1; i <= lastDate; i++) {
    const dayElement = document.createElement('div');
    dayElement.className = 'day';

    // 曜日に基づいて土日のクラスを追加
    const dayOfWeek = (firstDay + i - 1) % 7;
    if (dayOfWeek === 0) {
      dayElement.classList.add('sunday');
    } else if (dayOfWeek === 6) {
      dayElement.classList.add('saturday');
    }

    // 今日の日付にクラスを追加
    if (isCurrentMonth && i === todayDate) {
      dayElement.classList.add('today');
    }

    // 日付を表示
    const dateLabel = document.createElement('div');
    dateLabel.textContent = i;
    dayElement.appendChild(dateLabel);

    // イベントがあれば表示
    const dateKey = formatDateKey(new Date(year, month, i));
    if (calendarEvents[dateKey]) {
      dayElement.classList.add('has-event');

      const eventDiv = document.createElement('div');
      eventDiv.className = 'event-details';
      eventDiv.textContent = calendarEvents[dateKey].title;
      dayElement.appendChild(eventDiv);
    }

    // クリックイベントを追加
    dayElement.addEventListener('click', () => {
      selectedDay = new Date(year, month, i);
      openEventModal();
    });

    calendarGrid.appendChild(dayElement);
  }
}

// イベントモーダルを開く
function openEventModal() {
  const modal = document.getElementById('event-modal');
  const modalDate = document.getElementById('modal-date');
  const titleInput = document.getElementById('event-title');
  const detailsInput = document.getElementById('event-details');

  // 日付フォーマット
  const year = selectedDay.getFullYear();
  const month = selectedDay.getMonth() + 1;
  const day = selectedDay.getDate();
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const weekday = weekdays[selectedDay.getDay()];

  modalDate.textContent = `${year}年${month}月${day}日（${weekday}） 予定追加`;

  // 既存のイベントがあれば入力欄に表示
  const dateKey = formatDateKey(selectedDay);
  if (calendarEvents[dateKey]) {
    titleInput.value = calendarEvents[dateKey].title || '';
    detailsInput.value = calendarEvents[dateKey].details || '';
  } else {
    titleInput.value = '';
    detailsInput.value = '';
  }

  modal.style.display = 'flex';
}

// イベントモーダルを閉じる
function closeEventModal() {
  document.getElementById('event-modal').style.display = 'none';
}

// イベントを保存
function saveEvent() {
  const titleInput = document.getElementById('event-title');
  const detailsInput = document.getElementById('event-details');

  const title = titleInput.value.trim();
  const details = detailsInput.value.trim();

  const dateKey = formatDateKey(selectedDay);

  if (title || details) {
    calendarEvents[dateKey] = {
      title: title,
      details: details
    };
  } else {
    // タイトルと詳細が空の場合、イベントを削除
    delete calendarEvents[dateKey];
  }

  saveEvents();
  updateCalendar();
  closeEventModal();
}

// タイマー関連の変数とメソッド
let timerInterval;
let timerRunning = false;
let timerPaused = false;
let timerSeconds = 0;
let timerMode = 'up'; // 'up' または 'down'
let timerSound = null;
let currentAudio = null; // 現在再生中の音声インスタンスを保持する変数

function updateTimerDisplay() {
  const hours = Math.floor(Math.abs(timerSeconds) / 3600);
  const minutes = Math.floor((Math.abs(timerSeconds) % 3600) / 60);
  const seconds = Math.abs(timerSeconds) % 60;

  document.getElementById('timer-display').textContent =
    `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // カウントダウンが0に達したら
  if (timerMode === 'down' && timerSeconds <= 0 && timerRunning) {
    // 通知音を再生
    playTimerSound();
    resetTimer();

    // 停止ボタンを有効化
    document.getElementById('stop-sound').disabled = false;
  }
}

function startTimer() {
  if (!timerRunning) {
    timerInterval = setInterval(() => {
      if (timerMode === 'up') {
        timerSeconds++;
      } else {
        timerSeconds--;
      }
      updateTimerDisplay();
    }, 1000);

    timerRunning = true;
    timerPaused = false;

    document.getElementById('start-timer').disabled = true;
    document.getElementById('pause-timer').disabled = false;
  } else if (timerPaused) {
    timerInterval = setInterval(() => {
      if (timerMode === 'up') {
        timerSeconds++;
      } else {
        timerSeconds--;
      }
      updateTimerDisplay();
    }, 1000);

    timerPaused = false;
    document.getElementById('start-timer').disabled = true;
    document.getElementById('pause-timer').disabled = false;
    document.getElementById('start-timer').textContent = 'スタート';
  }
}

function pauseTimer() {
  if (timerRunning && !timerPaused) {
    clearInterval(timerInterval);
    timerPaused = true;
    document.getElementById('start-timer').disabled = false;
    document.getElementById('pause-timer').disabled = true;
    document.getElementById('start-timer').textContent = '再開';
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  timerPaused = false;
  timerSeconds = 0;

  document.getElementById('start-timer').disabled = false;
  document.getElementById('pause-timer').disabled = true;
  document.getElementById('start-timer').textContent = 'スタート';

  updateTimerDisplay();
}

function setTimer() {
  const hours = parseInt(document.getElementById('hours').value) || 0;
  const minutes = parseInt(document.getElementById('minutes').value) || 0;
  const seconds = parseInt(document.getElementById('seconds').value) || 0;

  timerSeconds = hours * 3600 + minutes * 60 + seconds;

  // カウントダウンモードで開始秒数を設定
  if (timerMode === 'down' && timerSeconds <= 0) {
    alert('カウントダウンには1秒以上の時間を設定してください');
    timerSeconds = 0;
  }

  // リセットして新しい値を表示
  clearInterval(timerInterval);
  timerRunning = false;
  timerPaused = false;
  document.getElementById('start-timer').disabled = false;
  document.getElementById('pause-timer').disabled = true;
  document.getElementById('start-timer').textContent = 'スタート';

  updateTimerDisplay();
}

// サウンド関連の機能
function setupTimerSound() {
  const soundInput = document.getElementById('timer-sound');
  const testButton = document.getElementById('test-sound');
  const removeButton = document.getElementById('remove-sound');
  const stopSoundButton = document.getElementById('stop-sound');

  // サウンドファイルが選択されたとき
  soundInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        timerSound = e.target.result;
        localStorage.setItem('timerSound', timerSound);
        testButton.disabled = false;
        removeButton.disabled = false;
      };
      reader.readAsDataURL(file);
    }
  });

  // テストボタンのイベントリスナー設定
  testButton.addEventListener('click', () => {
    playTimerSound();
    stopSoundButton.disabled = false;
  });

  // 音声停止ボタンのイベントリスナー設定
  stopSoundButton.addEventListener('click', stopTimerSound);

  // 音声削除ボタンのイベントリスナー設定
  removeButton.addEventListener('click', () => {
    timerSound = null;
    localStorage.removeItem('timerSound');
    testButton.disabled = true;
    removeButton.disabled = true;
    stopSoundButton.disabled = true;
    stopTimerSound();
    alert('通知音を削除しました');
  });

  // ローカルストレージから通知音を読み込む
  const savedSound = localStorage.getItem('timerSound');
  if (savedSound) {
    timerSound = savedSound;
    testButton.disabled = false;
    removeButton.disabled = false;
  }
}

// 通知音を再生
function playTimerSound() {
  if (timerSound) {
    // 既に再生中の音声があれば停止
    stopTimerSound();
    
    // 新しい音声を再生
    currentAudio = new Audio(timerSound);
    currentAudio.play().catch(e => {
      console.error('音声の再生に失敗しました:', e);
      alert('音声の再生に失敗しました。ブラウザの自動再生ポリシーにより、ユーザー操作が必要な場合があります。');
    });
  } else {
    // デフォルトのアラート
    alert('タイマーが終了しました！');
  }
}

// 通知音を停止
function stopTimerSound() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  document.getElementById('stop-sound').disabled = true;
}

// イベントリスナー設定
document.addEventListener('DOMContentLoaded', () => {
  // ローカルストレージからイベントを読み込む
  loadEvents();

  // 初期時間と日付を設定
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // 初期カレンダーを設定
  updateCalendar();

  // カレンダーナビゲーションのイベント設定
  document.getElementById('prev-month').addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    updateCalendar();
  });

  document.getElementById('next-month').addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    updateCalendar();
  });

  // タイマーボタンのイベント設定
  document.getElementById('start-timer').addEventListener('click', startTimer);
  document.getElementById('pause-timer').addEventListener('click', pauseTimer);
  document.getElementById('reset-timer').addEventListener('click', resetTimer);
  document.getElementById('set-timer').addEventListener('click', setTimer);

  // タイマーモード切替の設定
  const timerModeRadios = document.querySelectorAll('input[name="timer-mode"]');
  timerModeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      timerMode = e.target.value;
      resetTimer();

      // カウントダウンモードの場合、入力欄の値を反映
      if (timerMode === 'down') {
        setTimer();
      }
    });
  });

  // イベントモーダルのイベント設定
  document.getElementById('cancel-event').addEventListener('click', closeEventModal);
  document.getElementById('save-event').addEventListener('click', saveEvent);

  // サウンド設定を初期化
  setupTimerSound();
  
  // 最初は停止ボタンを無効化
  document.getElementById('stop-sound').disabled = true;
});