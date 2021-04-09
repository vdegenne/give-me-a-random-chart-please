import { css, customElement, html, LitElement, property, query } from 'lit-element';
import '@material/mwc-button'
import '@material/mwc-circular-progress'

declare global {
  interface Window {
    app: GiveMeARandomChartPlease;
    clicker: HTMLAudioElement;
  }
}

declare type PairInfo = {
  b: string,
  q: string
}

declare module cryptowatch {
  class Embed {
    constructor(exchange: string, pair: string, options: Object);
    mount(target: string | HTMLElement): void;
  }
};

@customElement('give-me-a-random-chart-please')
export class GiveMeARandomChartPlease extends LitElement {
  private assets = ['USDT']

  private pairs: PairInfo[] = []

  @property({type:Boolean})
  private loading = false;

  @property({type:Object})
  private choosen?: PairInfo;

  @query('#cryptowatch-container') cryptowatchContainer!: HTMLDivElement;

  constructor() {
    super()
    this.fetchSymbols()
    window.app = this;

    window.addEventListener('gamepadconnected', e => {
      this.gamePadLoop()
    })
  }

  static styles = css`
  :host {
    display: flex;
    flex-direction: column;
    height: 100%;
    --mdc-theme-primary: #5e35b1;
  }
  #cryptowatch-wrapper {
    position: relative;
    /* display:flex;
    justify-content: center;
    align-items: center; */
    flex: 1;
  }
  #cryptowatch-wrapper > mwc-circular-progress {
    position: absolute;
    top: 48%;
    left: 48%;
  }
  #cryptowatch-container {
    height: 100%;
  }
  #cryptowatch-wrapper > #pair {
    background-color: black;
    color: white;
    font-weight: 500;
    font-size: 22px;
    padding: 2px 6px;
    position: absolute;
    top: 0;
    left: 0;
  }
  `

  render () {
    return html`
    <div style="margin:12px;text-align:center">
      <mwc-button unelevated icon="casino" style="--mdc-button-disabled-fill-color:grey;--mdc-button-disabled-ink-color:black"
        @click="${() => this.updateChart()}"
        ?disabled="${this.loading || this.pairs.length === 0}">random</mwc-button>
    </div>
    <div id="cryptowatch-wrapper">
      <div id="pair">${this.choosen?.b}${this.choosen?.q}</div>
      <mwc-circular-progress ?indeterminate="${this.loading}"></mwc-circular-progress>
      <div id="cryptowatch-container"></div>
    </div>
    `
  }

  private gamePadLoop() {
    const gp = navigator.getGamepads()[0]
    if (!gp) { return }

    if (buttonPressed(gp.buttons[2])) {
      // this.shadowRoot!.querySelector('mwc-button')!.click()
      this.updateChart()
    }
    requestAnimationFrame(() => this.gamePadLoop())
  }

  private async fetchSymbols() {
    const data = await (await fetch('https://www.binance.com/api/v3/exchangeInfo')).json()
    this.pairs = data.symbols.filter(s => s.status === 'TRADING').map(s => ({
      b: s.baseAsset,
      q: s.quoteAsset
    }))
    this.requestUpdate()
  }

  private updateChart () {
    if (this.loading) { return }
    clickSound()
    this.loading = true;
    this.cryptowatchContainer.firstElementChild?.remove()
    const pair = this.getRandomPair()
    this.updateCryptowatch(pair)
  }

  private getRandomPair() {
    const candidates = this.pairs.filter(p => this.assets.includes(p.b) || this.assets.includes(p.q))
    const choosen = candidates[Math.floor(Math.random() * candidates.length)]
    this.choosen = choosen;
    return choosen;
  }

  private updateCryptowatch (pair: PairInfo) {
    const chart = new cryptowatch.Embed('binance', `${pair.b}${pair.q}`, {
      timePeriod: '1d',
      presetColorScheme: 'ishihara'
    })
    chart.mount(this.cryptowatchContainer)
    setTimeout(() => {
      this.loading = false
    }, 6000)
  }
}


window.clicker = new Audio('./sounds/click.mp3')
function clickSound () {
  window.clicker.play();
}

function buttonPressed(b) {
  if (typeof (b) == "object") {
    return b.pressed;
  }
  return b == 1.0;
}