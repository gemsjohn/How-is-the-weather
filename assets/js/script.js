var citySearchEl = document.querySelector("#user-form"); 
var inputValueEl = document.querySelector("#search-location");
var displayResultsEl = document.querySelector("#results");
var weatherDetails = document.querySelector("#weather-details");
var historyEl = document.querySelector("#history");
var day_a = document.querySelector("#day_a");
var day_b = document.querySelector("#day_b");
var day_c = document.querySelector("#day_c");
var day_d = document.querySelector("#day_d");
var day_e = document.querySelector("#day_e");

var weatherCurrent = document.createElement("div");
var weatherLocation = document.createElement("div");
var weatherDetailsH3 = document.createElement("h3");
var cityListGroupUl = document.createElement("ul");
var weatherTemp = document.createElement("h3");
var weatherWind = document.createElement("h3");
var weatherHumidity = document.createElement("h3");
var weatherUV = document.createElement("h3");
var icon = document.createElement("h3");
var dayOne = document.createElement("h3");
var dayTwo = document.createElement("h3");
var dayThree = document.createElement("h3");
var dayFour = document.createElement("h3");
var dayFive = document.createElement("h3");

var historicalButtonRefresh = [];
var resultButtons = [];
var recentSearch = [];
var recentSearchLat = [];
var recentSearchLon = [];

var recentSearchData = localStorage.getItem("recentSearch");
var recentSearchLatData = localStorage.getItem("recentSearchLat");
var recentSearchLonData = localStorage.getItem("recentSearchLon");

var recentSearchStorage = JSON.parse(recentSearchData);
var recentSearchLatStorage = JSON.parse(recentSearchLatData);
var recentSearchLonStorage = JSON.parse(recentSearchLonData);

// On page refresh check local storage and update the recent search history.
var checkHistory = function() {
    removeHistoricalButtons();
    for (var i = 0; i < recentSearchStorage.length; i++) {  
        if (recentSearchStorage.length > 3) {
            recentSearchStorage.shift();
            recentSearchLatStorage.shift();
            recentSearchLonStorage.shift();
        }
        recentSearch.push('' + recentSearchStorage[i] + '');
        recentSearchLat.push('' + recentSearchLatStorage[i] + '');
        recentSearchLon.push('' + recentSearchLonStorage[i] + '');
        updateButtons(i);
    }   
};

// Prevent recent search history buttons from duplicating.
var removeHistoricalButtons = function() {
    if (historicalButtonRefresh) {
        for (var x = 0; x < historicalButtonRefresh.length; x++) {
            var buttonPrevious = document.querySelector(
                "button[data-refresh='" + x + "']"
            );
            buttonPrevious.remove();
        };
    }
}

// Update recent serach history buttons and handle on click events.
var updateButtons = function (i) {
    historicalButtonRefresh[i] = document.createElement("button");
    historicalButtonRefresh[i].classList = "btn btn-info btn-lg text-light m-3 btn-hover";
    historicalButtonRefresh[i].textContent = recentSearchStorage[i];
    historicalButtonRefresh[i].setAttribute("data-refresh", i);
    historyEl.appendChild(historicalButtonRefresh[i]);

    $('button[data-refresh="' + i + '"]').on("click", function(event) {
        var element = event.target;
        var i = element.getAttribute('data-refresh');

        var latitude = recentSearchLat[i];
        var longitude = recentSearchLon[i];

        weatherLocation.remove();
        dayOne.innerHTML = "";
        dayTwo.innerHTML = "";
        dayThree.innerHTML = "";
        dayFour.innerHTML = "";
        dayFive.innerHTML = "";

        weatherDetailsH3.classList = "text-light";
        weatherDetails.textContent = $(this).text();
        weatherLocation.appendChild(weatherDetailsH3);
        
        convertGeoToData(latitude, longitude);
    });
};

// Establish the current date and time.
var day = moment().format('MMMM Do YYYY, h:mm:ss a');
$("#currentDay").append(document.createTextNode(day));

// On page refresh determine if there is anything stored in local storage 
if (recentSearchData === null) {
    recentSearch = [];
    recentSearchLatData = [];
    recentSearchLonData = [];
} else if (recentSearchData) {
    checkHistory();
}

// User selects Search Button and passes input value as a 
// parameter through getWeatherData().
var buttonClickHandler = function(event) {
    // updated = 1;
    event.preventDefault();
    var input = inputValueEl.value.trim();
    if (input) {
        inputValueEl.value = "";
        getWeatherData(input);
    } else {
        alert("Please ender a city name.");
    }
};

