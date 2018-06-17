const compose = (a, b) => x => a(b(x));
const reverse = array => [...array].reverse();

// `get` is a simple accessor function, used for selecting an item in an array.
const get = id => array => array[id];

// This functional version of map accepts our function first.
const map = (fn, array) => array.map(fn);

// `pluck` allows us to map through a matrix, gathering all the items at a
// specific index.
const pluck = (index, data) => map(get(index), data);
// `rangeFrom` creates an array equal in length to the array provided,
// but with a 0-based range for values.
// eg. ['a', 'b', 'c'] -> [0, 1, 2]
const rangeFrom = ({
  length
}) => [...Array(length).keys()];

const flip = matrix => (
  map(index => pluck(index, matrix), rangeFrom(matrix))
);

const rotate = compose(flip, reverse);
const flipCC = compose(reverse, rotate);
const rotateCC = compose(reverse, flip);
//Taking a move means changing from one state to another.
//_________________________


var rand_log = [];

var b_cvs = document.getElementById('cvs');
var b_ctx = b_cvs.getContext('2d');
b_cvs.width = 150;
b_cvs.height = 150;
var step_size = b_cvs.width / 3;
b_ctx.lineWidth = 5;

b_cvs.addEventListener('click', click_event)

document.getElementById('relearn').addEventListener('click', reset, true);

var slot_in = (str, i, x) => {
  var arr = str.split("");
  arr[i] = x;
  return arr.join("");
}

var update_matchboxes = (_s, state_stack, player, winner, reward) => {

  var player_status = "";
  switch (winner) {
    case player:
      player_status = "win";
      break;
    case "draw":
      player_status = "draw";
      break;
    default:
      player_status = "lose";
  }
  for (var i = 0; i < state_stack.length; i++) {
    var t = state_stack[i];
    _s[t.state]["_" + t.choice] += reward[player_status];
  }
  return _s
}

var uniques = 0;
var max_iterations = 500 //5000;

var default_rewards = [];
default_rewards['win'] = 2;
default_rewards['lose'] = -3;
default_rewards['draw'] = 4;
default_rewards['initial'] = 20;

var rewards = [];
rewards['x'] = default_rewards
rewards['o'] = default_rewards
console.log(rewards)
var paths = [];
paths['x'] = function(x, y, w) {
  b_ctx.beginPath();
  b_ctx.strokeStyle = "#000000";
  var b = w / 5;
  x += b;
  y += b;
  w -= (b * 2);
  b_ctx.moveTo(x, y);
  b_ctx.lineTo(x + w, y + w);
  b_ctx.moveTo(x + w, y);
  b_ctx.lineTo(x, y + w);
  b_ctx.stroke();
}
paths['_'] = function() {};
paths['o'] = function(x, y, w) {
  b_ctx.beginPath();
  b_ctx.strokeStyle = "#FFFFFF";
  var b = w / 5;
  x += (w / 2);
  y += (w / 2);
  w -= (b * 2);
  b_ctx.beginPath();
  b_ctx.arc(x, y, w / 2, 0, 2 * Math.PI);
  b_ctx.stroke()
}

var html_status = document.getElementById('status');

function reset() {
  pplGraph = new Rvis.Graph();
  s = init();
  current_state = empty_state;
  draw();
  eval(document.getElementById("x_input").value); // evil?
  eval(document.getElementById("o_input").value);
  max_iterations = parseInt(document.getElementById("iters").value);
  train(max_iterations);
}

function click_event(e) {  

if (is_end_game_state(current_state).winner !== "none") {
    player = document.getElementById('team_select').value;
    current_state = empty_state;
    draw();
    return
  }
  
  if (player === "o" && current_state === empty_state){
    draw();
    play_iteration();
    return
  }
  
  var x = Math.floor(e.offsetX / step_size);
  var y = Math.floor(e.offsetY / step_size);
  var i = (y * 3) + x;
  turn_state = valid_state(current_state)
  current_state = slot_in(current_state, i, turn_state);
  draw();
  play_iteration();
}

const empty_state = "_________";
var pplGraph = new Rvis.Graph();
function get_ai_certainty(s,step){
  var c = [];
  for (_s in s){
    var m = s[_s];
    var total_count = 0;
    var total_moves = 0;
    var max = 0;
    var avg = 0;
    for (_m in m){
      total_count++;
      total_moves += m[_m];
      max = Math.max(max, m[_m]);
    }
   
    avg = total_moves / total_count;
    var certainty = parseFloat(max / avg);
    if (!isNaN(certainty)) c.push(certainty)
  }
  
  var sum = 0;
  
  for (var i = 0; i < c.length; i++){
    sum += c[i]
  }
  
  var x = sum / c.length
  
  if (sum === 0 || c.length === 0) x = 0;
  if (x === Infinity) x = 0;
  
  if (x > 100)  console.log(x.toFixed(5) + " "+ avg+" " + max);
  
  pplGraph.add(step, x);
  pplGraph.drawSelf(document.getElementById("pplgraph"));
}

