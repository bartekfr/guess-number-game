import gameModel from './gameState';

class NumberGame  {
	constructor({
		min = 0,
		max = 10,
		user = "Anonymus"
	} = {}) {
		this.currentNumber;
		this.currentRoundState = null;
		this.shots = 0;
		this.roundFinished = true;
		this.store = gameModel;;
		this.roundBtn = document.getElementById('new_round');
		this.number = document.getElementById('number');
		this.resetBtn = document.getElementById('reset');
		this.statsConsole = document.getElementById('stats_view');
		this.numbersButtons = document.getElementById('numbers');
		this.easyModeBtn = document.getElementById('easy_mode');
		this.easyMode = this.easyModeBtn.checked;

		this.store.addListener(() => {
			this.render();
		});

		this.dataLoaded = this.loadState();

		/*
			if user continues game from previous session ignore parameters passed to constructor
		*/
		if (!this.dataLoaded) {
			this.setRange(min, max);
			this.store.user = user;
		}

		this.initDomEvemnts();
	}

	initDomEvemnts() {
		this.roundBtn.addEventListener('click', () => {
			this.round();
		}, false);

		this.resetBtn.addEventListener('click', () => {
			this.finish();
		}, false);

		this.numbersButtons.addEventListener('click', (e) => {
			var n = e.target.getAttribute('data-number');
			this.guess(parseInt(n, 10));
		}, false);

		this.easyModeBtn.addEventListener('click', (e) => {
			this.easyMode = e.target.checked;
			if (this.easyMode) {
				this.statsConsole.classList.add('easy');
			} else {
				this.statsConsole.classList.remove('easy');
			}
		}, false);
	}

	render() {
		this.numbersButtons.innerHTML = this.printNumbers();
		this.statsConsole.innerHTML = this.stats();
	}

	printNumbers() {
		var [min, max] = this.store.range;
		var str = '';

		while(min <= max) {
			str += `<button data-number="${min}" type="button">${min}</button>`;
			min++;
		}
		return str;
	}

	round() {
		if (!this.roundFinished) {
			this.currentRoundState.comp = 1;
			this.saveState();
		}
		this.roundFinished = false;
		this.shots = 0;
		this.currentNumber = this.drawLots();
		this.currentRoundState = {
			comp: 0,
			user: 0,
			n: this.currentNumber,
			lastShot: false,
			shots: 0
		};
		this.store.addNewState(this.currentRoundState);
		this.saveState();
	}

	guess(x) {
		this.shots++;
		if (this.roundFinished) {
			return;
		}
		this.currentRoundState.lastShot = x;
		if (x === this.currentNumber) {
			//user wins
			this.currentRoundState.user = 1;
			this.roundFinished = true;
		} else {
			//game continues
			let remainedTries = 3 - this.shots;
			if (!remainedTries) {
				this.currentRoundState.comp = 1;
				this.roundFinished = true;
			}

		}
		this.currentRoundState.shots = this.shots;
		this.saveState();
	}

	finish() {
		this.roundFinished = true;
		this.store.reset();
	}

	setUser(name) {
		this.store.user = name;
		this.saveState();
	}

	setRange(min, max) {
		if (max - min < 4) {
			max = min + 4;
			console.log("Range must include at least 4 numbers.");
		}
		this.store.range = [min, max];
		this.finish();//reset stats
	}

	stats() {
		var state = this.store.state;;
		var l = state.length;
		if(l === 0) {
			return "There is no ongoing game";
		}

		//destructuring and state getters :D
		var [c, u, walkovers] = this.calculateTotalResult(state);
		var {user, min, max} = this.store.gameData;
		var {comp: lastRoundComputer, user: lastRoundUser, lastShot: lastShot, shots: shots, n: n} = this.store.currentState;

		var resultTxt = '';

		//prepare stats content html
		if (this.roundFinished) {
			//round final result
			resultTxt = lastRoundComputer ? 'You lost :/' : 'You win. Congrats!';
			resultTxt += '<br/>Start new round to continue';
		} else {
			// ongoing round content
			let helpTxt = lastShot > n ? 'Try smaller number' : 'Try greater number';
			let attemptResultTxt = shots > 0 ? `Wrong. Try again <span class="help">${helpTxt}</span>` : 'Guess'; // texts for ongoing round
			let ongoingRoundTxt = `${attemptResultTxt} <br>Range: ${min} - ${max}`;
			resultTxt += `${ongoingRoundTxt} <br/>You still have ${3 - this.shots} attempts`;
		}
		//stats full text template
		var statsText = `<p>${resultTxt}</p>
		<h3>Computer ${c} : ${u} ${user}</h3>`;

		return statsText;
	}

	calculateTotalResult(state) {
		var c = 0;
		var u = 0;
		var walkovers = 0;
		state.forEach(function(v, i) {
			u += v.user;
			c += v.comp;
			if(v.comp === 1 && v.shots < 3) {
				walkovers++;
			}
		});
		return [c, u, walkovers];
	}

	drawLots() {
		var [min, max] = this.store.range;
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	saveState() {
		this.store.currentState = this.currentRoundState;
		this.store.saveGameDataToStorage();
	}

	loadState() {
		var answer = confirm("Do you want load previous game?");
		if (!answer) {
			return false;
		}
		var dataLoaded = this.store.loadGameDataFromStorage();
		if (dataLoaded === false) {
			return false;
		}

		//init properties
		this.currentRoundState = this.store.currentState;
		this.currentNumber = this.currentRoundState.n;
		this.shots = this.currentRoundState.shots;
		this.roundFinished = this.checkIfGameFinished();

		this.render();
		return true;
	}

	checkIfGameFinished() {
		return this.currentRoundState.user || this.currentRoundState.comp;
	}
};

export default NumberGame;
