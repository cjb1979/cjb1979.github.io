function bin_name_class() {

    var split_amt = 0.1;
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
        }

    }
    const {
        Layer,
        Network
    } = window.synaptic;
    var clean = (text) => {
        text = text.replace(/-/g, '') // remove hyphens
        text = text.replace(/\s\s+/g, ' ');
        return text
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
    var step = (x) => (x >= 0.5) ? 1 : 0;
    
    var predict = (name) => {
        var d;
        if (typeof name === "string") {
            name = clean(name);
            d = prepare([name], feature_extractors).pop();
        } else { // if the vector is already provided...
            d = name;
        }
        var p = nn.activate(d).pop();
        var c = step(p);
        return {
            class: classes[c],
            prediction: p,
            class_int: c
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
    var vectoriser = count_vectorise;
    var classes = ['Japan', 'UK'];
    var parsed_a = parse(document.getElementById('a').value);
    var parsed_b = parse(document.getElementById('b').value);
    var a_split = validation_split(parsed_a, 0.1);
    var a = a_split.train;
    var a_names = a_split.test;
    var b_split = validation_split(parsed_b, 0.1);
    var b = b_split.train;
    var b_names = b_split.test;
    var html_status = document.getElementById('status');
    document.getElementById('test_btn').addEventListener('click', test_word, true);
    var feature_extractors = [
        vectoriser,
        word_len_syllables,
        last_char_vowel
    ];
    var _a = prepare(a, feature_extractors);
    var _b = prepare(b, feature_extractors);
    var depth = _a[0].length;
    var input = new Layer(depth);
    var hidden = new Layer(depth);
    var output = new Layer(1);
    input.set({
        bias: 0.5
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
    var training_iters = Math.min(_a.length, _b.length) * 3;
    train(training_iters);

    function train(max_iterations) {
        var i = 0;
        var max = Math.min(_a.length, _b.length)

        function train_iteration() {
            var index = i % max;
            nn.activate(_a[index]);
            nn.propagate(learningRate, [0]);
            nn.activate(_b[index]);
            nn.propagate(learningRate, [1]);
            html_status.innerHTML = "Iteration " + i + " of " + max_iterations + " (" +
                ((i / max_iterations) * 100).toFixed(1) + "%)";
            i++;
            if (i < max_iterations) {
                setTimeout(train_iteration, 1);
            } else {
                html_status.innerHTML = "Training Complete!";
                output_sequence();
            }
        }
        train_iteration();
    }
    
    let output_str = (name, pred_class, score, j) => {
        j = j || " ";       
        var str = ["Place name: " + name, "Prediction: " + pred_class, "Score: " + score.toFixed(4)];
        return str.join(j);
    }


    function test_word() {
        var test_text = [...a, ...b];

        function rand_int(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
        var i = rand_int(0, test_text.length);
        var name = prompt("Please enter a word to test\n(There is already a place name to try)", test_text[i]);
        var p = predict(clean(name));
        var str = output_str(name, p.class, p.prediction, "\n");
        alert(str);
    }
    
    function output_sequence() {
        var html_output = document.getElementById('output');
        var arr = [];

        var total = 0;
        var correct = 0;
        a_names.forEach(function(name) {
            var p = predict(clean(name));
            if (p.class === "Japan") correct++; 
            var str = output_str(name, p.class, p.prediction);// (name + " > " + p.class + " __ score: " + p.prediction.toFixed(4));
            arr.push(str)
            total++;
        });
        b_names.forEach(function(name) {
            var p = predict(clean(name));
            if (p.class === "UK") correct++;
            //var str = (name + " > " + p.class + " ___ " + p.prediction.toFixed(4));
            var str = output_str(name, p.class, p.prediction);
            arr.push(str);
            total++;
        });
        var acc_str = "Accuracy: " + ((correct / total) * 100).toFixed(2) + "%. Accuracy determined by the below unseen place names.  'Score' is the nets probability of the name being in class 1 (UK), so a score <0.5 effectively means class 0 (Japan).";
        arr.unshift(acc_str);
        arr = arr.map(x => "<p>" + x + "</p>");
        html_output.innerHTML = arr.join("");

    }

}
