
window.onload = () => new maze.Main();

module maze {

  export class Main {

    private maze;
    private stage;

    public constructor() {

      this.stage = new Stage("mazeCanvas");

      this.maze = new Array(10000);
      var px = 0, py = 0, unit = 5;
      for(var i = 0; i < this.maze.length; i++) {
        if (i%100 === 0) {
          px = 0;
          py += unit;
        }
        this.maze[i] = new Room(px, py, unit, this.stage.ctx);
        this.maze[i].buildRoom();
        px += unit;
      }

    }

  }

  class Stage {

    private stage;
    private ctx;

    public constructor(canvasId) {

      this.stage = document.getElementById(canvasId);
      this.ctx = this.stage.getContext("2d");

    }

  }

  class Room {

    private px;
    private py;
    private ctx;
    private unit;
    private direct;

    public constructor(px, py, unit, ctx) {

      this.px = px;
      this.py = py;
      this.ctx = ctx;
      this.unit = unit;
      this.direct = [Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2)];
      /*
      if (Math.floor(Math.random() * 10) > 5) {
        this.direct = [1, 0, 1, 1];
      } else {
        this.direct = [1, 1, 1, 0];
      }
      */

    }

    public buildRoom() {

      this.ctx.beginPath();

      // top
      if (this.direct[0]) {
        this.ctx.moveTo(this.px, this.py);
        this.ctx.lineTo(this.px + this.unit, this.py);
      }

      // right
      if (this.direct[1]) {
        this.ctx.moveTo(this.px + this.unit, this.py);
        this.ctx.lineTo(this.px + this.unit, this.py + this.unit);
      }

      // bottom
      if (this.direct[2]) {
        this.ctx.moveTo(this.px + this.unit, this.py + this.unit);
        this.ctx.lineTo(this.px, this.py + this.unit);
      }

      // left
      if (this.direct[3]) {
        this.ctx.moveTo(this.px, this.py + this.unit);
        this.ctx.lineTo(this.px, this.py);
      }

      this.ctx.stroke();

    }

  }

}

