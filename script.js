document.addEventListener('DOMContentLoaded', () => {
  const calendar = document.getElementById('calendar');
  const addBtn = document.getElementById('add-btn');
  const input = document.getElementById('new-objective');
  const list = document.getElementById('objectives-list');

  // Generate ~1 year of squares (simplified: 7 rows × 53 weeks)
  for (let week = 0; week < 53; week++) {
    const weekDiv = document.createElement('div');
    weekDiv.className = 'week';
    for (let day = 0; day < 7; day++) {
      const square = document.createElement('div');
      square.className = 'square level-0';
      
      // For demo: mark some random days
      if (Math.random() < 0.03) {
        square.className = 'square level-' + Math.floor(Math.random() * 4 + 1);
      }
      
      // Click to toggle (very basic)
      square.addEventListener('click', () => {
        const current = square.className.match(/level-(\d)/)?.[1] || '0';
        const next = (parseInt(current) + 1) % 5;
        square.className = `square level-${next}`;
      });

      weekDiv.appendChild(square);
    }
    calendar.appendChild(weekDiv);
  }

  // Add new objective (very simple – no persistence)
  addBtn.addEventListener('click', addObjective);
  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') addObjective();
  });

  function addObjective() {
    const text = input.value.trim();
    if (!text) return;

    const item = document.createElement('div');
    item.className = 'objective-item';
    item.innerHTML = `
      <span>${text}</span>
      <button class="delete-btn">×</button>
    `;

    item.querySelector('.delete-btn').onclick = () => item.remove();

    list.innerHTML = '';
    list.appendChild(item);

    input.value = '';
  }
});