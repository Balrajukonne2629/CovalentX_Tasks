const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const result = document.getElementById('result');

async function getWeatherByCity(city) {
  result.innerHTML = 'Loading...';

  const geoUrl = 'https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(city);
  const geoRes = await fetch(geoUrl);
  const geoData = await geoRes.json();

  if (!geoData.results || geoData.results.length === 0) {
    result.innerHTML = 'City not found.';
    return;
  }

  const place = geoData.results[0];
  getWeatherByCoords(place.latitude, place.longitude, place.name);
}

async function getWeatherByCoords(lat, lon, placeName) {
  result.innerHTML = 'Loading...';

  const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current_weather=true';
  const weatherRes = await fetch(weatherUrl);
  const weatherData = await weatherRes.json();

  const weather = weatherData.current_weather;

  result.innerHTML =
    '<h2>' + (placeName || 'Your Location') + '</h2>' +
    '<p>Temperature: ' + weather.temperature + '&deg;C</p>' +
    '<p>Wind Speed: ' + weather.windspeed + ' km/h</p>';
}

searchBtn.addEventListener('click', function () {
  const city = cityInput.value.trim();
  if (city !== '') {
    getWeatherByCity(city);
  }
});

locationBtn.addEventListener('click', function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      getWeatherByCoords(position.coords.latitude, position.coords.longitude, 'Your Location');
    });
  } else {
    result.innerHTML = 'Geolocation is not supported by your browser.';
  }
});
