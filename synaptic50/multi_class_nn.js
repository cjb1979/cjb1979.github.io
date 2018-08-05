var split_amt = 0.99;

var validation_split = (x, ratio) => {
  //randomise the order of the array, then take the top values off for testing
  var len = x.length;
  var amt = parseInt(ratio * len);
  var i = 0;

  function shuffle(array) { // from https://stackoverflow.com/questions/5836833/create-a-array-with-random-values-in-javascript
    var tmp, current, top = array.length;
    if (top)
      while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
      }
    return array;
  }

  x = shuffle(x);

  return {
    test: x.slice(0, amt),
    train: x.slice(amt, len)
  };

}

const {
  Layer,
  Network
} = window.synaptic;

var clean = (text) => {
  text = text.replace(/-/g, '`') // remove hyphens
  text = text.replace(/\s\s+/g, '`');
  return text
}

var word_clean = (text) => {
  text = text.toLowerCase();
  return text.replace(/\W/g, '`'); //NON ALPHANUm  
}

var parse = (text) => {
  text = clean(text);
  return text.split(" ");
}

function last_char_vowel(word) {
  var char = word.split("").pop();
  return /[aeiou]/.test(char) ? 1 : 0
}

function word_len_syllables(word) {

  function syllable_count(word) {
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    var syl_match = word.match(/[aeiouy]{1,2}/g);
    return (syl_match === null) ? 0 : syl_match.length
  }

  word = word.toLowerCase();
  var syl = syllable_count(word);
  var len = word.length;
  return syl / len
}

var zeroed_range = (i) => Array(i).fill(0);

function do_nothing(word) {
  return [0]
}

function count_vectorise(word) {
  var chars = word.split("");
  var v = zeroed_range(26);
  chars.forEach(function(x) {
    var i = x.toLowerCase().charCodeAt(0) - 97;
    v[i] += 1;
  });

  return v;
}

function count_vectorise_bigram_from_obj(word) {
  var obj = bigram_obj;
  word = word.replace(" ", "").toLowerCase();
  var arr = zeroed_range(Object.keys(obj).length);
  var chars = word.split("");
  for (var c = -1; c < chars.length - 1; c++) {
    var _a = (chars[c] || "`") //+ (chars[c + 1] || "{"));
    var _b = (chars[c + 1] || "`");
    var _c = (chars[c + 2] || "`");

    var abc = _a + _b + _c;
    if (abc in obj) {
      arr[obj[abc]] += 1;
    }
  }
  return arr;
}

function count_vectorise_bigram_obj(word, top_X) {
  word = word.toLowerCase();
  var text_arr = word.split(" ");
  var obj = {};
  text_arr.forEach((word) => {
    //word = word.replace(" ", "").toLowerCase();
    var chars = word.split("");
    // var choose_2_28 = 378;  // 26 chars + beginning + end choose 2
    //var v = zeroed_range(choose_2_28);


    for (var c = -1; c < chars.length - 1; c++) {
      var _a = (chars[c] || "`") //+ (chars[c + 1] || "{"));
      var _b = (chars[c + 1] || "`");
      var _c = (chars[c + 2] || "`");
      var abc = _a + _b + _c;
      obj[abc] = (typeof obj[abc] === "undefined" ? 1 : obj[abc] + 1);
    }

  });
  var arr = [];

  for (var k in obj) {
    arr.push({
      bigram: k,
      count: obj[k]
    });
  }

  arr = arr.sort((a, b) => {
    return b.count - a.count
  }).slice(0, top_X);

  var obj = ((arr) => {
    var o = {};
    arr.forEach((x) => {
      o[x.bigram] = o.count;
    });
    return o;
  })(arr);

  var i = 0;
  for (var k in obj) {
    obj[k] = i;
    i++;
  }

  return obj;
}

function count_vectorise_bigram(word) {
  word = word.replace(" ", "").toLowerCase();
  var chars = word.split("");
  var choose_2_28 = 378; // 26 chars + beginning + end choose 2
  var v = zeroed_range(choose_2_28);
  for (var c = -1; c < chars.length; c++) {
    var bigram_a = (chars[c] || "`") //+ (chars[c + 1] || "{"));
    var bigram_b = (chars[c + 1] || "{");
    var a = bigram_a.toLowerCase().charCodeAt(0) - 96;
    var b = bigram_b.toLowerCase().charCodeAt(0) - 96;
    var p = (a * 28) + b;
    v[p] += 1;
  }
  return v;
}

var normalise = (str) => {
  str = str.slice(0, name_len)
  for (var i = str.length; i < name_len; i++) str += " ";
  return str;
}

var dummy = (name) => {
  name = normalise(name);
  var chars = name.split("");
  var v = [];
  chars.forEach(function(x) {
    var i = x.toLowerCase().charCodeAt(0) - 97;
    i = i > 26 ? 0 : i;
    var r = zeroed_range(26);
    r[i] = 1;
    v = v.concat(r);
  });
  return v
}

var step = (x) => (x > 0.5) ? 1 : 0;

var predict = (name) => {
  var d;
  if (typeof name === "string") {
    name = clean(name);
    d = prepare([name], feature_extractors).pop();
  } else { // if the vector is already provided...
    d = name;
  }
  var p = nn.activate(d);
  var r = p.reduce(function(a, b, i) {
    return b > a.v ? {
      i: i,
      v: b
    } : a
  }, {
    v: 0
  });
  return {
    class: classes[r.i],
    prediction: r.v,
    predictions: p.map(x => x.toFixed(4))
  };
}

