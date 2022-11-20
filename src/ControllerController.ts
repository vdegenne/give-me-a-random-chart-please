import gameControl from 'gamecontroller.js/src/gamecontrol.js'
import { GiveMeARandomChartPlease } from './give-me-a-random-chart-please.js';

export class ControllerController {
  private app: GiveMeARandomChartPlease;

  /**
   * Constructor
   */
  constructor (appInstance: GiveMeARandomChartPlease) {
    this.app = appInstance;
    gameControl.on('connect', gamepad=>{
      gamepad
      .before('button3', ()=>{
        this.app.loadANewChart()
      })
      .before('button2', () => {
        this.app.visitCoinMarketCap()
      })
    })
  }
}