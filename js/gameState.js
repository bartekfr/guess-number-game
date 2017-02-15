import { Subject } from 'rxjs/Subject';

class state {
	constructor() {
		this.emitter = new Subject();
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
		this.emitter.next();
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
		this.emitter.next();
	}
	subscribe(callback) {
		this.emitter.subscribe(() => callback());
	}
	setState(state) {
		this.state = Object.assign({}, this.state, state);
		this.emitter.next();
	}
};

export default state;
