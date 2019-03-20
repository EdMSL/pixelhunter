import {renderScreen} from './utils.js';
import Loader from './loader.js';
import ErrorController from './error-controller.js';
import IntroController from './intro-controller.js';
import GreetingController from './greeting-controller.js';
import RulesController from './rules-controller.js';
import GameModel from './game-model.js';
import GameController from './game-controller.js';
import StatsController from './stats-controller.js';

let gameData;

class Application {
  static start() {
    Application.load.catch(Application.showError);
  }

  static async load() {
    try {
      gameData = await Loader.loadGameData();
      Application.showGreeting();
    } finally {
      console.log(`Complete`);
    }
  }

  static showWelcome() {
    if (!gameData) {
      const welcomeScreen = new IntroController();
      renderScreen(welcomeScreen.introView.element);
      Application.start();
    } else {
      Application.showGreeting();
    }
  }

  static showGreeting() {
    const greetingScreen = new GreetingController();
    renderScreen(greetingScreen.greetingView.element);
  }

  static showRules() {
    const rulesScreen = new RulesController();
    renderScreen(rulesScreen.rulesView.element);
  }

  static showGame(playerName) {
    const gameScreen = new GameController(new GameModel(gameData, playerName));
    gameScreen.startGame();
  }

  static showStats(stats) {
    const playerName = stats.playerName;
    const statsScreen = new StatsController(stats.state);
    renderScreen(statsScreen.statsView.element);
    Loader.saveStats(stats.state, playerName).
      then(() => Loader.loadStats(playerName)).
      catch(Application.showError);
  }

  static showError(error) {
    const errorModal = new ErrorController(error);
    renderScreen(errorModal.errorView.element);
  }
}

export default Application;
