document.addEventListener('DOMContentLoaded', () => {
  // ── Data & Storage ───────────────────────────────────────
  const STORAGE_KEY_GRID = 'dailytrack_contributions';
  const STORAGE_KEY_OBJECTIVES = 'dailytrack_objectives';

  let contributions = JSON.parse(localStorage.getItem(STORAGE_KEY_GRID)) || {};
  let objectives = JSON.parse(localStorage.getItem(STORAGE_KEY_OBJECTIVES)) || [];

  // ── Calendar Generation ──────────────────────────────────
  const daysGrid = document.getElementById('days-grid');
  const monthLabels = document.getElementById('month-labels');
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  // Find first Monday before or on 1 year ago
  const startDate = new Date(oneYearAgo);
  startDate.setDate(startDate.getDate() - startDate.getDay() + 1);

  const dates = [];
  let current = new Date(startDate);

  while (current <= today) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  // Month labels (approximate position)
  const monthsSeen = new Set();
  const monthPositions = {};

  dates.forEach((date, i) => {
    const monthName = date.toLocaleString('default', { month: 'short' });
    if (!monthsSeen.has(monthName)) {
      monthsSeen.add(monthName);
      const col = Math.floor(i / 7);
      monthPositions[col] = monthName;
    }
  });

  // Render month labels
  for (let col = 0; col < 53; col++) {
    const label = document.createElement('div');
    label.textContent = monthPositions[col] || '';
    monthLabels.appendChild(label);
  }

  // Render squares
  dates.forEach(date => {
    const key = date.toISOString().split('T')[0];
    const level = contributions[key] || 0;

    const square = document.createElement('div');
    square.className = `square ${level ? 'l' + Math.min(level, 4) : 'l0'}`;
    square.title = `${key} – level ${level}`;
    square.dataset.date = key;

    square.addEventListener('click', () => {
      let newLevel = (level + 1) % 5;
      contributions[key] = newLevel;
      square.className = `square ${newLevel ? 'l' + newLevel : 'l0'}`;
      square.title = `${key} – level ${newLevel}`;
      saveAndUpdate();
    });

    daysGrid.appendChild(square);
  });

  // ── Stats Calculation & Update ───────────────────────────
  function updateStats() {
    const now = new Date();
    let total = Object.values(contributions).filter(v => v > 0).length;
    let thisMonth = 0;
    let streak = 0;
    let currentStreak = 0;

    // Simple streak (consecutive days including today)
    for (let i = dates.length - 1; i >= 0; i--) {
      const date = dates[i];
      const key = date.toISOString().split('T')[0];
      if (contributions[key] > 0) {
        currentStreak++;
      } else if (date < now && currentStreak > 0) {
        break;
      }
    }
    streak = currentStreak;

    // This month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    dates.forEach(d => {
      if (d >= monthStart && d <= now && contributions[d.toISOString().split('T')[0]] > 0) {
        thisMonth++;
      }
    });

    const yearDays = Math.min(365, dates.length);
    const rate = yearDays > 0 ? Math.round((total / yearDays) * 100) : 0;

    document.getElementById('streak').textContent = streak;
    document.getElementById('this-month').textContent = thisMonth;
    document.getElementById('total-days').textContent = total;
    document.getElementById('year-rate').textContent = rate + '%';
    document.getElementById('contrib-title').textContent = `${total} contributions in the last year`;
  }

  // ── Objectives ───────────────────────────────────────────
  const objList = document.getElementById('objectives-list');
  const input = document.getElementById('new-obj-input');
  const addBtn = document.getElementById('add-btn');

  function renderObjectives() {
    objList.innerHTML = '';
    if (objectives.length === 0) {
      objList.innerHTML = '<div class="empty">No objectives yet. Add one above to get started!</div>';
      return;
    }
    objectives.forEach((text, index) => {
      const item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = `
        <span>${text}</span>
        <button class="delete">×</button>
      `;
      item.querySelector('.delete').onclick = () => {
        objectives.splice(index, 1);
        saveObjectives();
        renderObjectives();
      };
      objList.appendChild(item);
    });
  }

  function saveObjectives() {
    localStorage.setItem(STORAGE_KEY_OBJECTIVES, JSON.stringify(objectives));
  }

  // ── Save & Update All ────────────────────────────────────
  function saveAndUpdate() {
    localStorage.setItem(STORAGE_KEY_GRID, JSON.stringify(contributions));
    updateStats();
  }

  // ── Add objective ────────────────────────────────────────
  function addObjective() {
    const text = input.value.trim();
    if (!text) return;
    objectives.push(text);
    saveObjectives();
    renderObjectives();
    input.value = '';
  }

  addBtn.onclick = addObjective;
  input.addEventListener('keypress', e => e.key === 'Enter' && addObjective());

  // ── Init ─────────────────────────────────────────────────
  renderObjectives();
  updateStats();
});