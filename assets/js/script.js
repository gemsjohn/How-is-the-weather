var getWeatherData = function(input) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + input + "&limit=5&appid=24787d0fd9b0c4521d7a7b1d914ee0c3";
    console.log(apiUrl);
}

getWeatherData("London");