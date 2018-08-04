//document.getElementById('btn').addEventListener('click', wrapper, true);

function wrapper() {

  let text = "";

  var JP = document.getElementById("lang_JP").checked;
  var UK = document.getElementById("lang_UK").checked;
  var CH = document.getElementById("lang_CH").checked;
  var DE = document.getElementById("lang_DE").checked;

  if (!(JP || UK || CH || DE)) {
    text = "HELP ME IM TRAPPED HELP ME IM TRAPPED HELP ME IM TRAPPED HELP ME IM TRAPPED HELP ME IM TRAPPED TRUMPET".toLowerCase();
  }


  text += (JP ? document.getElementById('a').value.toLowerCase() : "");
  text += (UK ? document.getElementById('b').value.toLowerCase() : "");
  text += (CH ? document.getElementById('c').value.toLowerCase() : "");
  text += (DE ? document.getElementById('d').value.toLowerCase() : "");

  power = parseInt(document.getElementById("power_slider").value) / 100;

  var samples = (parseInt(document.getElementById("sample_slider").value) / 100);

  text = text.replace("  ", "").replace(/(\r\n\t|\n|\r\t)/gm, "").replace(/\s\s+/g, ' ');

  var n = parseInt(document.getElementById("ngram_slider").value);

  let settings = {
    text,
    n,
    power,
    samples: 1,
    examples: 10,
    as_array: false
  };

  let t = markov.get(settings);
  
  let arr = t.split(" ");

  $('#op1').html( arr[0] );
  $('#op2').html( arr[1] );
  $('#op3').html( arr[2] );
  $('#op4').html( arr[3] );
  $('#op5').html( arr[4] );
  $('#op6').html( arr[5] );
  
  //document.getElementById('output').innerHTML = t

}
