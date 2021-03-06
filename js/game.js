import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/last';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/range';
import GameModel from './gameState';

class NumberGame  {
	constructor({
		min = 0,
		max = 10,
		userName = "Anonymus"
	} = {}) {
		this.currentRoundState = {};
		this.store = new GameModel();
		this.roundBtn = document.getElementById('new_round');
		this.number = document.getElementById('number');
		this.resetBtn = document.getElementById('reset');
		this.statsConsole = document.getElementById('stats_view');
		this.numbersButtons = document.getElementById('numbers');
		this.easyModeBtn = document.getElementById('easy_mode');
		this.easyMode = this.easyModeBtn.checked;

		this.store.subscribe((state) => {
			this.render(state);
		});

		this.dataLoaded = this.loadState();

		/*
			if user continues game from previous session ignore parameters passed to constructor
		*/
		if (!this.dataLoaded) {
			this.store.setState({
				min,
				max,
				userName
			});
		}

		this.initDomEvemnts();
	}

	initDomEvemnts() {
		Observable.fromEvent(this.roundBtn, 'click').subscribe(() => {
			this.round();
		});

		Observable.fromEvent(this.resetBtn, 'click').subscribe(() => {
			this.finish();
		});

		Observable.fromEvent(this.numbersButtons, 'click')
			.map((e) => parseInt(e.target.getAttribute('data-number'), 10))
			.filter(() => !this.checkIfGameFinished())
			.subscribe((n) => {
				this.guess(n);
			});

		Observable.fromEvent(this.easyModeBtn, 'click').subscribe((e) => {
			this.easyMode = e.target.checked;
			if (this.easyMode) {
				this.statsConsole.classList.add('easy');
			} else {
				this.statsConsole.classList.remove('easy');
			}
		});
	}

	render(state) {
		this.printNumbers(state);
		this.stats(state);
	}

	printNumbers() {
		let { min, max } = this.store.state;
		Observable.range(min, max - min + 1)
			.reduce((str, n) => str += `<button data-number="${n}" type="button">${n}</button>`, '')
			.last()
			.subscribe((str) => this.numbersButtons.innerHTML = str);

	}

	round() {
		if (!this.checkIfGameFinished()) {
			this.currentRoundState.comp = 1;
			this.saveState();
		}

		this.currentRoundState = {
			comp: 0,
			user: 0,
			n: this.drawLots(),
			lastShot: false,
			shots: 0
		};
		this.store.addNewRound({...this.currentRoundState});
		this.saveState();
	}

	guess(x) {
		this.currentRoundState.shots++;
		this.currentRoundState.lastShot = x;
		if (x === this.currentRoundState.n) {
			//user wins
			this.guessSuccess();
		} else {
			this.guessFailure();

		}
		this.saveState();
	}

	guessSuccess() {
		this.currentRoundState.user = 1;
	}

	guessFailure() {
		if (this.currentRoundState.shots === 3) {
			this.currentRoundState.comp = 1;
		}
	}

	finish() {
		this.currentRoundState = {};
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
		this.store.setState({min, max});
		this.finish();//reset stats
	}

	statsTextForFinishedGame(computerWin) {
		let resultTxt = computerWin ? 'You lost :/' : 'You win. Congrats!';
		return resultTxt += '<br/>Start new round to continue';
	}

	statsTextForOngoingGame(lastShot, shots, n) {
		let helpTxt = lastShot > n ? 'Try smaller number' : 'Try greater number';
		let attemptResultTxt = shots > 0 ? `Wrong. Try again <span class="help">${helpTxt}</span>` : 'Guess'; // texts for ongoing round
		return `${attemptResultTxt} <br/>You still have ${3 - shots} attempts`;
	}

	stats() {
		let state = this.store.state.gameResults;
		if (!state.length) {
			this.statsConsole.innerHTML = ''
			return;
		}

		//destructuring and state getters :D
		let { c, u } = this.calculateTotalResult(state);
		let { userName, min, max } = this.store.state;
		let {comp: lastRoundComputer, user: lastRoundUser, lastShot: lastShot, shots: shots, n: n} = this.currentRoundState;

		let resultTxt = '';

		//prepare stats content html
		if (this.checkIfGameFinished()) {
			//round final result
			resultTxt = this.statsTextForFinishedGame(lastRoundComputer);
		} else {
			// ongoing round content
			resultTxt = this.statsTextForOngoingGame(lastShot, shots, n);
		}
		//stats full text template
		this.statsConsole.innerHTML = `
				<p>${resultTxt}</p>
				<h3>Computer ${c} : ${u} ${userName}</h3>
			`;
	}

	calculateTotalResult(state) {
		return state.reduce((acc, v, i) => ({
			u: acc.u += v.user,
			c: acc.c += v.comp
		}), {c: 0, u: 0 });
	}

	drawLots() {
		let { min, max } = this.store.state;
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	saveState() {
		let gameResultsCopy = this.store.state.gameResults.slice();
		gameResultsCopy[gameResultsCopy.length - 1] = {...this.currentRoundState};

		this.store.setState({
			gameResults: gameResultsCopy
		});
		this.store.saveGameDataToStorage();
	}

	loadState() {
		let answer = confirm("Do you want load previous game?");
		if (!answer) {
			return false;
		}
		let dataLoaded = this.store.loadGameDataFromStorage();
		if (dataLoaded === false) {
			return false;
		}

		//init properties
		this.currentRoundState = {...this.store.lastRound};

		this.render(this.store.state);
		return true;
	}

	checkIfGameFinished() {
		let isFinished = this.currentRoundState.user || this.currentRoundState.comp || this.currentRoundState.shots >= 3;
		return !!isFinished;
	}
};

export default NumberGame;
