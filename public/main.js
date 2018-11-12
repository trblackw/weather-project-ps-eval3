const API_KEY = "dc9c662a1bda3caf8b7c91b83968d8db";
const searchBtn = document.querySelector("button#search");
const citySearchInput = document.querySelector("input[aria-label=City");
const countryCodeSelect = document.querySelector("select#country-code-select");
const currentLocationBtn = document.querySelector("#current-location");
const changeCountryCodeBtn = document.querySelector(
  "button#change-country-code"
);

const populateCountryCodes = () => {
  fetch("/codes")
    .then(codes => codes.json())
    .then(codes => generateCountryCodeHTML({ codes }));
};

changeCountryCodeBtn.addEventListener("click", populateCountryCodes);

const generateCountryCodeHTML = data => {
  const source = document.querySelector("#country-code-template").innerHTML;
  const template = Handlebars.compile(source);
  const HTML = template(data);
  const codeUI = document.querySelector("div#country-codes");
  codeUI.style.display = "inherit";
  codeUI.innerHTML = HTML;
  const countryCodeSelect = document.querySelector(
    "select#country-code-select"
  );
  countryCodeSelect.addEventListener("change", () =>
    searchByCity(citySearchInput.value, countryCodeSelect.value)
  );
};

const generateForecastHTML = data => {
  const source = document.querySelector("#weather-template").innerHTML;
  const template = Handlebars.compile(source);
  const HTML = template(data);
  const weatherUI = document.querySelector("#weather-data");
  weatherUI.style.display = "inherit";
  weatherUI.innerHTML = HTML;
  const toggleForecast = document.querySelector("button#toggle-forecast");
  toggleForecast.addEventListener("click", () => {
    const forecastData = document.querySelector("div#weather-forecast");
    return !forecastData.style.display
      ? (forecastData.style.display = "inherit")
      : (forecastData.style.display = "none");
  });
};

const searchByCity = async (city, code = "us") => {
  if (citySearchInput.value === "") {
    alert("please enter a city");
    return;
  }
  const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city.toLowerCase()},${code.toLowerCase()}&units=imperial&APPID=${API_KEY}`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city.toLowerCase()},${code.toLowerCase()}&units=imperial&APPID=${API_KEY}`;

  const weatherData = await Promise.all(
    [currentWeatherURL, forecastURL].map(url => fetch(url))
  ).then(responses => Promise.all(responses.map(res => res.json())));

  const [currentWeather, forecast] = weatherData;
  const { weather, main: temperature, wind, sys: time } = currentWeather;
  const { list } = forecast;
  const { name, id } = forecast.city;

  const [weatherDescription] = weather;

  const weatherObj = {
    name,
    weatherDescription,
    temperature,
    wind,
    time,
    list
  };
  console.log(weatherObj);
  generateForecastHTML(weatherObj);
};

const searchCurrentLocation = async (lat, lon) => {
  const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&APPID=${API_KEY}`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&APPID=${API_KEY}`;

  const weatherData = await Promise.all(
    [currentWeatherURL, forecastURL].map(url => fetch(url))
  ).then(responses => Promise.all(responses.map(res => res.json())));

  const [currentWeather, forecast] = weatherData;
  const { weather, main: temperature, wind, sys: time } = currentWeather;
  const { list } = forecast;
  const { name, id } = forecast.city;

  const [weatherDescription] = weather;

  const weatherObj = {
    name,
    weatherDescription,
    temperature,
    wind,
    time,
    list
  };
  console.log(weatherObj);
  generateForecastHTML(weatherObj);
};

searchBtn.addEventListener("click", () => {
  console.log();
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

Handlebars.registerHelper('getCountryName', code => {
   
})