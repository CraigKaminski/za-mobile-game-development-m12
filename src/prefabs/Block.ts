export interface IBlockData {
  asset: string;
  col: number;
  row: number;
}

export class Block extends Phaser.Sprite {
  private col: number;
  private row: number;
  private state: Phaser.State;

  constructor(state: Phaser.State, x: number, y: number, data: IBlockData) {
    super(state.game, x, y, data.asset);

    this.state = state;
    this.row = data.row;
    this.col = data.col;

    this.anchor.setTo(0.5);
  }

  public resetData(x: number, y: number, data: IBlockData) {
    super.reset(x, y);

    this.loadTexture(data.asset);
    this.row = data.row;
    this.col = data.col;

    return this;
  }
}
