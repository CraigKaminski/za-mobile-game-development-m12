interface IBlockData {
  asset: string;
}

export class Block extends Phaser.Sprite{
  private state: Phaser.State;

  constructor(state: Phaser.State, x: number, y: number, data: IBlockData) {
    super(state.game, x, y, data.asset);

    this.state = state;

    this.anchor.setTo(0.5);
  }
}
