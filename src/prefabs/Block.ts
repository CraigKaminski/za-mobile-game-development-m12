import { Game } from '../states/Game';

export interface IBlockData {
  asset: string;
  col: number;
  row: number;
}

export class Block extends Phaser.Sprite {
  public col: number;
  public row: number;
  private state: Game;

  constructor(state: Game, x: number, y: number, data: IBlockData) {
    super(state.game, x, y, data.asset);

    this.state = state;
    this.row = data.row;
    this.col = data.col;

    this.anchor.setTo(0.5);

    this.inputEnabled = true;
    this.events.onInputDown.add(state.pickBlock, this.state);
  }

  public kill() {
    this.loadTexture('deadBlock');
    this.col = -1;
    this.row = -1;

    this.game.time.events.add(this.state.AnimationTime / 2, () => {
      super.kill();
    }, this);

    return this;
  }

  public resetData(x: number, y: number, data: IBlockData) {
    super.reset(x, y);

    this.loadTexture(data.asset);
    this.row = data.row;
    this.col = data.col;

    return this;
  }
}
