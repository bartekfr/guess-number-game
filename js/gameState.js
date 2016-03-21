import {EventEmitter} from 'events';

var userName = '';
var gameState = [];
var min = 0;
var max = 0;
var emitter = new EventEmitter();

var state = {
	addNewState: function(state) {
		gameState.push(state);
		if (gameState.length > 5) {
			this.removeOldest();
		}
		emitter.emit('change');
	},
	removeOldest: function () {
		gameState.shift();
	},
	saveGameData: function() {
		localStorage.setItem("game", JSON.stringify(this.gameData));
	},
	loadGameData: function() {
		var gameString = localStorage.getItem("game");
		if (gameString === null) {
			return false;
		}
		var gameDataObject = JSON.parse(gameString);
		this.gameData = gameDataObject;
		return true;
	},
	reset: function() {
		gameState = [];
		localStorage.removeItem("game");
		emitter.emit('change');
	},
	addListener: function(callback) {
		emitter.on('change', callback);
	}
}

//define properties with getters and setters
Object.defineProperty(state, 'user', {
	get: function() {
		return userName;
	},
	set: function(name) {
		userName = name;
		emitter.emit('change');
	}
});

Object.defineProperty(state, 'range', {
	set: function(values) {
		min = values[0];
		max = values[1];
		emitter.emit('change');
	},
	get: function() {
		return [min, max];
	},
});

Object.defineProperty(state, 'gameData', {
	get: function() {
		return{
			gameState: gameState,
			min: min,
			max: max,
			user: userName
		}
	},
	set: function(data) {
		gameState = data.gameState;
		min = data.min;
		max = data.max;
		userName = data.user;
		emitter.emit('change');
	},
});

Object.defineProperty(state, 'currentState', {
	set: function(state) {
		gameState[gameState.length - 1] = state;
		emitter.emit('change');
	},
});

Object.defineProperty(state, 'state', {
	get: function() {
		return gameState;
	},
});

export default state;
