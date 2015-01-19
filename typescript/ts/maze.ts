
// ToDo
// 迷路が出来ていく過程
// 高速化・リファクタリング・TSに最適化
// クリックで出口までの経路表示 先に答えを用意しておく 入口から反対側の壁をランダムで辿って出口を設定するように

window.onload = () => new maze.Main();

module maze {

  export class Main {

    public stage;

    public maze;
    public maze_cols = 50;
    public maze_rows = 50;
    public maze_unit = 10;
    public maze_rooms = this.maze_cols * this.maze_rows;

    public constructor() {

      this.stage = new Stage("mazeCanvas");

      this.maze = new Array(this.maze_rooms);

      var px = 0, py = 0;

      for(var i = 0; i < this.maze_rooms; i++) {

        if (i%this.maze_cols == 0) {
          px = 0;
          py += this.maze_unit;
        }

        this.maze[i] = new Room(i, px, py, this.maze_unit, this.stage.ctx);
        px += this.maze_unit;

      }

      this.mazeBuild();

    }

    public mazeBuild() {

      // 入口と出口の作成
      // 入口は上か左かの2パターンを用意
      var rd = Math.floor(Math.random() * 2);

      // 壁を壊す
      switch (rd) {

        // 上下パターン
        case 0:
          // 入口は最上段の中から壊す
          var rr = Math.floor(Math.random() * this.maze_rows);
          if (this.maze[rr].direct[0]) {
            this.maze[rr].direct[0] = 0;
          }
        break;

        // 左右のパターン
        case 1:
          // 入口は最左段の中から壊す
          var rr = Math.floor(Math.random() * this.maze_rows) * this.maze_rows;
          if (this.maze[rr].direct[3]) { 
            this.maze[rr].direct[3] = 0;
          }
        break;

      }

      // ToDo 経路の作成 反対側の壁までのidxを0にしていく。
      var maze_building = true;
      while (maze_building) {
        maze_building = false;
      }

      // 端以外の壁を壊す
      maze_building = true;
      while (maze_building) {

        // ランダムな部屋のランダムな方角の壁を壊す
        var rd = Math.floor(Math.random() * 4);
        var rr = Math.floor(Math.random() * this.maze_rooms);

        // 壁があるか
        if (this.maze[rr].direct[rd]) {

          // 隣り合う壁が存在するかどうかをチェック
          switch (rd) {

            // 上壁の場合
            case 0:
              // 最上段以外 上の列の下壁が存在するのでそれも壊す
              if (rr > this.maze_rows) {
                // すでに繋がっていないかどうか
                if (this.maze[rr].idx != this.maze[rr - this.maze_rows].idx) {
                  // 繋がってなければ隣り合う壁と共に壊す
                  this.maze[rr].direct[0] = 0;
                  this.maze[rr - this.maze_rows].direct[2] = 0;
                  // 繋がった部屋を小さい方の値でクラスタリング
                  this.clustering(this.maze[rr].idx, this.maze[rr - this.maze_rows].idx);
                }
              }
            break;

            // 右壁の場合
            case 1:
              // 最右段以外 右の列の左壁が存在するのでそれも壊す
              if (rr%this.maze_rows != this.maze_rows - 1) {
                // すでに繋がっていないかどうか
                if (this.maze[rr].idx != this.maze[rr + 1].idx) {
                  // 繋がってなければ隣り合う壁と共に壊す
                  this.maze[rr].direct[1] = 0;
                  this.maze[rr + 1].direct[3] = 0;
                  // 繋がった部屋を小さい方の値でクラスタリング
                  this.clustering(this.maze[rr].idx, this.maze[rr + 1].idx);
                }
              }
            break;

            // 下壁の場合
            case 2:
              // 最下段以外 下の列の上壁が存在するのでそれも壊す
              if (rr < this.maze_rooms - this.maze_rows) {
                // すでに繋がっていないかどうか
                if (this.maze[rr].idx != this.maze[rr + this.maze_rows].idx) {
                  // 繋がってなければ隣り合う壁と共に壊す
                  this.maze[rr].direct[2] = 0;
                  this.maze[rr + this.maze_rows].direct[0] = 0;
                  // 繋がった部屋を小さい方の値でクラスタリング
                  this.clustering(this.maze[rr].idx, this.maze[rr + this.maze_rows].idx);
                }
              }
            break;

            // 左壁の場合
            case 3:
              // 最左段以外 左の列の右壁が存在するのでそれも壊す
              if (rr > 0 && rr%this.maze_rows != 0) {
                // すでに繋がっていないかどうか
                if (this.maze[rr].idx != this.maze[rr - 1].idx) {
                  // 繋がってなければ隣り合う壁と共に壊す
                  this.maze[rr].direct[3] = 0;
                  this.maze[rr - 1].direct[1] = 0;
                  // 繋がった部屋を小さい方の値でクラスタリング
                  this.clustering(this.maze[rr].idx, this.maze[rr - 1].idx);
                }
              }
            break;

          }

        }

        maze_building = false;
        for(var i = 0; i < this.maze_rooms; i++) {
          // this.maze[i].buildRoom();
          // クラスタリングが完了する(全部の部屋が繋がる)までループ
          if (this.maze[i].idx > 0) maze_building = true;
        }

      }

      // 再描写
      for(var i = 0; i < this.maze_rooms; i++) {
        this.maze[i].buildRoom();
      }

    }

    public clustering(val1, val2) {
      var idx_min = Math.min(val1, val2);
      // すでに繋がっている別の部屋があればそれも一緒にクラスタリング
      for(var i = 0; i < this.maze_rooms; i++) {
        if (this.maze[i].idx == val1 || this.maze[i].idx == val2) {
          this.maze[i].idx = idx_min;
        }
      }
    }

  }

  export class Stage {

    public stage;
    public ctx;

    public constructor(canvasId) {
      this.stage = document.getElementById(canvasId);
      this.ctx = this.stage.getContext("2d");
    }

  }

  export class Room {

    public px;
    public py;
    public ctx;
    public idx;
    public unit;
    public direct;

    public constructor(idx, px, py, unit, ctx) {

      this.px = px;
      this.py = py;
      this.ctx = ctx;
      this.idx = idx;
      this.unit = unit;
      this.direct = [1, 1, 1, 1];

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

      // this.ctx.fillText(this.idx, this.px, this.py);
      this.ctx.stroke();

    }

  }

}

