import { Game } from '../states/Game';

export interface IBlockData {
  asset: string;
  col: number;
  row: number;
}

export class Block extends Phaser.Sprite {
  public col: number | null;
  public row: number | null;
  private state: Game;

  constructor(state: Game, x: number, y: number, data: IBlockData) {
    super(state.game, x, y, data.asset);

    this.state = state;
    this.row = data.row;
    this.col = data.col;

    this.anchor.setTo(0.5);
  }

  public kill() {
    this.loadTexture('deadBlock');
    this.col = null;
    this.row = null;

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
