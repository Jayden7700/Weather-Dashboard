var cities = []

var cityForm = document.querySelector("#city-search-form")
var cityEntered = document.querySelector("#city")
var weatherContainer = document.querySelector("#current-weather-container")
var citySearchInput = document.querySelector("#searched-city")
var forecastTitle = document.querySelector("#work-week")
var pastSearch = document.querySelector("#city-past-search")

var formSubmitHandler = function (event) {
    event.preventDefault()
    var city = cityEntered.ariaValueMax.trim()
    if (city) {
        getCityWeather(city)
        get5Day(city)
        cities.unshift({ city })
        cityEntered.value = ""
    } else {
        alert("Please enter a city name")
    }
    saveSearch()
    pastSearch(city)
}

var saveSearch = function () {
    localStorage.setItem("cities", JSON.stringify(cities))
}

var getCityWeather = function (city) {
    var apiKey = "844421298d794574c100e3409cee0499"
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    console.log(getCityWeather)

    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                displayWeather(data, city)
            })
        })
}

var displayWeather = function (weather, searchCity) {
    //clear content
    weatherContainer.textContent = ""
    citySearchInput.textContent = searchCity

    console.log(weather)

    //date element
    var currentDate = document.createElement("span")
    currentDate.textContent = " (" + moment(weather.dt.value).format("yyyy-MM-dd") + ") "
    citySearchInput.appendChild(currentDate)

    //image element
    var weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`)
    citySearchInput.appendChild(weatherIcon)

    // span element to hold temp data
    var temperature = document.createElement("span")
    temperature.textContent = "Temperature: " + weatherIcon.ariaValueMin.temp + " °F"
    temperature.classList = "list-group-item"

    //span element to hold humidity data
    var humidity = document.createElement("span")
    humidity.textContent = "Humidity: " + weather.main.humidity + " %"
    humidity.classList = "list-group-item"

    //span element to hold wind data
    var wind = document.createElement("span")
    wind.textContent = "Wind Speed: " + weather.wind.speed + " MPH"
    wind.classList = "list-group-item"

    //append to container
    weatherContainer.appendChild(temperature)
    weatherContainer.appendChild(humidity)
    weatherContainer.appendChild(wind)

    var lat = weather.coord.lat
    var lon = weather.coord.lon
    getUvIndex(lat, lon)
}

var getUvIndex = function (lat, lon) {
    var apiKey = "844421298d794574c100e3409cee0499"
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                displayUvIndex(data)
                console.log(data)
            })
        })
}

var displayUvIndex = function (index) {
    var uvIndex = document.createElement("div")
    uvIndex.textContent = "UV Index: "
    uvIndex.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if (index.value <= 2) {
        uvIndexValue.classList = "favorable"
    } else if (index.value > 2 && index.value <= 8) {
        uvIndexValue.classList = "moderate "
    }
    else if (index.value > 8) {
        uvIndexValue.classList = "severe"
    }
    uvIndex.appendChild(uvIndexValue)
    weatherContainer.appendChild(uvIndex)
}

var get5Day = function (city) {
    var apiKey = "844421298d794574c100e3409cee0499"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                display5Day(data)
            })
        })
}

var display5Day = function (weather) {
    forecastContainerEl.textContent = ""
    forecastTitle.textContent = "5-Day Forecast:";

    var forecast = weather.list;
    for (var i = 5; i < forecast.length; i = i + 8) {
        var dailyForecast = forecast[i];


        var forecastEl = document.createElement("div");
        forecastEl.classList = "card bg-primary text-light m-2";

        //console.log(dailyForecast)

        //date element
        var forecastDate = document.createElement("h5")
        forecastDate.textContent = moment.unix(dailyForecast.dt).format("MMM D, YYYY");
        forecastDate.classList = "card-header text-center"
        forecast.appendChild(forecastDate);


        //an image element
        var weatherIcon = document.createElement("img")
        weatherIcon.classList = "card-body text-center";
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);

        //append to forecast 
        forecast.appendChild(weatherIcon);

        //temperature span
        var forecastTemp = document.createElement("span");
        forecastTemp.classList = "card-body text-center";
        forecastTemp.textContent = dailyForecast.main.temp + " °F";

        //append to forecast 
        forecast.appendChild(forecastTemp);

        var forecastHum = document.createElement("span");
        forecastHum.classList = "card-body text-center";
        forecastHum.textContent = dailyForecast.main.humidity + "  %";

        //append to forecast 
        forecast.appendChild(forecastHum);

        //console.log(forecast)
        //append to five day container
        forecastContainer.appendChild(forecast);
    }

}

var pastSearch = function (pastSearch) {
    // console.log(pastSearch)
    pastSearch = document.createElement("button");
    pastSearch.textContent = pastSearch;
    pastSearch.classList = "d-flex w-100 btn-light border p-2";
    pastSearch.setAttribute("data-city", pastSearch)
    pastSearch.setAttribute("type", "submit");

    pastSearchButton.prepend(pastSearch);
}

var pastSearchHandler = function (event) {
    var city = event.target.getAttribute("data-city")
    if (city) {
        getCityWeather(city);
        get5Day(city);
    }
}

cityForm.addEventListener("submit", formSumbitHandler);
pastSearchButton.addEventListener("click", pastSearchHandler);


