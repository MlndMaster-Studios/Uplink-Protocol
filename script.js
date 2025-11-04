// ===== Initialize Data =====
let dp = parseInt(localStorage.getItem('dp')) || 0;
let clickPower = parseInt(localStorage.getItem('clickPower')) || 1;
let uiUpgrades = JSON.parse(localStorage.getItem('uiUpgrades')) || [];

const dpCount = document.getElementById('dp-count');
const clickBtn = document.getElementById('click-btn');

function updateDP() {
  dpCount.textContent = dp;
  localStorage.setItem('dp', dp);
}

// ===== Click Handler =====
clickBtn.addEventListener('click', () => {
  dp += clickPower;
  updateDP();
});

// ===== Shop Purchases =====
document.querySelectorAll('.shop-item button').forEach(btn => {
  btn.addEventListener('click', () => {
    const cost = parseInt(btn.dataset.cost);
    const type = btn.dataset.type;
    const value = btn.dataset.value;

    if(dp < cost) return alert("Not enough Data Points!");

    dp -= cost;
    updateDP();

    if(type === 'click') {
      clickPower += parseInt(value);
      localStorage.setItem('clickPower', clickPower);
    } else if(type === 'ui') {
      uiUpgrades.push(value);
      localStorage.setItem('uiUpgrades', JSON.stringify(uiUpgrades));
      applyUIUpgrades();
    }
  });
});

// ===== UI Upgrades =====
function applyUIUpgrades() {
  const body = document.body;
  if(uiUpgrades.includes('gradient')) {
    body.style.background = 'linear-gradient(-45deg, #100018, #1e0030, #2a0050, #4f46e5)';
    body.style.backgroundSize = '400% 400%';
    body.style.animation = 'gradientFlow 20s ease infinite';
  }
}

// ===== Animations =====
const style = document.createElement('style');
style.innerHTML = `
@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}`;
document.head.appendChild(style);

// ===== Initialize =====
updateDP();
applyUIUpgrades();