function init() {
  var a = [];
  var max = 19683;

  for (var i = 0; i < max; i++) {
    var state = i.toString(3);
    var state_str = empty_state;
    state_str = state_str.split("").slice(0, (9 - state.length)).join("") + state.toString();
    state_str = state_str.replace(/0/g, "_").replace(/1/g, "o").replace(/2/g, "x");
    var turn_state = valid_state(state_str);
    if (!turn_state) {
      continue
    }
    var exists = false
    for (var t = -1; t < 7; t++) {
      var trans_str = transform(state_str, t);
      if (trans_str in a) {
        exists = true;
        break;
      }
    }
    if (!exists) a[state_str] = gen_moves(state_str, rewards[turn_state]);
  }
  return a
}


function valid_state(state) {
  var x_count = state.split("").reduce(function(a, b) {
    var i = (b === "x") ? 1 : 0
    return a + i
  }, 0);

  var o_count = state.split("").reduce(function(a, b) {
    var i = (b === "o") ? 1 : 0
    return a + i
  }, 0);
  return x_count === o_count ? "x" : x_count - 1 === o_count ? "o" : "";
}

function gen_moves(state, reward) {
  //iterate over state, and add available move if the state is empty ("_")
  var s = state.split("");
  var m = [];
  for (var i = 0; i < s.length; i++) {
    if (s[i] === "_") m["_" + i.toString()] = reward['initial'];
  }
  return m;
}

function to_grid(x) {
  var a = x.split("").slice(0, 3);
  var b = x.split("").slice(3, 6);
  var c = x.split("").slice(6, 9);
  return [a, b, c]
}

function transform(state, i) {
  var m = to_grid(state);
  m = (function() {
    switch (i) {
      case -1:
        return rotateCC(m);
      case 0:
        return m;
      case 1:
        return rotate(m);
      case 2:
      case -2:
        return rotateCC(flip(m));
      case 3:
      case -3:
        return rotate(flip(m));
      case 4:
      case -4:
        return rotate(rotate(m));
      case 5:
      case -5:
        return flip(m);
      case 6:
      case -6:
        return flipCC(m);
      default:
        return m;
    }
  })();
  return m.toString().replace(/,/g, "")
}

function is_end_game_state(state) {
  var win = "";
  var grid = to_grid(state);

  var win_points;
  for (var y = 0; y < grid.length; y++) {
    var str = "";
    for (var x = 0; x < grid[0].length; x++) {
      str += grid[y][x];
    }
    win = (str === "ooo" || str === "xxx") ? str : win;
    if (win && !win_points) win_points = [
      [y, 0],
      [y, 1],
      [y, 2]
    ]
  }

  for (var y = 0; y < grid.length; y++) {
    var str = "";
    for (var x = 0; x < grid[0].length; x++) {
      str += grid[x][y];
    }
    win = (str === "ooo" || str === "xxx") ? str : win;
    if (win && !win_points) win_points = [
      [0, y],
      [1, y],
      [2, y]
    ]
  }

  var str = grid[0][0] + grid[1][1] + grid[2][2];
  win = (str === "ooo" || str === "xxx") ? str : win;
  if (win && !win_points) win_points = [
    [0, 0],
    [1, 1],
    [2, 2]
  ]
  var str = grid[2][0] + grid[1][1] + grid[0][2];
  win = (str === "ooo" || str === "xxx") ? str : win;
  if (win && !win_points) win_points = [
    [2, 0],
    [1, 1],
    [0, 2]
  ]

  if (win) return {
    winner: win.slice(0, 1),
    win_points: win_points
  }

  if (state.indexOf("_") === -1) return {
    winner: "draw"
  }

  return {
    winner: "none"
  }
}

reset()
function train(max_iterations) {
  var running_avg_turns = 0;
  var total_runs = 0;

  function train_iteration() {

    var current_state = empty_state;
    current_state = get_canonical(current_state, s).str
    var moves_list = [];
    moves_list['x'] = [];
    moves_list['o'] = [];

    var i = 0;
    var end = "none";
    var turn_count = 0;
    while (end === "none") {
      var turn = i % 2 === 0 ? "x" : "o";
      var a;
      if (turn === "x") {
        var choice = choose(current_state, s);
        a = choice.move;
        if (choice.reason === "random" || a === -1) {
          //    end = "o";
          //  continue;
        }
        moves_list['x'].push({
          state: current_state,
          choice: a
        });
      } else {
        var choice = choose(current_state, s);
        a = choice.move;
        if (choice.reason === "random" || a === -1) {
          //   end = "x";
          //   continue;
        }
        moves_list['o'].push({
          state: current_state,
          choice: a
        });
      }
      current_state = slot_in(current_state, a, turn);
      current_state = get_canonical(current_state, s).str
      end = is_end_game_state(current_state).winner;
      turn_count++;
      i++;
    }
    running_avg_turns = (running_avg_turns + turn_count) / 2
    s = update_matchboxes(s, moves_list['o'], "o", end, rewards['o']);
    s = update_matchboxes(s, moves_list['x'], "x", end, rewards['x']);
    total_runs++;
    html_status.innerHTML = "Training - played " + total_runs + " games (" + ((total_runs / max_iterations) * 100).toFixed(1) + "% of total)";
    
    get_ai_certainty(s, total_runs)
    
    if (total_runs < max_iterations) {
      setTimeout(train_iteration, 1);
    } else {
      html_status.innerHTML = "Training complete - " + total_runs + " games played."
      draw();
    }
  }
  train_iteration();
}

