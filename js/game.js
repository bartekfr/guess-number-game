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
		this.game = gameModel;;
		this.roundBtn = document.getElementById('new_round');
		this.number = document.getElementById('number');
		this.resetBtn = document.getElementById('reset');
		this.statsConsole = document.getElementById('stats_view');
		this.numbersButtons = document.getElementById('numbers');
		this.easyModeBtn = document.getElementById('easy_mode');
		this.easyMode = this.easyModeBtn.checked;

		this.game.addListener(() => {
			this.render();
		});

		this.dataLoaded = this.loadState();

		/*
			if user continues game from previous session ignore parameters passed to constructor
		*/
		if (!this.dataLoaded) {
			this.setRange(min, max);
			this.game.user = user;
		}

		this.initDomEvemnts();
	}

	initDomEvemnts() {
		var self = this;

		this.roundBtn.addEventListener('click', function() {
			self.round();
		}, false);

		this.resetBtn.addEventListener('click', function() {
			self.finish();
		}, false);

		this.numbersButtons.addEventListener('click', function(e) {
			var n = e.target.getAttribute('data-number');
			self.guess(parseInt(n, 10));
		}, false);

		this.easyModeBtn.addEventListener('click', function(e) {
			self.easyMode = this.checked;
			if (self.easyMode) {
				self.statsConsole.classList.add('easy');
			} else {
				self.statsConsole.classList.remove('easy');
			}
		}, false);
	}

	render() {
		this.numbersButtons.innerHTML = this.printNumbers();
		this.statsConsole.innerHTML = this.stats();
	}

	printNumbers() {
		var [min, max] = this.game.range;
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
		this.game.addNewState(this.currentRoundState);
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
		this.game.reset();
	}

	setUser(name) {
		this.game.user = name;
		this.saveState();
	}

	setRange(min, max) {
		if (max - min < 4) {
			max = min + 4;
			console.log("Range must include at least 4 numbers.");
		}
		this.game.range = [min, max];
		this.finish();//reset stats
	}

	stats() {
		var state = this.game.state;;
		var l = state.length;
		if(l === 0) {
			return "There is no ongoing game";
		}

		//destructuring and state getters :D
		var [c, u, walkovers] = this.calculateTotalResult(state);
		var {user, min, max} = this.game.gameData;
		var {comp: lastRoundComputer, user: lastRoundUser, lastShot: lastShot, shots: shots, n: n} = this.game.currentState;

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
			let ongoingRoundTxt = `${attemptResultTxt} <br>Range:${min} - ${max}`;
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
		var [min, max] = this.game.range;
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	saveState() {
		this.game.currentState = this.currentRoundState;
		this.game.saveGameDataToStorage();
	}

	loadState() {
		var answer = confirm("Do you want load previous game?");
		if (!answer) {
			return false;
		}
		var dataLoaded = this.game.loadGameDataFromStorage();
		if (dataLoaded === false) {
			return false;
		}

		//init properties
		this.currentRoundState = this.game.currentState;
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
