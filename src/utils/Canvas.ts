export class Circle {
  x: number;
  y: number;
  r: number;
  _mx: number;
  _my: number;
  //创建对象
  //以一个圆为对象
  //设置随机的 x，y坐标，r半径，_mx，_my移动的距离
  //this.r是创建圆的半径，参数越大半径越大
  //this._mx,this._my是移动的距离，参数越大移动
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.r = Math.random() * 10;
    this._mx = Math.random();
    this._my = Math.random();
  }

  //canvas 画圆和画直线
  //画圆就是正常的用canvas画一个圆
  //画直线是两个圆连线，为了避免直线过多，给圆圈距离设置了一个值，距离很远的圆圈，就不做连线处理
  drawCircle(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    //arc() 方法使用一个中心点和半径，为一个画布的当前子路径添加一条弧。
    ctx.arc(this.x, this.y, this.r, 0, 360);
    ctx.closePath();
    ctx.fillStyle = "rgba(204, 204, 204, 0.3)";
    ctx.fill();
  }

  drawLine(ctx: CanvasRenderingContext2D, _circle: Circle) {
    let dx = this.x - _circle.x;
    let dy = this.y - _circle.y;
    let d = Math.sqrt(dx * dx + dy * dy);
    if (d < 150) {
      ctx.beginPath();
      //开始一条路径，移动到位置 this.x,this.y。创建到达位置 _circle.x,_circle.y 的一条线：
      ctx.moveTo(this.x, this.y); //起始点
      ctx.lineTo(_circle.x, _circle.y); //终点
      ctx.closePath();
      ctx.strokeStyle = "rgba(204, 204, 204, 0.3)";
      ctx.stroke();
    }
  }

  // 圆圈移动
  // 圆圈移动的距离必须在屏幕范围内
  move(w: number, h: number) {
    this._mx = this.x < w && this.x > 0 ? this._mx : -this._mx;
    this._my = this.y < h && this.y > 0 ? this._my : -this._my;
    this.x += this._mx / 2;
    this.y += this._my / 2;
  }
}
//鼠标点画圆闪烁变动
export class CurrentCirle extends Circle {
  constructor(x: number, y: number) {
    super(x, y);
  }

  drawCircle(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    //注释内容为鼠标焦点的地方圆圈半径变化
    //this.r = (this.r < 14 && this.r > 1) ? this.r + (Math.random() * 2 - 1) : 2;
    this.r = 8;
    ctx.arc(this.x, this.y, this.r, 0, 360);
    ctx.closePath();
    //ctx.fillStyle = 'rgba(0,0,0,' + (parseInt(Math.random() * 100) / 100) + ')'
    ctx.fillStyle = "rgba(255, 77, 54, 0.6)";
    ctx.fill();
  }
}

export function start() {
  //@ts-ignore
  let canvas: HTMLCanvasElement = document.getElementById("canvas");
  //@ts-ignore
  let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
  let w = (canvas!.width = canvas.offsetWidth);
  let h = (canvas!.height = canvas.offsetHeight);
  let circles: any[] = [];
  let current_circle = new CurrentCirle(0, 0);

  let draw = function () {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < circles.length; i++) {
      circles[i].move(w, h);
      circles[i].drawCircle(ctx);
      for (let j = i + 1; j < circles.length; j++) {
        circles[i].drawLine(ctx, circles[j]);
      }
    }
    if (current_circle.x) {
      current_circle.drawCircle(ctx);
      for (let k = 1; k < circles.length; k++) {
        current_circle.drawLine(ctx, circles[k]);
      }
    }
    requestAnimationFrame(draw);
  };

  let init = function (num: number) {
    for (let i = 0; i < num; i++) {
      circles.push(new Circle(Math.random() * w, Math.random() * h));
    }
    draw();
  };
  //@ts-ignore
  window.addEventListener("load", init(60));
  window.onmousemove = function (e:MouseEvent) {
    e = e || window.event;
    current_circle.x = e.clientX;
    current_circle.y = e.clientY;
  };
  window.onmouseout = function () {
    //@ts-ignore
    current_circle.x = null;
    //@ts-ignore
    current_circle.y = null;
  };
}
