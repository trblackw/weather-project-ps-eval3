const API_KEY = "dc9c662a1bda3caf8b7c91b83968d8db";

const searchBtn = document.querySelector("button#search");
const citySearchInput = document.querySelector("input[aria-label=City");

// const generateHTML = data => {
//   const rawTemplate = document.querySelector("#weather-template").innerHTML;
//   const compiledTemplate = Handlebars.compile(rawTemplate);
//   console.log(compiledTemplate(data));
//   //   const generatedHTML = compiledTemplate(data);
//   //   const container = document.querySelector("#weather-data");
//   //   return (container.innerHTML = generatedHTML);
// };

const searchByCity = async city => {
  const cityWeatherRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city.toLowerCase()}&APPID=${API_KEY}`
  );
  const cityData = await cityWeatherRes.json();
  const { weather, coord, main, wind, sys: time } = cityData;
  //   const weatherObj = {
  //     data: [{ city }, ...weather, coord, main, wind, time]
  //   };
  const weatherObj = {
    city,
    weather,
    coord,
    main,
    wind,
    time
  };
  console.log(weatherObj.main);
  const source = document.querySelector("#weather-template").innerHTML;

  const template = Handlebars.compile(source);
  const HTML = template(weatherObj);
  //   console.log(HTML);
  const weatherUI = document.querySelector("#weather-data");
  weatherUI.innerHTML = HTML;
};

searchBtn.addEventListener("click", () => {
  searchByCity(citySearchInput.value);
});
