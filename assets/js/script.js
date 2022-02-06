// Variables that query the index.html file
var citySearchEl = document.querySelector("#button-addon2"); 
var inputValueEl = document.querySelector("#search-location");
var displayResultsEl = document.querySelector("#results");
var weatherDetails = document.querySelector("#weather-details");
var forecastDetails = document.querySelector("#fiveDayForecast");

// Establish the current date and time
var day = moment().format('MMMM Do YYYY, h:mm:ss a');
$("#currentDay").append(document.createTextNode(day));

// When the user searches for a city, the input value 
// serves as a parameter for the getWeatherData function
var buttonClickHandler = function() {
    var input = inputValueEl.value.trim();
    getWeatherData(input);
};

// getWeatherData takes the 'input' and adds it to the apiUrl query
// If the user gets a response then use the data
// as the parameter for displaySearchResults function
// else display an alert
var getWeatherData = function(input) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + input + "&limit=5&appid=24787d0fd9b0c4521d7a7b1d914ee0c3";
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    displaySearchResult(data);
                });
            } else {
                alert("Error: " + response.statusText)
            }
        })
        .catch(function(error) {
            alert("Unable to connect to OpenWeather");
        });
};

// displaySearchReach takes the 'city' geocoding api data, identifies the length of the array,
// appends part of the data to a list of buttons.
// If the user selects one of those buttons, then the City, State, and Country details
// are appended to the CITY card. The longitude and latitude are passed as parameters
// through convertGeoToData function
var displaySearchResult = function (city) {
    if (city.length === 0) {
        displayResultsEl.textContent = "City not found.";
        return;
    }

    for (var i = 0; i < city.length; i++) {

        var cityName = city[i].name;
        var cityState = city[i].state;
        var cityCountry = city[i].country;
        var locationDetails = [];
        var resultButtons = [];

        locationDetails[i] = cityName + ", " + cityState + ", " + cityCountry;

        resultButtons[i] = document.createElement("button");
        resultButtons[i].textContent = locationDetails[i];
        resultButtons[i].classList = "list-group-item list-group-item-primary";
        resultButtons[i].setAttribute("data-select", i);

        var cityListGroupUl = document.createElement("ul");
        cityListGroupUl.classList = "list-group col-lg-3";
        cityListGroupUl.appendChild(resultButtons[i]);
        displayResultsEl.appendChild(cityListGroupUl);

        $(resultButtons[i]).on("click", function(event) {
            var element = event.target;
            var i = element.getAttribute('data-select');

            displayResultsEl.remove();

            var weatherLocation = document.createElement("div");
            var weatherDetailsH3 = document.createElement("h3");
            weatherDetailsH3.classList = "text-light";
            weatherDetails.textContent = $(this).text();
            weatherLocation.appendChild(weatherDetailsH3);

            var latitude = city[i].lat;
            var longitude = city[i].lon;

            convertGeoToData(latitude, longitude);
        });
        
    }
};

// convertGeoToData takes the latitude and longitude from the city data and adds
// them to the apiUrl query. The result of that data is passed as a parameter through
// the displayWeatherDetails function.
var convertGeoToData = function(lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon=" + lon + "&units=imperial&exclude=hourly,dailer&appid=24787d0fd9b0c4521d7a7b1d914ee0c3";
    console.log(apiUrl);
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function(data) {
                    console.log(data);
                    displayWeatherDetails(data);
                });
            } else {
                alert("Error: " + response.statusText)
            }
        })
        .catch(function(error) {
            alert("Unable to connect to OpenWeather");
        });
};

// displayWeatherDetails takes the One Call API data and pulls 
// the  current temperature, wind, humidity, and UV index data.
// Then appends that data to the CITY card below the City, State, and Sate details.
var displayWeatherDetails = function(cityData) {
    console.log(cityData.current);
    var weatherCurrent = document.createElement("div");

    var weatherTemp = document.createElement("h3");
    weatherTemp.classList = "text-light";
    weatherTemp.textContent = "Temp: " + cityData.current.temp + " °F";

    var weatherWind = document.createElement("h3");
    weatherWind.classList = "text-light";
    weatherWind.textContent = "Wind: " + cityData.current.wind_speed + " MPH";

    var weatherHumidity = document.createElement("h3");
    weatherHumidity.classList = "text-light";
    weatherHumidity.textContent = "Humidity: " + cityData.current.humidity + " %";

    var weatherUV = document.createElement("h3");
    weatherUV.classList = "text-light";
    weatherUV.textContent = "UV Index: " + cityData.current.uvi;

    weatherCurrent.appendChild(weatherTemp);
    weatherCurrent.appendChild(weatherWind);
    weatherCurrent.appendChild(weatherHumidity);
    weatherCurrent.appendChild(weatherUV);
    weatherDetails.appendChild(weatherCurrent);

    // console.log(cityData.daily);
    fiveDayForecast(cityData.daily);
};

