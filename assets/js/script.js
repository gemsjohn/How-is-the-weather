var citySearchEl = document.querySelector("#button-addon2"); 
var inputValue = document.querySelector("#search-location");

var day = moment().format('MMMM Do YYYY, h:mm:ss a');
$("#currentDay").append(document.createTextNode(day));

var getWeatherData = function(input) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + input + "&limit=5&appid=24787d0fd9b0c4521d7a7b1d914ee0c3";
    console.log(apiUrl);
};

var buttonClickHandler = function() {
    var input = inputValue.value.trim();
    getWeatherData(input);
};

citySearchEl.addEventListener("click", buttonClickHandler);