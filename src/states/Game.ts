import { Board } from '../prefabs/Board';

const NumRows = 8;
const NumCols = 8;
const NumVariations = 7;
const BlockSize = 35;
const AnimationTime = 200;

export class Game extends Phaser.State {
  private board: Board;

  public create() {
    this.add.sprite(0, 0, 'background');

    this.board = new Board(this, NumRows, NumCols, NumVariations);
  }
}
