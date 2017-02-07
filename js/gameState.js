import {EventEmitter} from 'events';

class state {
	constructor() {
		this.emitter = new EventEmitter();
		this.state = {
			min: 0,
			max: 2,
			userName: '',
			gameResults: []
		}
	}
	addNewRound(state) {
		this.setState({
			gameResults: this.state.gameResults.concat(state)
		})
		this.emitter.emit('change');
	}
	saveGameDataToStorage() {
		localStorage.setItem("game", JSON.stringify(this.state));
	}
	loadGameDataFromStorage() {
		var gameString = localStorage.getItem("game");
		if (gameString === null) {
			return false;
		}
		var gameDataObject = JSON.parse(gameString);
		this.setState(gameDataObject);
		return true;
	}
	reset() {
		this.gameResults = [];
		this.setState({
			gameResults: []
		})
		localStorage.removeItem("game");
		this.emitter.emit('change');
	}
	addListener(callback) {
		this.emitter.on('change', callback);
	}
	setState(state) {
		this.state = Object.assign({}, this.state, state);
		this.emitter.emit('change');
	}
};

export default state;
