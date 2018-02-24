function getParameterByName(name,def) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//read params from url

var stop_id = getParameterByName('stop_id', '490010878C');
var busses = (function(str){
  var arr = str.split("_");
  var t = {};
  arr.forEach(function(bus){
    t[bus] = 1;
  });
  return t;
})(getParameterByName('busses', '363_63_n63'));

var destination_stop = unescape(getParameterByName('destination', 'Elephant%20%26%20Castle%20/%20New%20Kent%20Road'));

var base_url = `https://api.tfl.gov.uk/StopPoint/${stop_id}/`;
var arrivals_url = base_url + 'arrivals/';
$.getJSON(base_url, get_stop_name);
$.getJSON(arrivals_url, get_top_three);
var table_ob = [];

function get_stop_name(data) {
  $('#sub').append(data.commonName + " to " + destination_stop);
  var loc = {
    lat: data.lat,
    lon: data.lon
  }
  var weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lon}&appid=bbc9eabd83dcc562c6bbd873163fb4ca`
  $.getJSON(weather_url, get_weather_data);
}
function get_weather_data(data) {
  var kelvin = 273.16;
  var temp = (data.main.temp - kelvin).toFixed(1);
  var weather_type = data.weather.map(x => x.main).join(", ");
  var str = temp + "°C " + weather_type
  $('#weather').append(str);
}
function get_top_three(data) {
  data = data.filter(function(bus) {
    if (!bus.lineName) return false
    return (bus.lineName in _busses)
  });
  data = data.sort(function(a, b) {
    return a.timeToStation - b.timeToStation
  });
  let closest_busses = data.slice(0, 3);
  var str_arr = [];
  if (closest_busses.length === 0)
    str_arr.push('no busses :(');
  closest_busses.forEach(function(closest_bus, i) {
    table_ob.push({
      "Order": ++i + ")",
      "Bus": closest_bus.lineName,
      "Due": seconds_to_minutes(closest_bus.timeToStation),
      "Destination": closest_bus.destinationName,
      "Duration": ""
    });
  });
  closest_busses.forEach(function(c, i) {
    var bus_id = c.vehicleId;
    var bus_url = `https://api.tfl.gov.uk/Vehicle/${bus_id}/Arrivals`;
    $.getJSON(bus_url, function(data) {
      callback_wrapper(data, i)
    });
  });
}
function callback_wrapper(data, row) {
  get_journey_time(data, row);
}
function get_journey_time(data, i) {
  var arrival_stop;
  for (var row in data) {
    if (data[row].stationName === destination_stop) {
      arrival_stop = data[row];
    }
  }
  if (arrival_stop) {
    table_ob[i].Duration = seconds_to_minutes(arrival_stop.timeToStation)
  } else {
    table_ob[i].Duration = "--";
  }
  update_table();
}
function update_table() {
  $("#board").empty();
  $("#board").append(`<tr><th></th><th>Bus</th><th>Due</th><th>Destination</th><th>Arrive in</th></tr>`);
  table_ob.forEach(function(row) {
    $("#board").append(`<tr><td>${row.Order}</td><td>${row.Bus}</td><td>${row.Due}</td><td>${row.Destination}</td><td>${row.Duration}</td></tr>`);
  });
}
var seconds_to_minutes = (s) => {
  return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s
  //https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
}
