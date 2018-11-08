const API_KEY = "dc9c662a1bda3caf8b7c91b83968d8db";
const searchBtn = document.querySelector("button#search");
const citySearchInput = document.querySelector("input[aria-label=City");
const currentLocationBtn = document.querySelector("#current-location");

const generateHTML = data => {
  const source = document.querySelector("#weather-template").innerHTML;
  const template = Handlebars.compile(source);
  const HTML = template(data);
  const weatherUI = document.querySelector("#weather-data");
  weatherUI.style.display = "inherit";
  weatherUI.innerHTML = HTML;
};

const searchByCity = async city => {
  const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city.toLowerCase()}&units=imperial&APPID=${API_KEY}`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city.toLowerCase()},us&units=imperial&APPID=${API_KEY}`;

  const weatherData = await Promise.all(
    [currentWeatherURL, forecastURL].map(url => fetch(url))
  ).then(responses => Promise.all(responses.map(res => res.json())));

  const [currentWeather, forecast] = weatherData;
  const { weather, coord, main, wind, sys: time } = currentWeather;

  const weatherObj = {
    currentWeather: [{ city }, weather, coord, main, wind, time],
    forecast
  };
  console.log(weatherObj);
  generateHTML(weatherObj);
};

const searchCurrentLocation = async (lat, lon) => {
  const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&APPID=${API_KEY}`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&APPID=${API_KEY}`;

  const weatherData = await Promise.all(
    [currentWeatherURL, forecastURL].map(url => fetch(url))
  ).then(responses => Promise.all(responses.map(res => res.json())));

  const [currentWeather, forecast] = weatherData;
  const { weather, coord, main, wind, sys: time } = currentWeather;

  const weatherObj = {
    currentWeather: [
      { city: forecast.city.name },
      weather,
      coord,
      main,
      wind,
      time
    ],
    forecast
  };
  citySearchInput.value = forecast.city.name;
  console.log(weatherObj);
  generateHTML(weatherObj);
};

searchBtn.addEventListener("click", () => {
  searchByCity(citySearchInput.value);
});

currentLocationBtn.addEventListener("click", () => {
  if ("geolocation" in navigator) {
    searchBtn.disabled = true;
    currentLocationBtn.innerText = "Getting location...";
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      searchCurrentLocation(lat, lon);
      searchBtn.disabled = false;
      currentLocationBtn.innerText = "Your current location";
    });
  } else {
    alert("please allow location services to use this functionality");
  }
});

//timeformatter snagged (and modified) from Stack Overflow
//https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript/847196#847196

Handlebars.registerHelper("formatTime", timeStamp => {
  const date = new Date(timeStamp * 1000);
  // Hours part from the timestamp
  const hours = date.getHours();
  // Minutes part from the timestamp
  const minutes = `0${date.getMinutes()}`;
  // Seconds part from the timestamp
  const seconds = `0${date.getSeconds()}`;
  // Will display time in 10:30:23 format
  const formattedTime = `${hours}:${minutes.substr(-1)}:${seconds.substr(-2)}`;
  return formattedTime;
});