var fiveDayForecast = function(daily) {
    var day_a = document.querySelector("#day_a");
    var day_b = document.querySelector("#day_b");
    var day_c = document.querySelector("#day_c");
    var day_d = document.querySelector("#day_d");
    var day_e = document.querySelector("#day_e");

    var day = [];
    var day_temp = [];
    var day_wind = [];
    var day_humidity = [];
    var day_icon = [];

    

    console.log(daily);
    
    for (var i = 0; i < daily.length; i++) {
        var unixUTC = daily[i].dt;
        var temp = daily[i].temp.day;
        var wind = daily[i].wind_speed;
        var humidity = daily[i].humidity;
        var icon = daily[i].weather[0].icon;

        day[i] = moment.unix(unixUTC);
        day_temp[i] = temp;
        day_wind[i] = wind;
        day_humidity[i] = humidity;
        day_icon[i] = icon;

        console.log(day[i]._d);
        
    }

    var dayOne = document.createElement("h3");
    var dayTwo = document.createElement("h3");
    var dayThree = document.createElement("h3");
    var dayFour = document.createElement("h3");
    var dayFive = document.createElement("h3");

    dayOne.classList = "text-light";
    dayTwo.classList = "text-light";
    dayThree.classList = "text-light";
    dayFour.classList = "text-light";
    dayFive.classList = "text-light";

    var iconImgOne = "http://openweathermap.org/img/wn/" + day_icon[1] + "@2x.png"
    var iconImgTwo = "http://openweathermap.org/img/wn/" + day_icon[2] + "@2x.png"
    var iconImgThree = "http://openweathermap.org/img/wn/" + day_icon[3] + "@2x.png"
    var iconImgFour = "http://openweathermap.org/img/wn/" + day_icon[4] + "@2x.png"
    var iconImgFive = "http://openweathermap.org/img/wn/" + day_icon[5] + "@2x.png"

    dayOne.innerHTML = "<h3>" + day[1]._d + "</h3>"
        + "<img src=" + iconImgOne + ">" 
        + "<li>" + "Temp: " + day_temp[1] + "</li>" 
        + "<li>" + "Wind: " + day_wind[1] + "</li>"
        + "<li>" + "Humidity: " + day_humidity[1] + "</li>";
    
    dayTwo.innerHTML = "<h3>" + day[2]._d + "</h3>"
        + "<img src=" + iconImgTwo + ">"
        + "<li>" + "Temp: " + day_temp[2] + "</li>" 
        + "<li>" + "Wind: " + day_wind[2] + "</li>"
        + "<li>" + "Humidity: " + day_humidity[2] + "</li>";

    dayThree.innerHTML = "<h3>" + day[3]._d + "</h3>"
        + "<img src=" + iconImgThree + ">"
        + "<li>" + "Temp: " + day_temp[3] + "</li>" 
        + "<li>" + "Wind: " + day_wind[3] + "</li>"
        + "<li>" + "Humidity: " + day_humidity[3] + "</li>";

    dayFour.innerHTML = "<h3>" + day[4]._d + "</h3>"
        + "<img src=" + iconImgFour + ">"
        + "<li>" + "Temp: " + day_temp[4] + "</li>" 
        + "<li>" + "Wind: " + day_wind[4] + "</li>"
        + "<li>" + "Humidity: " + day_humidity[4] + "</li>";

    dayFive.innerHTML = "<h3>" + day[5]._d + "</h3>"
        + "<img src=" + iconImgFive + ">" 
        + "<li>" + "Temp: " + day_temp[5] + "</li>" 
        + "<li>" + "Wind: " + day_wind[5] + "</li>"
        + "<li>" + "Humidity: " + day_humidity[5] + "</li>";

    day_a.appendChild(dayOne);
    day_b.appendChild(dayTwo);
    day_c.appendChild(dayThree);
    day_d.appendChild(dayFour);
    day_e.appendChild(dayFive);
};



$(citySearchEl).on("click", function() {
    buttonClickHandler();
})