var prepare = (a, f) => {
  var _a;
  for (var i = 0; i < f.length; i++) {
    if (typeof _a === "undefined") {
      _a = a.map(f[i]);
    } else {
      var _a_latent = a.map(f[i]);
      _a = join(_a, _a_latent);
    }
  }
  return _a
}

var join = (a, b) => {
  for (var i = 0; i < a.length; i++) a[i].push(b[i]);
  return a;
}

//var vectoriser = count_vectorise;

var vectoriser = count_vectorise_bigram_from_obj;

var classes = ['Japan', 'UK', 'China', "Germany"];

var parsed_a = parse(document.getElementById('a').value).map(word_clean);
var parsed_b = parse(document.getElementById('b').value).map(word_clean);
var parsed_c = parse(document.getElementById('c').value).map(word_clean);
var parsed_d = parse(document.getElementById('d').value).map(word_clean);

var parsed_a_s = parse(document.getElementById('a_s').value).map(word_clean);
var parsed_b_s = parse(document.getElementById('b_s').value).map(word_clean);
var parsed_c_s = parse(document.getElementById('c_s').value).map(word_clean);
var parsed_d_s = parse(document.getElementById('d_s').value).map(word_clean);

var mega_str = parsed_a.join(" ") + parsed_b.join(" ") + parsed_c.join(" ") + parsed_d.join(" ") + parsed_a_s.join(" ") + parsed_b_s.join(" ") + parsed_c_s.join(" ") + parsed_d_s.join(" ");

var bigram_obj = count_vectorise_bigram_obj(mega_str, 70);

var a_split = validation_split(parsed_a, split_amt);
var a = a_split.train;
a = a.concat(parsed_a_s);
var a_names = a_split.test;

var b_split = validation_split(parsed_b, split_amt);
var b = b_split.train;
b = b.concat(parsed_b_s);
var b_names = b_split.test;

var c_split = validation_split(parsed_c, split_amt);
var c = c_split.train;
c = c.concat(parsed_c_s);
var c_names = c_split.test;

var d_split = validation_split(parsed_d, split_amt);
var d = d_split.train;
d = d.concat(parsed_d_s);
var d_names = d_split.test;

var html_status = document.getElementById('status');

document.getElementById('test_btn').addEventListener('click', test_word, true);

var feature_extractors = [
  vectoriser,
  word_len_syllables,
  last_char_vowel
];

var _a = prepare(a, feature_extractors);
var _b = prepare(b, feature_extractors);
var _c = prepare(c, feature_extractors);
var _d = prepare(d, feature_extractors);


var depth = _a[0].length;

var input = new Layer(depth);
var hidden = new Layer(depth);
var output = new Layer(4);

input.set({
  bias: 1
});
hidden.set({
  squash: Neuron.squash.ReLU
});
output.set({
  squash: Neuron.squash.LOGISTIC
});

input.project(hidden);
hidden.project(output);

var nn = new Network({
  input: input,
  hidden: [hidden],
  output: output
});


var learningRate = 0.025;
var training_iters = Math.min(_a.length, _b.length, _c.length, _d.length) * 5;

train(training_iters);

function train(max_iterations) {

  var i = 0;
  var max = Math.min(_a.length, _b.length, _c.length, _d.length);

  function train_iteration() {

    var index = i % max;

    nn.activate(_a[index]);
    nn.propagate(learningRate, [1, 0, 0, 0]);
    nn.activate(_b[index]);
    nn.propagate(learningRate, [0, 1, 0, 0]);
    nn.activate(_c[index]);
    nn.propagate(learningRate, [0, 0, 1, 0]);
    nn.activate(_d[index]);
    nn.propagate(learningRate, [0, 0, 0, 1]);

    html_status.innerHTML = "iteration " + i + " of " + max_iterations + " (" +
      ((i / max_iterations) * 100).toFixed(2) + "%)";

    i++;

    if (i < max_iterations) {
      setTimeout(train_iteration, 1);
    } else {
      output_sequence();
    }
  }
  train_iteration();
}

function test_word() {
  var test_text = [...a, ...b, ...c, ...d];

  function rand_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  var i = rand_int(0, test_text.length);
  var name = prompt("Please enter a word to test", test_text[i]);
  var p = predict(clean(name));
  var str = (name + " > " + p.class + " __ score: " + p.prediction.toFixed(4) + "\n" + classes.join("     ") + "\n" + p.predictions.join("  "));
  alert(str);
}

function output_sequence() {

  var classes = ['Japan', 'UK', 'China', "Germany"];

  var html_output = document.getElementById('output');

  const get_acc_score = (arr, label) => {
    var x =  arr.reduce(function(acc, curr) {
      var p = predict(clean(curr));
     
      //console.log(curr + " " + p.class + " " +  p.prediction.toFixed(4) + "\n" + classes.join("     ") + "\n" + p.predictions.join("  "));
      
      return acc + ((p.class === label) ? 1 : 0);
      
    }, 0);
    console.log(x + " " + arr.length + " " + ((x /arr.length) * 100).toFixed(2) + "%");
    return x
  }

  var correct = 0;
  
  console.log(classes[0]);
  correct += get_acc_score(a_names, classes[0]);
  console.log(classes[1]);
  correct += get_acc_score(b_names, classes[1]);
  console.log(classes[2]);
  correct += get_acc_score(c_names, classes[2]);
  console.log(classes[3]);
  correct += get_acc_score(d_names, classes[3]);

  var total = a_names.length + b_names.length + c_names.length + d_names.length

  var acc_str = "Accuracy: " + ((correct / total) * 100).toFixed(2) + "%";

  console.log("_______");
  console.log(correct + " " + total + " " + acc_str);

  html_output.innerHTML = acc_str;

  return
}