// Add input parameter to Geocoding apiURL and look for a response.
// Take response data and pass it through displaySearchResult() as a parameter.
var getWeatherData = function(input) {
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + input + "&limit=5&appid=24787d0fd9b0c4521d7a7b1d914ee0c3";
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

// Based on the city data produce search results so the user can select the correct city.
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
        
        locationDetails[i] = cityName + ", " + cityState + ", " + cityCountry;
        resultButtons[i] = document.createElement("button");
        resultButtons[i].textContent = locationDetails[i];
        resultButtons[i].classList = "list-group-item list-group-item-primary";
        resultButtons[i].setAttribute("data-select", i);

        cityListGroupUl.classList = "list-group col-lg-3";
        cityListGroupUl.appendChild(resultButtons[i]);
        displayResultsEl.appendChild(cityListGroupUl);
 
        $(resultButtons[i]).on("click", function(event) {
            for (var x = 0; x < resultButtons.length; x++) {
                var buttonPrevious = document.querySelector(
                    "button[data-select='" + x + "']"
                );
                buttonPrevious.remove();
            };
            
            var element = event.target;
            var i = element.getAttribute('data-select');

            weatherDetailsH3.classList = "text-light";
            weatherDetails.textContent = $(this).text();
            weatherLocation.appendChild(weatherDetailsH3);

            recentSearch.push(city[i].name + ", " + city[i].state + ", " + city[i].country);

            var latitude = city[i].lat;
            var longitude = city[i].lon;

            recentSearchLat.push(latitude);
            recentSearchLon.push(longitude);

            if (recentSearch.length > 3) {
                recentSearch.shift();
                recentSearchLat.shift();
                recentSearchLon.shift();
            }

            localStorage.setItem("recentSearch", JSON.stringify(recentSearch));
            localStorage.setItem("recentSearchLat", JSON.stringify(recentSearchLat));
            localStorage.setItem("recentSearchLon", JSON.stringify(recentSearchLon));

            recentSearchData = localStorage.getItem("recentSearch");
            recentSearchLatData = localStorage.getItem("recentSearchLat");
            recentSearchLonData = localStorage.getItem("recentSearchLon");

            recentSearchStorage = JSON.parse(recentSearchData);
            recentSearchLatStorage = JSON.parse(recentSearchLatData);
            recentSearchLonStorage = JSON.parse(recentSearchLonData);

            removeHistoricalButtons();
            for (var i = 0; i < recentSearchStorage.length; i++) {
                updateButtons(i);
            }
            convertGeoToData(latitude, longitude);
        });
    }
};

// Add latitude and longitude parameters to the OpenWeather apiURL and look for a response.
// Take response data and pass it through displayWeatherDetails() as a parameter.
var convertGeoToData = function(lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon=" + lon + "&units=imperial&exclude=hourly,dailer&appid=24787d0fd9b0c4521d7a7b1d914ee0c3";
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
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

// Display weather details for the given city; current and five day forecast.
var displayWeatherDetails = function(cityData) { 
    var imgAPISource = cityData.current.weather[0].icon;
    var iconImg = "http://openweathermap.org/img/wn/" + imgAPISource + "@2x.png"
    icon.innerHTML = "<img src=" + iconImg + ">"; 

    weatherTemp.classList = "text-light";
    weatherTemp.textContent = "Temp: " + cityData.current.temp + " °F";

    weatherWind.classList = "text-light";
    weatherWind.textContent = "Wind: " + cityData.current.wind_speed + " MPH";

    weatherHumidity.classList = "text-light";
    weatherHumidity.textContent = "Humidity: " + cityData.current.humidity + " %";

    if (cityData.current.uvi >= 0 && cityData.current.uvi < 3) {
        weatherUV.classList = "text-light badge bg-success";
        weatherUV.textContent = "UV Index: " + cityData.current.uvi;
    } else if (cityData.current.uvi >= 3 && cityData.current.uvi < 8) {
        weatherUV.classList = "text-light badge bg-warning";
        weatherUV.textContent = "UV Index: " + cityData.current.uvi;
    } else if (cityData.current.uvi >= 8) {
        weatherUV.classList = "text-light badge bg-danger";
        weatherUV.textContent = "UV Index: " + cityData.current.uvi;
    }

    weatherCurrent.appendChild(icon);
    weatherCurrent.appendChild(weatherTemp);
    weatherCurrent.appendChild(weatherWind);
    weatherCurrent.appendChild(weatherHumidity);
    weatherCurrent.appendChild(weatherUV);
    weatherDetails.appendChild(weatherCurrent);

    fiveDayForecast(cityData.daily);
};

var fiveDayForecast = function(daily) {
    var day = [];
    var day_temp = [];
    var day_wind = [];
    var day_humidity = [];
    var day_icon = [];
    
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
    }

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
        + "<li>" + "Temp: " + day_temp[1] + " °F" + "</li>" 
        + "<li>" + "Wind: " + day_wind[1] + " MPH" + "</li>"
        + "<li>" + "Humidity: " + day_humidity[1] + " %" + "</li>";
    
    dayTwo.innerHTML = "<h3>" + day[2]._d + "</h3>"
        + "<img src=" + iconImgTwo + ">"
        + "<li>" + "Temp: " + day_temp[2] + " °F" + "</li>" 
        + "<li>" + "Wind: " + day_wind[2] + " MPH" + "</li>"
        + "<li>" + "Humidity: " + day_humidity[2] + " %" + "</li>";

    dayThree.innerHTML = "<h3>" + day[3]._d + "</h3>"
        + "<img src=" + iconImgThree + ">"
        + "<li>" + "Temp: " + day_temp[3] + " °F" + "</li>" 
        + "<li>" + "Wind: " + day_wind[3] + " MPH" + "</li>"
        + "<li>" + "Humidity: " + day_humidity[3] + " %" + "</li>";

    dayFour.innerHTML = "<h3>" + day[4]._d + "</h3>"
        + "<img src=" + iconImgFour + ">"
        + "<li>" + "Temp: " + day_temp[4] + " °F" + "</li>" 
        + "<li>" + "Wind: " + day_wind[4] + " MPH" + "</li>"
        + "<li>" + "Humidity: " + day_humidity[4] + " %" + "</li>";

    dayFive.innerHTML = "<h3>" + day[5]._d + "</h3>"
        + "<img src=" + iconImgFive + ">" 
        + "<li>" + "Temp: " + day_temp[5] + " °F" + "</li>" 
        + "<li>" + "Wind: " + day_wind[5] + " MPH" + "</li>"
        + "<li>" + "Humidity: " + day_humidity[5] + " %" + "</li>";

    day_a.appendChild(dayOne);
    day_b.appendChild(dayTwo);
    day_c.appendChild(dayThree);
    day_d.appendChild(dayFour);
    day_e.appendChild(dayFive);
    
};

citySearchEl.addEventListener("submit", buttonClickHandler);