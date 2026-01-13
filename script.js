document.addEventListener('DOMContentLoaded', () => {
  const calendar = document.getElementById('calendar');
  const addBtn = document.getElementById('add-btn');
  const input = document.getElementById('new-obj-input');
  const list = document.getElementById('objectives-list');

  // Create ~1 year grid (53 weeks × 7 days)
  for (let w = 0; w < 53; w++) {
    for (let d = 0; d < 7; d++) {
      const sq = document.createElement('div');
      sq.className = 'square';

      // Just for demo - random filled days
      if (Math.random() < 0.04) {
        const level = Math.floor(Math.random() * 4) + 1;
        sq.classList.add('l' + level);
      }

      sq.addEventListener('click', () => {
        const current = [...sq.classList].find(c => c.startsWith('l')) || 'l0';
        const lvl = current === 'l0' ? 1 : (parseInt(current[1]) % 4) + 1;
        sq.className = 'square l' + lvl;
      });

      calendar.appendChild(sq);
    }
  }

  // Add objective
  function addObjective() {
    const text = input.value.trim();
    if (!text) return;

    const item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = `
      <span>${text}</span>
      <button>×</button>
    `;

    item.querySelector('button').onclick = () => {
      item.remove();
      if (list.children.length === 0) {
        list.innerHTML = '<div class="empty">No objectives yet. Add one above to get started!</div>';
      }
    };

    // Remove empty state if exists
    const empty = list.querySelector('.empty');
    if (empty) empty.remove();

    list.appendChild(item);
    input.value = '';
  }

  addBtn.onclick = addObjective;
  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') addObjective();
  });
});