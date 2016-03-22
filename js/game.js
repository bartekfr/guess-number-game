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
		this.game = gameModel;
		this.game.addListener(() => {
			this.render();
		});

		this.roundBtn = document.getElementById('new_round');
		this.number = document.getElementById('number');
		this.resetBtn = document.getElementById('reset');
		this.statsConsole = document.getElementById('stats_view');
		this.numbersButtons = document.getElementById('numbers');

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
			n = parseInt(n, 10);
			self.guess(n);
		}, false);
	}

	render() {
		this.numbersButtons.innerHTML = this.printNumbers();
		this.statsConsole.innerHTML = this.stats();
	}

	printNumbers() {
		var range = this.game.range;
		var min = range[0];
		var max = range[1];
		var n = min;
		var str = '';
		while(n <= max) {
			str += `<button data-number="${n}" type="button">${n}</button>`;
			n++;
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
		var c = 0;
		var u = 0;
		var walkovers = 0;
		if(l === 0) {
			return "There is no ongoing game";
		}
		var [c, u, walkovers] = this.calculateTotalResult(state); // desctructuring :D

		var user = this.game.user;
		var range = this.game.range;
		var min = range[0];
		var max = range[1];

		//last round data
		var lastRound = state[l - 1];
		var lastRoundComputer = lastRound.comp;
		var lastRoundUser = lastRound.user;
		var resultTxt = '';

		//prepare stats content
		if (this.roundFinished) {
			//round final result
			resultTxt = lastRoundComputer ? 'You lost :/' : 'You win. Congrats!';
			resultTxt += '<br/>Start new round to continue';
		} else {
			// ongoing round content
			let attemptResultTxt = lastRound.shots > 0 ? 'Wrong. Try again ' : 'Guess'; // texts for ongoing round
			let ongoingRoundTxt = `${attemptResultTxt} (${min} - ${max})`;
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
		var range = this.game.range;
		var min = range[0];
		var max = range[1];
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	saveState() {
		this.game.currentState = this.currentRoundState;
		this.game.saveGameData();
	}

	loadState() {
		var answer = confirm("Do you want load previous game?");
		if (!answer) {
			return false;
		}
		var dataLoaded = this.game.loadGameData();
		if (dataLoaded === false) {
			return false;
		}

		var gameState = this.game.state;
		var rounds = gameState.length;
		//init properties
		this.currentRoundState = gameState[rounds - 1];
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
