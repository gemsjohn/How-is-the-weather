var citySearchEl = document.querySelector("#button-addon2"); 
var inputValue = document.querySelector("#search-location");
var displayResults = document.querySelector("#results");

var latitude = 0;
var longitude = 0;

var day = moment().format('MMMM Do YYYY, h:mm:ss a');
$("#currentDay").append(document.createTextNode(day));

var convertGeoToData = function(lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon=" + lon + "&exclude=hourly,dailer&appid=24787d0fd9b0c4521d7a7b1d914ee0c3";

}

var getWeatherData = function(input) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + input + "&limit=5&appid=24787d0fd9b0c4521d7a7b1d914ee0c3";
    console.log(apiUrl);
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function(data) {
                    console.log(data);
                    displaySearchResult(data)
                });
            } else {
                alert("Error: " + response.statusText)
            }
        })
        .catch(function(error) {
            alert("Unable to connect to GitHub");
        });
        // latitude = apiUrl[0].lat.value;
        // console.log(latitude);
};

var displaySearchResult = function (city) {
    if (city.length === 0) {
        displayResults.textContent = "City not found.";
        return;
    }

    for (var i = 0; i < city.length; i++) {
        var locationDetails = "City: " + city[i].name + ", State: " + city[i].state + ", Country: " + city[i].country;
        //console.log(locationDetails);

        var cityListGroupUl = document.createElement("ul");
        cityListGroupUl.classList = "list-group col-3";

        var cityListGroupLi = document.createElement("button");
        cityListGroupLi.classList = "list-group-item list-group-item-primary test";
        cityListGroupLi.setAttribute("data-choice", i);
        cityListGroupLi.textContent = locationDetails;

        cityListGroupUl.appendChild(cityListGroupLi);

        displayResults.appendChild(cityListGroupUl);

        $('button[data-choice="' + i + '"]').on("click", function(index) {
            console.log($(this).text());
        });
        
    }
};

var buttonClickHandler = function() {
    var input = inputValue.value.trim();
    getWeatherData(input);
};

citySearchEl.addEventListener("click", buttonClickHandler);