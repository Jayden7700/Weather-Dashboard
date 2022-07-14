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