const ReserveRows = 5;

export class Board {
  private blockVariations: number;
  private cols: number;
  private grid: any[];
  private reserveGrid: any[];
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

    this.reserveGrid = [];
    for (let i = 0; i < ReserveRows; i++) {
      this.reserveGrid.push([]);

      for (let j = 0; j < cols; j++) {
        this.reserveGrid[i].push(0);
      }
    }
  }
}
