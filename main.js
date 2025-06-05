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
const topHealthRevert = document.getElementById('top-health-confirm');
const botHealthRevert = document.getElementById('bot-health-confirm');
const healthFontSize = ['30pt', '24pt', '19pt'];

let topHealthValues = [20];
let botHealthValues = [20];
let tempHealthTop = 0;
let tempHealthBot = 0;
let lastChangedTopIndex = 0;
let lastChangedBotIndex = 0;
let topUpdated = false;

//* 1. create variables to track topResetConfirmed and topResetCancelled, same for bottom

reset.addEventListener('mousedown', e => resetGame(e));

topPlus.addEventListener('mousedown', e => addHealth(e, topHealthValues, true));
botPlus.addEventListener('mousedown', e => addHealth(e, botHealthValues, false));

topMinus.addEventListener('mousedown', e => subtractHealth(e, topHealthValues, true));
botMinus.addEventListener('mousedown', e => subtractHealth(e, botHealthValues, false));

const topUpdateTimer = {
	start(newHealth, target) {
		if (typeof this.timeoutId === 'number') {
			this.cancel();
		}

		this.timeoutId = setTimeout(
			() => {
				target.unshift(newHealth);

				tempHealthTop = 0;
				topHealthChange.style.color = 'var(--dark)';
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
	start(newHealth, target) {
		if (typeof this.timeoutId === 'number') {
			this.cancel();
		}

		this.timeoutId = setTimeout(
			() => {
				target.unshift(newHealth);

				tempHealthBot = 0;
				botHealthChange.style.color = 'var(--dark)';
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

function updateHealthDisplay() {
	topHealth.innerText = topHealthValues[0];
	botHealth.innerText = botHealthValues[0];
	
	if (topHealthValues.length > 1) {
		replaceHistory(topHealthValues.slice(1), topHealthLog, true);
	} else {
		topHealthLog.innerHTML = `<span style="font-size: 30pt; color: var(--dark)">20</span>`;
	}

	if (botHealthValues.length > 1) {
		replaceHistory(botHealthValues.slice(1), botHealthLog, false);
	} else {
		botHealthLog.innerHTML = `<span style="font-size: 30pt; color: var(--dark)">20</span>`;
	}
}

function addHealth(e, target, updateTop) {
	if (updateTop) {
		topUpdated = false;
		if (tempHealthTop === 0) tempHealthTop = target[0];
		tempHealthTop += 1;
    // let change = target[0] - tempHealthTop
		topHealthChange.style.color = 'var(--pink)';
    let change = tempHealthTop - target[0];
		topHealthChange.innerText = `${change > 0 ? '+' : ''}${change}`;
		topUpdateTimer.start(tempHealthTop, target);	
	} else {
		if (tempHealthBot === 0) tempHealthBot = target[0];
		tempHealthBot += 1;
		botHealthChange.style.color = 'var(--pink)';
    let change = tempHealthBot - target[0];
		botHealthChange.innerText = `${change > 0 ? '+' : ''}${change}`;
		botUpdateTimer.start(tempHealthBot, target);
	}
}

function subtractHealth(e, target, updateTop) {
	if (updateTop) {
		if (tempHealthTop === 0) tempHealthTop = target[0];
		tempHealthTop -= 1;
		topHealthChange.style.color = 'var(--pink)';
    let change = tempHealthTop - target[0];
		topHealthChange.innerText = `${change > 0 ? '+' : ''}${change}`;
		topUpdateTimer.start(tempHealthTop, target);
	} else {
		if (tempHealthBot === 0) tempHealthBot = target[0];
		tempHealthBot -= 1;
		botHealthChange.style.color = 'var(--pink)';
		let change = tempHealthBot - target[0];
		botHealthChange.innerText = `${change > 0 ? '+' : ''}${change}`;
		botUpdateTimer.start(tempHealthBot, target);
	}
}

function replaceHistory(values, display, topPlayer) {
  display.innerHTML = '';
  
	values.forEach((value, index) => {
    const healthIcon = document.createElement('span');

    healthIcon.style.opacity = 1 - index * .07;
    healthIcon.innerText = value;
    healthIcon.style.padding = '0 5px';

		if (index > 9) {
			return;
		} else if (index > 2) {
      healthIcon.addEventListener('mousedown', () => topPlayer ? restoreHealthTop(index) : restoreHealthBot(index));

			display.appendChild(healthIcon);
		} else {
      healthIcon.style.fontSize = healthFontSize[index];

      healthIcon.addEventListener('mousedown', () => topPlayer ? restoreHealthTop(index) : restoreHealthBot(index));

			display.appendChild(healthIcon);
		}
	});
}

function restoreHealthTop(index) {
  topHealthRevert.innerHTML = '';

  const message = document.createElement('h2');
  const confirm = document.createElement('button');
  const cancel = document.createElement('button');

  message.innerText = `Revert health to ${topHealthValues[index+1]}?`;

  confirm.id = 'confirm-top-revert';
  cancel.id = 'cancel-top-revert';

  confirm.innerHTML = '<img src="./assets/check.png" alt="confirm-top">';
  cancel.innerHTML = '<img src="./assets/cross.png" alt="cancel-top">';

  confirm.addEventListener('mousedown', () => {
    topHealthValues = topHealthValues.splice(index+1);
    updateHealthDisplay();
    topHealthRevert.innerHTML = '';
    topHealthRevert.classList.toggle('hidden');
  });

  cancel.addEventListener('mousedown', () => {
    log('cancelling health revert');
    topHealthRevert.innerHTML = '';
    topHealthRevert.classList.toggle('hidden');
  });

  topHealthRevert.appendChild(message);
  topHealthRevert.appendChild(confirm);
  topHealthRevert.appendChild(cancel);

  topHealthRevert.classList.toggle('hidden');
}

function restoreHealthBot(index) {
  botHealthRevert.innerHTML = '';

  const message = document.createElement('h2');
  const confirm = document.createElement('button');
  const cancel = document.createElement('button');

  message.innerText = `Revert health to ${botHealthValues[index+1]}?`;

  confirm.id = 'confirm-bot-revert';
  cancel.id = 'cancel-bot-revert';

  confirm.innerHTML = '<img src="./assets/check.png" alt="confirm-bot">';
  cancel.innerHTML = '<img src="./assets/cross.png" alt="cancel-bot">';

  confirm.addEventListener('mousedown', () => {
    botHealthValues = botHealthValues.splice(index+1);
    updateHealthDisplay();
    botHealthRevert.innerHTML = '';
    botHealthRevert.classList.toggle('hidden');
  });

  cancel.addEventListener('mousedown', () => {
    log('cancelling health revert');
    botHealthRevert.innerHTML = '';
    botHealthRevert.classList.toggle('hidden');
  });

  botHealthRevert.appendChild(message);
  botHealthRevert.appendChild(confirm);
  botHealthRevert.appendChild(cancel);

  botHealthRevert.classList.toggle('hidden');
}

//* add a method for both players to need to confirm a game reset
function resetGame(e) {
	e.preventDefault();

  //* 2. add the buttons the the reset overlay, this will be the same process as used in the reversion

  //* 3. each button will be responsible for updating either the confirm or cancel value, then closing the popup if both have cancelled, as well as emptying the innerHTML
  //*    same will be applied for confirming a game reset

  //* 4. only if both players confirm the reset choice will the game properly reset, to avoid one person misclicking

  tempHealthTop = 0;
  topHealthChange.style.color = 'var(--dark)';
  topHealthChange.innerText = '0';

  tempHealthBot = 0;
  botHealthChange.style.color = 'var(--dark)';
  botHealthChange.innerText = '0';

  topUpdateTimer.cancel();
  botUpdateTimer.cancel();

	while (topHealthValues[0]) {
		topHealthValues.pop();
	}

	while (botHealthValues[0]) {
		botHealthValues.pop();
	}

	tempHealth = 0;
	topHealthValues.push(20);
	botHealthValues.push(20);

  topHealthRevert.classList.contains('hidden') ?? topHealthRevert.classList.toggle('hidden');
  botHealthRevert.classList.contains('hidden') ?? botHealthRevert.classList.toggle('hidden');

	updateHealthDisplay();
}

updateHealthDisplay();
