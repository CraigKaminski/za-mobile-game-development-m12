const ReserveRows = 5;

export class Board {
  private blockVariations: number;
  private cols: number;
  private grid: number[][];
  private reserveGrid: number[][];
  private rows: number;
  private state: Phaser.State;

  constructor(state: Phaser.State, rows: number, cols: number, blockVariations: number) {
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
    for (let i = 0; i < ReserveRows; i++) {
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

    console.log(output);
  }

  private populateGrid() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const variation = Math.floor(Math.random() * this.blockVariations) + 1;
        this.grid[i][j] = variation;
      }
    }
  }

  private populateReserveGrid() {
    for (let i = 0; i < ReserveRows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const variation = Math.floor(Math.random() * this.blockVariations) + 1;
        this.reserveGrid[i][j] = variation;
      }
    }
  }
}
