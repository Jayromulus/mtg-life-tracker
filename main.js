const log = console.log

const topHealth = document.getElementById('top-health');
const topHealthLog = document.getElementById('top-log');
const botHealth = document.getElementById('bottom-health');
const botHealthLog = document.getElementById('bottom-log');
const topMinus = document.getElementById('top-minus');
const topPlus = document.getElementById('top-plus');
const botMinus = document.getElementById('bottom-minus');
const botPlus = document.getElementById('bottom-plus');
const healthFontSize = ['30pt', '26pt', '22pt'];

const topHealthValues = [20];
const botHealthValues = [20];
let tempHealth = 0;

topPlus.addEventListener('mousedown', e => addHealth(e, topHealthValues));
botPlus.addEventListener('mousedown', e => addHealth(e, botHealthValues));

topMinus.addEventListener('mousedown', e => subtractHealth(e, topHealthValues));
botMinus.addEventListener('mousedown', e => subtractHealth(e, botHealthValues));

const updateTimer = {
	start(newHealth, target) {
		if(typeof this.timeoutId === 'number') {
			this.cancel();
		}

		this.timeoutId = setTimeout(
			() => {
				target.unshift(newHealth);
				updateHealthDisplay();
				tempHealth = 0;
			},
			750
		);
	},
	cancel() {
		clearTimeout(this.timeoutId);
	},
	reset() {
		this.cancel();
		this.start();
	}
}

function addHealth(e, target) {
	if(tempHealth === 0) tempHealth = target[0];
	tempHealth += 1;
	updateTimer.start(tempHealth, target);
}

function subtractHealth(e, target) {
	if(tempHealth === 0) tempHealth = target[0];
	tempHealth -= 1;
	updateTimer.start(tempHealth, target);
}

function updateHealthDisplay() {
	topHealth.innerText = topHealthValues[0];
	botHealth.innerText = botHealthValues[0];
	
	if(topHealthValues.length > 1) {
		replaceHistory(topHealthValues.slice(1), topHealthLog);
	} else {
		topHealthLog.innerHTML = `<spane style="font-size: 30pt; color: #2e2e2e">holding space</span>`;
	}

	if(botHealthValues.length > 1) {
		replaceHistory(botHealthValues.slice(1), botHealthLog);
	} else {
		botHealthLog.innerHTML = `<span style="font-size: 30pt; color: #2e2e2e">holding space</span>`;
	}
}

function replaceHistory(values, display) {
	const list = [];
	values.forEach((value, index) => {
		if(index > 2) {
			list.push(`<span style="opacity: ${1 - index * .07}">${value}</span>`);
		} else {
			list.push(`<span style="font-size: ${healthFontSize[index]}; opacity: ${1 - index * .1}">${value}</span>`);
		}
	});

	display.innerHTML = list.join(' ');
}

updateHealthDisplay();
