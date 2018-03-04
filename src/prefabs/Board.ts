import { Block } from '../prefabs/Block';
import { Game } from '../states/Game';

export interface IGridCoord {
  row: number;
  col: number;
}

export class Board {
  public grid: number[][];
  private blockVariations: number;
  private cols: number;
  private reserveGrid: number[][];
  private rows: number;
  private state: Game;

  constructor(state: Game, rows: number, cols: number, blockVariations: number) {
    this.state = state;
    this.rows = rows;
    this.cols = cols;
    this.blockVariations = blockVariations;

    this.grid = [];
    for (let i = 0; i < rows; i++) {
      this.grid.push([]);

      for (let j = 0; j < cols; j++) {
        this.grid[i].push(0);
      }
    }
    this.populateGrid();

    this.reserveGrid = [];
    for (let i = 0; i < rows; i++) {
      this.reserveGrid.push([]);

      for (let j = 0; j < cols; j++) {
        this.reserveGrid[i].push(0);
      }
    }
    this.populateReserveGrid();
  }

  public consoleLog() {
    let output = '';

    this.reserveGrid.forEach((row) => output += row.join(' ') + '\n');

    for (let i = 0; i < this.cols; i++) {
      output += '- ';
    }
    output.trim();
    output += '\n';

    this.grid.map((row) => output += row.join(' ') + '\n');

    console.log(output); // tslint:disable-line:no-console
  }

  public clearChains() {
    const chainedBlocks: IGridCoord[] = this.findAllChains();

    chainedBlocks.forEach((block) => {
      this.grid[block.row][block.col] = 0;
      this.state.getBlockFromColRow(block).kill();
    });
  }

  public checkAdjacent(source: IGridCoord, target: IGridCoord) {
    const diffRow = Math.abs(source.row - target.row);
    const diffCol = Math.abs(source.col - target.col);

    return (diffRow === 1 && diffCol === 0) || (diffRow === 0 && diffCol === 1);
  }

  public findAllChains() {
    const chained: IGridCoord[] = [];

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const coord = {row: i, col: j};
        if (this.isChained(coord)) {
          chained.push(coord);
        }
      }
    }

    return chained;
  }

  public swap(source: Block, target: Block) {
    const temp = this.grid[target.row][target.col];
    this.grid[target.row][target.col] = this.grid[source.row][source.col];
    this.grid[source.row][source.col] = temp;

    const tempPos: IGridCoord = {row: source.row, col: source.col};
    source.row = target.row;
    source.col = target.col;

    target.row = tempPos.row;
    target.col = tempPos.col;
  }

  public updateGrid() {
    let foundBlock = false;

    for (let i = this.rows - 1; i >= 0; i--) {
      for (let j = 0; j < this.cols; j++) {
        if (this.grid[i][j] === 0) {
          foundBlock = false;

          for (let k = i - 1; k >= 0; k--) {
            if (this.grid[k][j] > 0) {
              this.dropBlock(k, i, j);
              foundBlock = true;
              break;
            }
          }

          if (!foundBlock) {
            for (let k = this.rows - 1; k >= 0; k--) {
              if (this.reserveGrid[k][j] > 0) {
                this.dropReserveBlock(k, i, j);
                break;
              }
            }
          }
        }
      }
    }

    this.populateReserveGrid();
  }

  private dropBlock(sourceRow: number, targetRow: number, col: number) {
    this.grid[targetRow][col] = this.grid[sourceRow][col];
    this.grid[sourceRow][col] = 0;

    this.state.dropBlock(sourceRow, targetRow, col);
  }

  private dropReserveBlock(sourceRow: number, targetRow: number, col: number) {
    this.grid[targetRow][col] = this.reserveGrid[sourceRow][col];
    this.reserveGrid[sourceRow][col] = 0;

    this.state.dropReserveBlock(sourceRow, targetRow, col);
  }

  private isChained(block: IGridCoord) {
    let isChained = false;
    const row = block.row;
    const col = block.col;
    const variation = this.grid[row][col];

    // left
    if (variation === this.grid[row][col - 1] && variation === this.grid[row][col - 2]) {
      isChained = true;
    }

    // right
    if (variation === this.grid[row][col + 1] && variation === this.grid[row][col + 2]) {
      isChained = true;
    }

    // up
    if (
      this.grid[row - 2]
      && (variation === this.grid[row - 1][col] && variation === this.grid[row - 2][col])
    ) {
      isChained = true;
    }

    // down
    if (
      this.grid[row + 2]
      && (variation === this.grid[row + 1][col] && variation === this.grid[row + 2][col])
    ) {
      isChained = true;
    }

    // center - horizontal
    if (variation === this.grid[row][col - 1] && variation === this.grid[row][col + 1]) {
      isChained = true;
    }

    // center -vertical
    if (
      this.grid[row - 1]
      && this.grid[row + 1]
      && (variation === this.grid[row - 1][col] && variation === this.grid[row + 1][col])
    ) {
      isChained = true;
    }

    return isChained;
  }

  private populateGrid() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const variation = Math.floor(Math.random() * this.blockVariations) + 1;
        this.grid[i][j] = variation;
      }
    }

    const chains = this.findAllChains();
    if (chains.length > 0) {
      this.populateGrid();
    }
  }

  private populateReserveGrid() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const variation = Math.floor(Math.random() * this.blockVariations) + 1;
        this.reserveGrid[i][j] = variation;
      }
    }
  }
}
