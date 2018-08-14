(function mandelbrot(){

var cvs = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

var b_cvs = document.createElement('canvas');
var b_ctx = b_cvs.getContext('2d');
b_cvs.width = cvs.width;
b_cvs.height = cvs.height;

/*
x1 -1.2588676966;
x2 -1.2587907292
y1 -0.3711189110
y2 -0.3710433717
*/


var w = 600;

var offset_x = -2.5;
var offset_y = -1.5;
var width = 3.5;
var height = 3.5;

var x1 = offset_x,
  x2 = offset_x + width,
  y1 = offset_y,
  y2 = offset_y + height;


/*
x1 = -1.2588676966;
x2 = -1.2587907292;
y1 = -0.3711189110;
y2 = -0.3710433717;
*/
  

get_mandelbrot(x1, x2, y1, y2);

//get_mandelbrot(-0.7648822992569296, -0.7648819943929859, -0.08803101236266861, -0.08803070749872476, 8065);

function clear_canvas() {
  b_ctx.save();

  // Use the identity matrix while clearing the canvas
  b_ctx.setTransform(1, 0, 0, 1, 0, 0);
  b_ctx.clearRect(0, 0, b_cvs.width, b_cvs.height);

  // Restore the transform
  b_ctx.restore();
  
 // https://stackoverflow.com/questions/2142535/how-to-clear-the-canvas-for-redrawing

}

function get_iterations(x1, x2){
  return Math.floor(Math.log(((5 / Math.abs(x1 - x2)) * 500)) * 200, 0);
}

function get_mandelbrot(x1, x2, y1, y2, max_it) {
  clear_canvas();
  max_it = (max_it || get_iterations(x1, x2))
  var small_amount = (x2 - x1) / w;
  var py = 0;
  var total = (y1 - y2) * (x1 - x2);
  
  for (var y = y1; y <= y2; y += small_amount) {
    var px = 0;
    for (var x = x1; x <= x2; x += small_amount) {
      b_ctx.fillStyle = get_color(x, y, max_it);
      b_ctx.fillRect(px, py, 1, 1);
      px++;
    }
    ctx.fillStyle = "#FF0000";
    let fill_amt = ((y * x) / total) * w;
    ctx.fillRect(0, w - 116, fill_amt, 10);
    //if (py % 100 == 0) ctx.fillRect(0, w - 116, py, 10);
    py++;
  }
  b_ctx.fillStyle = 'red';
  b_ctx.font = '14px sans-serif';
  b_ctx.fillText("x1 " + x1.toFixed(5), 1, 15);
  b_ctx.fillText("x2 " + x2.toFixed(5), 1, 30);
  
  b_ctx.fillText("w " + (x2 - x1).toFixed(5), 100, 22);
  
  b_ctx.fillText("y1 " + y1.toFixed(5), 1, 45);
  b_ctx.fillText("y2 " + y2.toFixed(5), 1, 60);
  
  
  b_ctx.fillText("h " + (y2 - y1).toFixed(5), 100, 52);


 b_ctx.fillText("mx " + get_iterations(x1, x2).toFixed(5), 1, 85);

  ctx.drawImage(b_cvs, 0, 0);
}

function get_color(x0, y0, MAX_IT) {
  var ESCAPE = 2 * 2,
    x = 0,
    y = 0,
    iteration = 0;

  while (x * x + y * y <= ESCAPE && iteration < MAX_IT) {
    var xtemp = x * x - y * y + x0;
    y = 2 * x * y + y0;
    x = xtemp;
    iteration++;
  }
  if (iteration === MAX_IT) return "#000000" //black
  var c = Math.log(iteration) / Math.log(MAX_IT - 1.0);
  return float2color(c);
}


function float2color(percentage) {
  var c_p_dec = 255 * percentage;
  var c_p_hex = Number(parseInt(c_p_dec, 10)).toString(16);
  return "#" + c_p_hex + c_p_hex + c_p_hex;
}

//https://rosettacode.org/wiki/Mandelbrot_set#JavaScript

var rect = {},
  drag = false;

function draw() {
  ctx.drawImage(b_cvs, 0, 0);
  ctx.setLineDash([6]);
  ctx.strokeStyle = "#FF0000";
  ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
}

function mouseDown(e) {
  rect.startX = e.pageX - this.offsetLeft;
  rect.startY = e.pageY - this.offsetTop;
  drag = true;
}

function mouseUp() {
  drag = false;
  x1 = ((rect.startX / w) * width) + offset_x;
  y1 = ((rect.startY / w) * height) + offset_y;
  x2 = (((rect.startX + rect.w) / w) * width) + offset_x;
  y2 = (((rect.startY + rect.h) / w) * width) + offset_y;
  offset_x = x1;
  offset_y = y1;
  width = x2 - x1;
  height = y2 - y1;
  var max_it = get_iterations(x1, x2);

  get_mandelbrot(x1, x2, y1, y2, max_it);
  
  console.log({
  x1,
  x2,
  y1,
  y2,
  max_it
  });
  
}

function mouseMove(e) {
  if (drag) {
    let ratio = canvas.width / canvas.height;
    rect.w = (e.pageX - this.offsetLeft) - rect.startX;
    rect.h =  rect.w * ratio;
    //(e.pageY - this.offsetTop) - rect.startY;
    draw();
  }

}

function init() {
  canvas.addEventListener('mousedown', mouseDown, false);
  canvas.addEventListener('mouseup', mouseUp, false);
  canvas.addEventListener('mousemove', mouseMove, false);
}

//init();

return {
  start: init
};

})();