function draw() {
  var cs = current_state || "";
  var st = cs.split("")
  b_ctx.clearRect(0, 0, b_cvs.width, b_cvs.height);
  var state = current_state || "";
  b_ctx.strokeStyle = "#282828";
  b_ctx.beginPath();
  b_ctx.setLineDash([])
  for (var x = step_size; x < b_cvs.width; x += step_size) {
    b_ctx.moveTo(x, 0);
    b_ctx.lineTo(x, b_cvs.height);
  }
  for (var y = step_size; y < b_cvs.width; y += step_size) {
    b_ctx.moveTo(0, y);
    b_ctx.lineTo(b_cvs.width, y);
  }
  b_ctx.stroke()
  var x = 0,
    y = 0;
  for (var i = 0; i < 9; i++) {
    paths[st[i]](x, y, step_size);
    x += step_size;
    if ((i + 1) % 3 === 0) {
      x = 0;
      y += step_size;
    }
  }
}
//play

var current_state = empty_state;
var turn_count = 0;
var ai_moves = [];

var player = document.getElementById('team_select').value;

function play_iteration() {
  var turn = turn_count % 2 === 0 ? "x" : "o";
  var transformation = get_canonical(current_state, s);
  var ai_state = transformation.str;

  if (turn === player) {
    // human will have generated a new state already
  } else {
    var choice = choose(ai_state, s);
    a = choice.move;
    if (choice.reason === "random") console.log("randomly chosen move: " + a)
    if (choice.reason === "choice") console.log("chosen move: " + a)
    ai_moves.push(ai_state)
    var r = slot_in(empty_state, a, "1");
    a = transform(r, -transformation.transformation).indexOf("1");
    current_state = slot_in(current_state, a, turn);
  }
  end = is_end_game_state(current_state).winner;

  draw();
  turn_count++;

  if (turn === player && end === "none") {
    play_iteration();
  } else {
    if (end === "x" || end === "o") {
      var win_points = is_end_game_state(current_state).win_points;
      console.log(is_end_game_state(current_state).win_points)
      win_points = win_points.map(p => p.map(c => (c * step_size) + 0.5 * step_size));
      b_ctx.beginPath();
      b_ctx.setLineDash([5, 5]);
      b_ctx.lineWidth = 5;
      b_ctx.strokeStyle = "#FF0000";
      b_ctx.moveTo(win_points[0][1], win_points[0][0]);
      b_ctx.lineTo(win_points[1][1], win_points[1][0]);
      b_ctx.lineTo(win_points[2][1], win_points[2][0]);
      b_ctx.stroke();
    }
  }
}

function log_state(state, output_as_str) {
  var a = state.split("").slice(0, 3).join("");
  var b = state.split("").slice(3, 6).join("");
  var c = state.split("").slice(6, 9).join("");
  var str = a + "\n" + b + "\n" + c;
  str = str.split("").map(char => (char in emoji) ? emoji[char] : char).join("");
  if (output_as_str) return str
  console.log(str);
}

function choose(state, _s) {
  var moveset = _s[state];
  if (typeof moveset === "undefined") throw "illegal move"
  var moves = [];
  for (_m in moveset) {
    if (moveset[_m] <= 0) continue;
    for (var i = 0; i < moveset[_m]; i++) {
      moves.push(parseInt(_m.replace(/_/g, "")));
    }
  }
  var reason = "choice";
  if (moves.length === 0) {
    // return random move if no move available, used if playing against human opponent
    moves = Object.keys(moveset).map(function(_k) {
      return parseInt(_k.replace(/_/g, ""))
    });
    reason = "random";
    // return -1; can return -1 to signal it has 'given up', although this is well boring
  }
  var r = getRandomArbitrary(0, moves.length);
  return {
    move: moves[r],
    reason: reason
  }

  function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
}

function get_canonical(str, _s) {
  for (var t = -1; t < 7; t++) {
    var trans_str = transform(str, t);
    if (trans_str in _s) return {
      str: trans_str,
      transformation: t
    }
  }
  throw "no matching transformation found"
}
