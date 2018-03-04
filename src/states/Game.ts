import { Block, IBlockData } from '../prefabs/Block';
import { Board } from '../prefabs/Board';

const NumRows = 8;
const NumCols = 8;
const NumVariations = 6;
const BlockSize = 35;
const AnimationTime = 200;

export class Game extends Phaser.State {
  private blocks: Phaser.Group;
  private board: Board;

  public create() {
    this.add.sprite(0, 0, 'background');
    this.blocks = this.add.group();

    this.board = new Board(this, NumRows, NumCols, NumVariations);
    this.board.consoleLog();

    this.drawBoard();
  }

  private createBlock(x: number, y: number, data: IBlockData) {
    let block = this.blocks.getFirstExists(false);

    if (!block) {
      block = new Block(this, x, y, data);
      this.blocks.add(block);
    } else {
      block.resetData(x, y, data);
    }

    return block;
  }

  private drawBoard() {
    const squareBitmap = this.add.bitmapData(BlockSize + 4, BlockSize + 4);
    squareBitmap.ctx.fillStyle = '#000';
    squareBitmap.ctx.fillRect(0, 0, BlockSize + 4, BlockSize + 4);

    for (let i = 0; i < NumRows; i++) {
      for (let j = 0; j < NumCols; j++ ) {
        const x = 36 + j * (BlockSize + 6);
        const y = 150 + i * (BlockSize + 6);

        const square = this.add.sprite(x, y, squareBitmap);
        square.anchor.setTo(0.5);
        square.alpha = 0.2;

        this.createBlock(x, y, {asset: 'block' + this.board.grid[i][j], row: i, col: j});
      }
    }

    this.world.bringToTop(this.blocks);
  }
}
