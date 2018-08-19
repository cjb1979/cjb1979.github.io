const mandelbrot = () => {

  const order = (n) => Math.floor(Math.log(Math.abs(n)) / Math.LN10 + 0.000000001);

  const float2color = (percentage) => {
    var c_p_dec = 255 * percentage;
    var c_p_hex = Number(parseInt(c_p_dec, 10)).toString(16);
    return "#" + c_p_hex + c_p_hex + c_p_hex;
  }

  const get_color = (x0, y0, MAX_IT) => {
    const ESCAPE = 200;
    let x = 0;
    let y = 0;
    let iteration = 0;

    while (x * x + y * y <= ESCAPE && iteration < MAX_IT) {
      let xtemp = x * x - y * y + x0;
      y = 2 * x * y + y0;
      x = xtemp;
      iteration++;
    }
    
    if (iteration === MAX_IT) return "#000000" //black
    var c = Math.log(iteration) / Math.log(MAX_IT - 1.0);
    return float2color(c);
  }

  var cvs = document.getElementById("canvas");
  var ctx = cvs.getContext('2d');

  var b_cvs = document.createElement('canvas');
  var b_ctx = b_cvs.getContext('2d');
  
  let cursor_move_amt = 0;

  b_cvs.width = cvs.width;
  b_cvs.height = cvs.height;

  const w = 600;
  let rect = {
    startX: 0,
    startY: 0,
    w: w,
    h: w
  }
  let drag = false;

  var offset_x = -2.5;
  var offset_y = -1.75;
  var width = 3.5;
  var height = 3.5;

  let x1 = offset_x,
    x2 = offset_x + width,
    y1 = offset_y,
    y2 = offset_y + height;

  const get_iterations = (x1, x2) => {
    let o = Math.abs(order(x2 - x1)) + 2;
    return 500 * (o * 2);
  }

  const get_mandelbrot = (x1, x2, y1, y2, _max_it) => {

    let max_it = (_max_it || get_iterations(x1, x2));
    let small_amount = (x2 - x1) / w;
    let total = (y1 - y2) * (x1 - x2);
    let scale = order(x2 - x1);
    let str;
    if (Math.abs(scale) >= 12){
        console.log('limit reached');
        str = `  Iterations: ${get_iterations(x1, x2)}. Scale: ${scale}x - Limit reached - reset below`;
        cvs.removeEventListener('mousedown', mouseDown, false);
        cvs.removeEventListener('mouseup', mouseUp, false);
        cvs.removeEventListener('mousemove', mouseMove, false);
    } else {
        str = `  Iterations: ${get_iterations(x1, x2)}. Scale: ${scale}x`;
    }

    for (var y = y1, py = 0; y <= y2; y += small_amount, py++) {
      for (var x = x1, px = 0; x <= x2; x += small_amount, px++) {
        b_ctx.fillStyle = get_color(x, y, max_it);
        b_ctx.fillRect(px, py, 1, 1);
      }
    }

    b_ctx.fillStyle = 'red';
    b_ctx.font = "15px Verdana";
    b_ctx.fillText(str, 1, 20);
    ctx.drawImage(b_cvs, 0, 0);
  }

  //https://rosettacode.org/wiki/Mandelbrot_set#JavaScript

  const draw = () => {
    ctx.drawImage(b_cvs, 0, 0);
    ctx.setLineDash([6]);
    ctx.strokeStyle = "#FF0000";
    ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
  }

  const mouseDown = (e) => {
    rect.startX = e.offsetX;
    rect.startY = e.offsetY;
    drag = true;
  }

  const mouseUp = () => {
    if (!cursor_move_amt) return
    drag = false;
    cursor_move_amt = 0;
    let t_x1 = ((rect.startX / w) * width) + offset_x;
    let t_y1 = ((rect.startY / w) * height) + offset_y;
    let t_x2 = (((rect.startX + rect.w) / w) * width) + offset_x;
    let t_y2 = (((rect.startY + rect.h) / w) * width) + offset_y;
    
    x1 = Math.min(t_x1, t_x2);
    x2 = Math.max(t_x1, t_x2);
    
    y1 = Math.min(t_y1, t_y2);
    y2 = Math.max(t_y1, t_y2);
    
    offset_x = x1;
    offset_y = y1;
    width = x2 - x1;
    height = y2 - y1;
    
    let max_it = get_iterations(x1, x2);

    get_mandelbrot(x1, x2, y1, y2, max_it);

    console.log({
      x1,
      x2,
      y1,
      y2,
      max_it
    });

  }

  const mouseMove = (e) => {
    if (!drag) return;
    cursor_move_amt++;
    let ratio = canvas.width / canvas.height;
    if (e.offsetX > e.offsetY) {
      rect.w = e.offsetX - rect.startX;
      rect.h = rect.w * ratio;
    } else {
      rect.h = e.offsetY - rect.startY;
      rect.w = rect.h * ratio;
    }
    draw();
  }

  const init = () => {
    cvs.addEventListener('mousedown', mouseDown, false);
    cvs.addEventListener('mouseup', mouseUp, false);
    cvs.addEventListener('mousemove', mouseMove, false);
  }

  init();
  get_mandelbrot(x1, x2, y1, y2);

};
