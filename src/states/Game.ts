import { Block, IBlockData } from '../prefabs/Block';
import { Board, IGridCoord } from '../prefabs/Board';

const NumRows = 8;
const NumCols = 8;
const NumVariations = 6;
const BlockSize = 35;

export class Game extends Phaser.State {
  public readonly AnimationTime = 200;
  private blocks: Phaser.Group;
  private board: Board;
  private isBoardBlocked = false;
  private isReversingSwap = false;
  private selectedBlock: Block | null;
  private targetBlock: Block | null;

  public create() {
    this.add.sprite(0, 0, 'background');
    this.blocks = this.add.group();

    this.board = new Board(this, NumRows, NumCols, NumVariations);
    this.board.consoleLog();

    this.drawBoard();
  }

  public dropBlock(sourceRow: number, targetRow: number, col: number) {
    const block = this.getBlockFromColRow({ row: sourceRow, col });
    const targetY = 150 + targetRow * (BlockSize + 6);

    block.row = targetRow;

    const blockMovement = this.add.tween(block);
    blockMovement.to({ y: targetY }, this.AnimationTime);
    blockMovement.start();
  }

  public dropReserveBlock(sourceRow: number, targetRow: number, col: number) {
    const x = 36 + col * (BlockSize + 6);
    const y = -(BlockSize + 6) * NumRows + sourceRow * (BlockSize + 6);

    const block = this.createBlock(x, y, { asset: 'block' + this.board.grid[targetRow][col], row: targetRow, col });
    const targetY = 150 + targetRow * (BlockSize + 6);

    const blockMovement = this.add.tween(block);
    blockMovement.to({ y: targetY }, this.AnimationTime);
    blockMovement.start();
  }

  public getBlockFromColRow(position: IGridCoord) {
    let foundBlock: Block = this.blocks.getFirstDead();

    this.blocks.forEachAlive((block: Block) => {
      if (block.row === position.row && block.col === position.col) {
        foundBlock = block;
      }
    }, this);

    return foundBlock;
  }

  public pickBlock(block: Block) {
    if (this.isBoardBlocked) {
      return;
    }

    if (!this.selectedBlock) {
      block.scale.setTo(1.5);

      this.selectedBlock = block;
    } else {
      this.targetBlock = block;

      if (this.board.checkAdjacent(this.selectedBlock, this.targetBlock)) {
        this.isBoardBlocked = true;

        this.swapBlocks(this.selectedBlock, this.targetBlock);
      } else {
        this.clearSelection();
      }
    }
  }

  private clearSelection() {
    this.isBoardBlocked = false;
    this.selectedBlock = null;
    this.blocks.setAll('scale.x', 1);
    this.blocks.setAll('scale.y', 1);
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
      for (let j = 0; j < NumCols; j++) {
        const x = 36 + j * (BlockSize + 6);
        const y = 150 + i * (BlockSize + 6);

        const square = this.add.sprite(x, y, squareBitmap);
        square.anchor.setTo(0.5);
        square.alpha = 0.2;

        this.createBlock(x, y, { asset: 'block' + this.board.grid[i][j], row: i, col: j });
      }
    }

    this.world.bringToTop(this.blocks);
  }

  private swapBlocks(block1: Block, block2: Block) {
    block1.scale.setTo(1);

    const block1Movement = this.add.tween(block1);
    block1Movement.to({ x: block2.x, y: block2.y }, this.AnimationTime);
    block1Movement.onComplete.add(() => {
      this.board.swap({ row: block1.row, col: block1.col }, { row: block2.row, col: block2.col });

      if (!this.isReversingSwap) {
        const chains = this.board.findAllChains();

        if (chains.length > 0) {
          this.board.clearChains();
          this.board.updateGrid();
        } else {
          this.isReversingSwap = true;
          this.swapBlocks(block1, block2);
        }
      } else {
        this.isReversingSwap = false;
        this.clearSelection();
      }
    }, this);
    block1Movement.start();

    const block2Movement = this.add.tween(block2);
    block2Movement.to({ x: block1.x, y: block1.y }, this.AnimationTime);
    block2Movement.start();
  }
}
