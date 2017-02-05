import {EventEmitter} from 'events';

class state {
	constructor() {
		this.userName = '';
		this.gameResults = [];
		this.min = 0;
		this.max = 0;
		this.emitter = new EventEmitter();
	}
	addNewRound(state) {
		this.gameResults.push(state);
		this.emitter.emit('change');
	}
	saveGameDataToStorage() {
		localStorage.setItem("game", JSON.stringify(this.gameData));
	}
	loadGameDataFromStorage() {
		var gameString = localStorage.getItem("game");
		if (gameString === null) {
			return false;
		}
		var gameDataObject = JSON.parse(gameString);
		this.gameData = gameDataObject;
		return true;
	}
	reset() {
		this.gameResults = [];
		localStorage.removeItem("game");
		this.emitter.emit('change');
	}
	addListener(callback) {
		this.emitter.on('change', callback);
	}
	get user() {
		return this.userName;
	}
	set user(name) {
		this.userName = name;
		this.emitter.emit('change');
	}
	get range() {
		return [this.min, this.max];
	}
	set range(values) {
		this.min = values[0];
		this.max = values[1];
		this.emitter.emit('change');
	}
	get gameData() {
		return {
			gameResults: this.gameResults,
			min: this.min,
			max: this.max,
			user: this.userName
		}
	}
	set gameData(data) {
		this.gameResults = data.gameResults;
		this.min = data.min;
		this.max = data.max;
		this.userName = data.user;
		this.emitter.emit('change');
	}
	set currentState(state) {
		this.gameResults[this.gameResults.length - 1] = state;
		this.emitter.emit('change');
	}
	get currentState() {
		return this.gameResults[this.gameResults.length - 1];
	}
	get results() {
		return this.gameResults;
	}
};

export default state;
