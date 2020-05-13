const ascii_solar_system = (function (){

var moon_store = {
EARTH:[
  0
],
PLUTO:[1978,
    2005,
    2005,
    2011,
    2012

],
NEPTUNE: [ 
    1846,
    1949,
    1989,
    1989,
    1989,
    1989,
    1982,
    1989,
    2002,
    2003,
    2002,
    2002,
    2002,
    2013
  ],

URANUS:  [
    1851,
    1851,
    1787,
    1787,
    1948,
    1986,
    1986,
    1986,
    1986,
    1986,
    1986,
    1986,
    1986,
    1986,
    1985,
    1997,
    1997,
    1999,
    1999,
    1999,
    2001,
    2001,
    2003,
    2001,
    1986,
    2003,
    2003
  ],
  MARS:  [1877, 1877],
  JUPITER: [1610, 1610,
    1610,
    1610,
    1892,
    1904,
    1905,
    1908,
    1914,
    1938,
    1938,
    1951,
    1974,
    1979,
    1979,
    1979,
    2000,
    1975,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2001,
    2001,
    2001,
    2001,
    2001,
    2001,
    2001,
    2001,
    2001,
    2001,
    2001,
    2003,
    2003,
    2003,
    2003,
    2002,
    2003,
    2003,
    2003,
    2003,
    2003,
    2003,
    2003,
    2010,
    2001,
    2016,
    2003,
    2003,
    2003,
    2017,
    2003,
    2003,
    2017,
    2017,
    2017,
    2017,
    2017,
    2017,
    2017,
    2018,
    2003,
    2003,
    2003,
    2003,
    2004
  ],
  SATURN: [1789,
    1789,
    1684,
    1684,
    1672,
    1655,
    1848,
    1671,
    1899,
    1966,
    1980,
    1980,
    1980,
    1980,
    1980,
    1980,
    1980,
    1990,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2003,
    2004,
    2004,
    2004,
    2005,
    2004,
    2004,
    2004,
    2004,
    2004,
    2004,
    2004,
    2004,
    2006,
    2006,
    2006,
    2006,
    2006,
    2007,
    2006,
    2006,
    2007,
    2004,
    2004,
    2004,
    2004,
    2006,
    2006,
    2007,
    2007,
    2019,
    2019,
    2019,
    2019,
    2019,
    2019,
    2019,
    2019,
    2019,
    2019,
    2019,
    2019,
    2019,
    2019,
    2019,
    2019,
    2019,
    2019,
    2019,
    2019
  ]

}


var a = {};
var place = function(x, y, c, force) {

  c = c || '.'

  var arr = c.split('');
  
  arr.forEach(function(l,i){
  
    a[(x) + ',' + (y+i)] = a[x  + ',' + (y+i)] || l;
    
    if (force){
    
        a[(x) + ',' + (y+i)] = l;

    }

  })

}

var DrawPixel = function(x, y) {
  place(x, y);
}

var DrawCircle = function(x0, y0, radius, dat) {
  var y = radius;
  var x = 0;
  var radiusError = 1 - x;
  var d = 3 - 2 * radius;

  var p = Math.floor((radius / 2) * 1.414213);

  var name_text = '[' + dat.name + ']'

  var moons = (moon_store[dat.name] || []).filter(function(m) {
    return year >= m
  });

  var moons_text = '[m: ' + moons.length + ']'

  let u = '-';
   
  while (y >= x) {   
    
     place(y + x0, x + y0, u+'',true);
     
    x++;

    if (d > 0) {
      y--;
      d = d + 4 * (x - y) + 10;
      u =','
    } else {
      d = d + 4 * x + 6;
      u = '-'
    }

  }  
  
  place(y + x0, x + y0, dat.char, true);

 
let h = (moons.length > 0) ? moons_text: ''

  place(y + x0 -1, x + y0 + 1,'+'+pad('  - ',x + y0,37) + '+' + name_text + h, true)

}

function pad(char, curr, max){
  var s = '';
  
  while (s.length + curr < max){
     s+=char;
  }
  
  s = s.substring(0,max-curr);
  
  return s;
}


var year = 0;

function draw_year( planets){
 s = '\n';
 //◜◝◟◞
 place(0, 0, '〇+-  - +[SUN]');
 var curr_planets = planets.filter(function(p){
   return year>= p.start && year <= p.end ;
 });
 
 
 curr_planets.forEach(function(p){
 
   DrawCircle(0, 0, p.r, p);
 
 });
 
 place(0,17, '__' +year + '_A.D.__');

}

var planets_store = [
{id: 'VULCAN',
  char: '◌',
  name: '???',
  r: 5,
  start: 1848,
  end: 1915
},
{ id: 'MERCURY',
  char: '●',
  name: 'MERCURY',
  r: 8,
  start: 1543,
  end: Infinity
},{
id: 'VENUS',
  char: '●',
  name: 'VENUS',
  r: 12,
  start:1543,
  end:Infinity
},
  {id: 'EARTH',
  name: 'EARTH',
  char: '●',
  r:16,
  start:1543,
  end:Infinity
 },
 {id: 'MARS',
  char: '●',
  name: 'MARS',
  r: 20,
  start:1543,
  end:Infinity
},{
  id: 'JUNO',
  r:23,
  char: '●',
  name: 'JUNO',
  start:1810,
  end: 1860
  
},{id: 'AST. BELT',
  char: '%',
  name: 'AST.BELT',
  r:24,
  start:1861,
  end: Infinity

},
{id: 'CERES',
  r:24,
  char: '●',
  name: 'CERES',
  start:1801,
  end: 1860
  
},{id: 'PALLAS',
  char: '●',
  name: 'PALLAS',
  r: 26,
  start:1810,
  end: 1860

},{id: 'JUITER',
  char: '◯',
  name: 'JUPITER',
  r: 29,
  start:1543,
  end:Infinity
} ,{id: 'SATURN_NO_RINGS',
  char: '◯',
  name: 'SATURN',
  r: 33,
  start: 1543,
  end: 1609
}, {id: 'SATURN_?',
  char: '?',
  name: 'SATURN',
  r: 33,
  start: 1610,
  end: 1654
},{id: 'SATURN_RINGS',
  char: '⦵',
  name: 'SATURN',
  r: 33,
  start: 1655,
  end: Infinity
}, {id: 'URANUS',
  char: '◯',
  name: 'URANUS',
  r: 37,
  start: 1781,
  end: Infinity

},{id: 'NEPTUNE',
  char: '◯',
  name: 'NEPTUNE',
  r: 41,
  start:1846,
  end:Infinity
}, {id: 'PX',
  char: '◌',
  name: 'PL. X',
  r:45,
  start:1846,
  end: 1990
},

{id: 'PLUTO',
  char: '●',
  name: 'PLUTO',
  r:45,
  start:1930,
  end: 2006
}, {id: 'ERIS',
  char: '●',
  name: '???',
  r:47,
  start:2005,
  end: 2006

}, {id: 'T.N.Os',
  char: '%',
  name: 'TNOs',
  r:46,
  start:2007,
  end: Infinity

}
]

var extra_steps = [1916,2020];

var moon_years = ((x) => {
var a = [];

for (let key in x){
 a = [...a, ...x[key]];
}
return a

})(moon_store);


var order =  [
   ...planets_store.map(x => x.start), 
   ...planets_store.map(x => x.end),
   ...moon_years,
   ...extra_steps
   ].filter((v, i, a) => a.indexOf(v) === i)
    .filter((x) => x !== Infinity)
    .filter((x) => x !== 0)
    .sort((a, b) => a - b);
//alert(order.join('\n'))




var curr_year_index = 0;



var print_circle = function(radius) {


  let s = '\n';

  for (var i = 0; i < (radius * 2) + 1; i++) {

    for (var ii = 0; ii < (radius * 2) + 1; ii++) {

      s += a[i + ',' + ii] ? a[i + ',' + ii] : ' ';

    }

    s += '\n'

  }
  s = s.trimRight()
  
  s = s.split('\n').slice(0,40).join('\n');
  
 // console.log(s);
  return s;

}
let tick = 100
let delay = tick *9


function start_loop(){
 setTimeout(on_tick, delay);
 on_tick();
}


function* seq(){

  for (var i = curr_year_index; i < order.length; i++){
    a = {};
    year = order[i];
    draw_year(planets_store);
    var ret = print_circle(30);
    yield i + '\n' +ret;
    
  }
   return '';
}

function get_next(loop){
  if (curr_year_index < order.length){
   a={};
   year = order[curr_year_index];

   draw_year(planets_store);
   var ret = print_circle(30);
   curr_year_index++;
   return ret;
  } else {
   curr_year_index=0;
  }

}

//start_loop();


function get_year(_year){
a = {};
var old_year = year;
year = _year;
draw_year( planets_store)
year = old_year;
return print_circle(30);
}

function on_tick(){


  console.clear()
  console.log(get_next());
  
  setTimeout(on_tick, delay);


}

function get_curr_year(){
  return year;
}

return {
 get_year:get_year,
 start_loop:start_loop,
 seq: seq,
 get_curr_year
 
}


})();
