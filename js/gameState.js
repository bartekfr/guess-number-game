import {EventEmitter} from 'events';

var userName = '';
var gameState = [];
var min = 0;
var max = 0;
var emitter = new EventEmitter();

var state = {
	addNewState(state) {
		gameState.push(state);
		emitter.emit('change');
	},
	saveGameDataToStorage() {
		localStorage.setItem("game", JSON.stringify(this.gameData));
	},
	loadGameDataFromStorage() {
		var gameString = localStorage.getItem("game");
		if (gameString === null) {
			return false;
		}
		var gameDataObject = JSON.parse(gameString);
		this.gameData = gameDataObject;
		return true;
	},
	reset() {
		gameState = [];
		localStorage.removeItem("game");
		emitter.emit('change');
	},
	addListener(callback) {
		emitter.on('change', callback);
	},
	get user() {
		return userName;
	},
	set user(name) {
		userName = name;
		emitter.emit('change');
	},
	get range() {
		return [min, max];
	},
	set range(values) {
		min = values[0];
		max = values[1];
		emitter.emit('change');
	},
	get gameData() {
		return {
			gameState: gameState,
			min: min,
			max: max,
			user: userName
		}
	},
	set gameData(data) {
		gameState = data.gameState;
		min = data.min;
		max = data.max;
		userName = data.user;
		emitter.emit('change');
	},
	set currentState(state) {
		gameState[gameState.length - 1] = state;
		emitter.emit('change');
	},
	get currentState() {
		return gameState[gameState.length - 1];
	},
	get state() {
		return gameState;
	}
};

export default state;
