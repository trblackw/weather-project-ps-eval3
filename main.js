const API_KEY = "dc9c662a1bda3caf8b7c91b83968d8db";
const searchBtn = document.querySelector("button#search");
const citySearchInput = document.querySelector("input[aria-label=City");

const searchByCity = async city => {
  const cityWeatherRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city.toLowerCase()}&units=imperial&APPID=${API_KEY}`
  );
  const cityData = await cityWeatherRes.json();
  const { weather, coord, main, wind, sys: time } = cityData;

  const weatherObj = {
    city,
    weather,
    coord,
    main,
    wind,
    time
  };
  console.log(weatherObj);
  const source = document.querySelector("#weather-template").innerHTML;

  const template = Handlebars.compile(source);
  const HTML = template(weatherObj);
  const weatherUI = document.querySelector("#weather-data");
  weatherUI.style.display = "inherit";
  weatherUI.innerHTML = HTML;
};

searchBtn.addEventListener("click", () => {
  searchByCity(citySearchInput.value);
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
