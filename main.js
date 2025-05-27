const log = console.log

const topHealth = document.getElementById('top-health');
const topHealthLog = document.getElementById('top-log');
const botHealth = document.getElementById('bottom-health');
const botHealthLog = document.getElementById('bottom-log');
const topMinus = document.getElementById('top-minus');
const topPlus = document.getElementById('top-plus');
const botMinus = document.getElementById('bottom-minus');
const botPlus = document.getElementById('bottom-plus');
const resetGameBtn = document.getElementById('reset');
const topHealthChange = document.getElementById('top-health-change');
const botHealthChange = document.getElementById('bot-health-change');
const healthFontSize = ['30pt', '24pt', '19pt'];

let topHealthValues = [20];
let botHealthValues = [20];
let tempHealthTop = 0;
let tempHealthBot = 0;
let topUpdated = false;

reset.addEventListener('mousedown', e => resetGame(e));

topPlus.addEventListener('mousedown', e => addHealth(e, topHealthValues, true));
botPlus.addEventListener('mousedown', e => addHealth(e, botHealthValues, false));

topMinus.addEventListener('mousedown', e => subtractHealth(e, topHealthValues, true));
botMinus.addEventListener('mousedown', e => subtractHealth(e, botHealthValues, false));

const topUpdateTimer = {
	start(newHealth, newHealthChange, target) {
		if (typeof this.timeoutId === 'number') {
			this.cancel();
		}

		this.timeoutId = setTimeout(
			() => {
				target.unshift(newHealth);

				tempHealthTop = 0;
				topHealthChange.style.color = '#2e2e2e';
				topHealthChange.innerText = 'placeholder';

				updateHealthDisplay();
			},
			750
		);
	},
	cancel() {
		clearTimeout(this.timeoutId);
	}
}

const botUpdateTimer = {
	start(newHealth, newHealthChange, target) {
		if (typeof this.timeoutId === 'number') {
			this.cancel();
		}

		this.timeoutId = setTimeout(
			() => {
				target.unshift(newHealth);

				tempHealthBot = 0;
				botHealthChange.style.color = '#2e2e2e';
				botHealthChange.innerText = 'placeholder';

				updateHealthDisplay();
			},
			750
		);
	},
	cancel() {
		clearTimeout(this.timeoutId);
	}
}

function addHealth(e, target, updateTop) {
	if (updateTop) {
		topUpdated = false;
		if (tempHealthTop === 0) tempHealthTop = target[0];
		tempHealthTop += 1;
		topHealthChange.style.color = '#f3f3f3';
		topHealthChange.innerText = `+${Math.abs(target[0] - tempHealthTop)}`;
		topUpdateTimer.start(tempHealthTop, topHealthChange, target);	
	} else {
		if (tempHealthBot === 0) tempHealthBot = target[0];
		tempHealthBot += 1;
		botHealthChange.style.color = '#f3f3f3';
		botHealthChange.innerText = `+${Math.abs(target[0] - tempHealthBot)}`;
		botUpdateTimer.start(tempHealthBot, botHealthChange, target);
	}	
}

function subtractHealth(e, target, updateTop) {
	if (updateTop) {
		if (tempHealthTop === 0) tempHealthTop = target[0];
		tempHealthTop -= 1;
		topHealthChange.style.color = '#f3f3f3';
		topHealthChange.innerText = `-${Math.abs(target[0] - tempHealthTop)}`;
		topUpdateTimer.start(tempHealthTop, topHealthChange, target);
	} else {
		if (tempHealthBot === 0) tempHealthBot = target[0];
		tempHealthBot -= 1;
		botHealthChange.style.color = '#f3f3f3';
		botHealthChange.innerText = `-${Math.abs(target[0] - tempHealthBot)}`;
		botUpdateTimer.start(tempHealthBot, topHealthChange, target);
	}
}

function updateHealthDisplay() {
  log({top: topHealthValues});
	topHealth.innerText = topHealthValues[0];
	botHealth.innerText = botHealthValues[0];
	
	if (topHealthValues.length > 1) {
		replaceHistory(topHealthValues.slice(1), topHealthLog, true);
	} else {
		topHealthLog.innerHTML = `<span style="font-size: 30pt; color: #2e2e2e">holding space</span>`;
	}

	if (botHealthValues.length > 1) {
		replaceHistory(botHealthValues.slice(1), botHealthLog, false);
	} else {
		botHealthLog.innerHTML = `<span style="font-size: 30pt; color: #2e2e2e">holding space</span>`;
	}
}

function replaceHistory(values, display, topPlayer) {
  display.innerHTML = '';

	values.forEach((value, index) => {
		if (index > 9) {
			return;
		} else if (index > 2) {
      const healthIcon = document.createElement('span');
      healthIcon.style.opacity = 1 - index * .07;
      healthIcon.innerText = value;
      healthIcon.style.padding = '0 5px';

      healthIcon.addEventListener('mousedown', () => restoreHealth(index, topPlayer))

			display.appendChild(healthIcon);
		} else {
      const healthIcon = document.createElement('span');
      healthIcon.style.opacity = 1 - index * .07;
      healthIcon.style.fontSize = healthFontSize[index];
      healthIcon.innerText = value;
      healthIcon.style.padding = '0 5px';

      healthIcon.addEventListener('mousedown', () => restoreHealth(index, topPlayer))

			display.appendChild(healthIcon);
		}
	});
}

function restoreHealth(index, player) {
  if (player) {
    topHealthValues = topHealthValues.splice(index + 1);
  } else {
    botHealthValues = botHealthValues.splice(index + 1);
  }

  updateHealthDisplay()
}

function resetGame(e) {
	e.preventDefault();

	while (topHealthValues[0]) {
		topHealthValues.pop();
	}

	while (botHealthValues[0]) {
		botHealthValues.pop();
	}

	tempHealth = 0;
	topHealthValues.push(20);
	botHealthValues.push(20);

	updateHealthDisplay();
}

updateHealthDisplay();
