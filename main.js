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

const topHealthValues = [20];
const botHealthValues = [20];
let tempHealthTop = 0;
let tempHealthBot = 0;
let topUpdated = false;

reset.addEventListener('mousedown', e => resetGame(e));

topPlus.addEventListener('mousedown', e => addHealth(e, topHealthValues, true));
botPlus.addEventListener('mousedown', e => addHealth(e, botHealthValues, false));

topMinus.addEventListener('mousedown', e => subtractHealth(e, topHealthValues, true));
botMinus.addEventListener('mousedown', e => subtractHealth(e, botHealthValues, false));

// might make duplicate items for the timer, tempHealth, and take in an extra argument to allow top and bottom healths to be changed simultaniously as well as remove a bug where starting to edit bottom health and then pressing a change for top health will append all changes to only the top health, and vice versa
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
	topHealth.innerText = topHealthValues[0];
	botHealth.innerText = botHealthValues[0];
	
	if (topHealthValues.length > 1) {
		replaceHistory(topHealthValues.slice(1), topHealthLog);
	} else {
		topHealthLog.innerHTML = `<span style="font-size: 30pt; color: #2e2e2e">holding space</span>`;
	}

	if (botHealthValues.length > 1) {
		replaceHistory(botHealthValues.slice(1), botHealthLog);
	} else {
		botHealthLog.innerHTML = `<span style="font-size: 30pt; color: #2e2e2e">holding space</span>`;
	}
}

function replaceHistory(values, display) {
	const list = [];
	values.forEach((value, index) => {
		if (index > 2) {
			list.push(`<span style="opacity: ${1 - index * .07}">${value}</span>`);
		} else {
			list.push(`<span style="font-size: ${healthFontSize[index]}; opacity: ${1 - index * .1}">${value}</span>`);
		}
	});

	display.innerHTML = list.join(' ');
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
