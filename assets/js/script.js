// Variables that query the index.html file
var citySearchEl = document.querySelector("#button-addon2"); 
var inputValueEl = document.querySelector("#search-location");
var displayResultsEl = document.querySelector("#results");
var weatherDetails = document.querySelector("#weather-details");

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
                console.log(response);
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
        cityListGroupUl.classList = "list-group col-3";
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
};


$(citySearchEl).on("click", function() {
    buttonClickHandler();
})
