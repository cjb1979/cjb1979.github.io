const markov = (() => {

  const amt_calc = (x) => {
    return Math.max(1, parseInt(Math.pow(x, power)));
  }

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
    //The maximum is exclusive and the minimum is inclusive
  }

  const shuffle = (array) => {
    // from https://stackoverflow.com/questions/5836833/create-a-array-with-random-values-in-javascript
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

  const fre = (text, n, s) => {
    var t = text.toLowerCase();
    var text_arr = t.split(" ");
    let samples;
    if (s > 1) {
      samples = parseInt(s);
    } else {
      samples = Math.max(parseInt(text_arr.length * s), 5);
    }
    text_arr = shuffle(text_arr).slice(0, samples);
    var obj = {};
    text_arr.forEach((word) => {
      var chars = word.split("");
      let max = chars.length;
      for (var c = -1; c < max; c++) {
        var n_gram = "";
        for (var i = 0; i < n; i++) {
          n_gram += (chars[c + i] || "`");
        }
        var _next = (chars[c + n] || "`");

        if (typeof obj[n_gram] === "undefined") {
          obj[n_gram] = {};
          obj[n_gram]['_count'] = 1;
        } else {
          obj[n_gram]['_count'] += 1;
        }

        if (typeof obj[n_gram][_next] === "undefined") {
          obj[n_gram][_next] = 1;
        } else {
          obj[n_gram][_next] += 1;
        }
      }

    });
    return obj;

  }

  var new_n_start = (table) => {
    var keys = Object.keys(table).filter(x => x.split("")[0] === "`");

    var a = [];

    keys.forEach((key) => {
      var amt = table[key]['_count'];
      for (let i = 0; i < amt_calc(amt); i++) {
        a.push(key);
      }
    })

    var random_val = a[getRandomInt(0, a.length)];
    return random_val

  }

  var next = (table, last) => {

    var options = table[last];
    var keys = Object.keys(options).filter(x => x !== "_count");
    var a = [];

    keys.forEach((key) => {
      var amt = options[key];
      for (let i = 0; i < amt_calc(amt); i++) {
        a.push(key);
      }
    });

    var random_int = getRandomInt(0, a.length)
    var random_val = a[random_int];

    return random_val

  }

  const gen = (table, n, max) => {
    let arr = [];
    for (let i = 0; i < max; i++) {
      var str = new_n_start(table);

      while ((str.split("").slice(-1).pop() !== "`" && str.length < 15) || (str.length <= 1)) {
        var curr = str.split("").slice(-n).join("");
        str += next(table, curr)
      }
      arr.push(str);
    }

    return arr;

  }

  const get = (settings) => {
    let power = settings.power || 1.5;
    let text = settings.text;
    let n = settings.n || 3;
    let samples = settings.samples || 1;
    let examples = settings.examples || 1;
    let as_array = settings.as_array;

    let table = fre(text, n, samples);

    let res = gen(table, n, examples);

    if (as_array) return res;

    res = res.map((x) => {
      let y = x.replace(/`/g, "");
      let t = y.split("");
      let n = "";
      for (var i = 0; i < t.length; i++) {
        n += (i === 0 ? t[i].toUpperCase() : t[i]);
      }
      return n;
    })

    return res.join(" ");
  }

  return {
    get: get
  };
})();
