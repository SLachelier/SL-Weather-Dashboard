var searchEl = $('#search'); //search input
var prevSearchesEl = $('#prev-searches'); //previous searches
var formEl = $('#form'); //search form
var forecast = $('#forecast'); //container

//API KEY
var weatherKey = '849b3306f24686d55aff05fb6355c916';

function searchInput(event) {
  event.preventDefault();
  currentWeatherCall(searchEl.val());
}

/** 
@param {} cityName
*/

function currentWeatherCall(cityName) {
  var url = `https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${cityName}&appid=${weatherKey}`;
  fetch(url)
  .then(res => res.json())
  .then(data => {
    cityName = data.name;
    callOne(cityName, data.coord.lon, data.coord.lat);
    showPrevSearches(cityName, false);
  })
  .catch(err => {
    console.error('Error: ', err);
  })

  return;
}

/**
@param {} longitude
@param {} latitude
@param {} cityName
 */

function callOne(cityName, longitude, latitude) {
  var url = `https://api.openweathermap.org/data/2.5/onecall?units=imperial&lon=${longitude}&lat=${latitude}&appid=${weatherKey}`;
  fetch(url)
  .then(res => res.json())
  .then(data => {
    showCurrent(cityName, data.current);
    showWeek(data.daily);
  });
}

/**
@param {} cityName
@param {} showCurrent
 */

function showCurrent(cityName, currentWeather) {
  //attributes of the weather
  $('#city-name').html(cityName);
  $('#current-date').html(moment().format(M/D/YYYY));
  $('#weather-icon').attr('src', `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`);
  $('#current-temp').html(currentWeather.temp);
  $('#current-uv').html(currentWeather.uvIndex);
  $('#current-humidity').html(currentWeather.humidity);
  $('#current-wind').html(currentWeather.wind_speed);

  if(currentWeather.uvIndex > 6) {
    $('#currentUV').css('background', '#aa2020');
  } else if(currentWeather.uvIndex > 4) {
    $('#currentUV').css('background', '#aa6a20');
  } else {
    $('#currentUV').css('background', '#40aa20');
  }

  $('#container').css('display', 'block');

}
/**
@param {} forecastData
 */
function showWeek(forecastData) {
  forecast.html('');
  for(let i = 1; i <= 5; i++) {
    var divEl = $(`
    <div class="card">
    <p style="font-weight: 800">
    ${moment().clone().add(i, 'days').format("M/D/YYYY")}
    </p>
    <img src="http://openweathermap.org/img/wn/${forecastData[i].weather[0].icon}.png" alt="forecast icon">
    <p>Temperature: ${forecastData[i].temp.day}°F</p>
    <p>Wind Speed: ${forecastData[i].wind_speed}MPH</p>
    <p>Humidity: ${forecastData[i].humidity}%</p>
    </div>
    `)
    divEl.appendTo(container);
  }
}

/**
@param {} cityName
@param {} start
 */

function showPrevious(cityName, start) {
  var foundMatch = false;
  $('#prevSearches').children('').each(function(i) {
    if(cityName == $(this).text()) {
      foundMatch = true;
      return;
    }
  });
  if(foundMatch) {return;}

  var buttonEl = $(`<button type="button" class="col-12 mt-3 btn btn-secondary">${cityName}</button>`);
  buttonEl.on('click', prevButtonClick);
  buttonEl.prependTo(prevSearchesEl);

  if(!start) {savePrevData(cityName)};
}

/**
@param {} cityName
 */

function savePrevData(cityName) {
  tempItem = JSON.parse(localStorage.getItem('prevSearches'));
  if (tempItem != null) {
    localStorage.setItem('prevSearches', JSON.stringify(tempItem.concat(cityName)));
  } else {
    tempArr = [cityName];
    localStorage.setItem('prevSearches', JSON.stringify(tempArr));
  }
}

function prevButtonClick(event) {
  currentWeatherCall(event.target.innerHTML);
}

function init() {
  searchEl.submit(searchInput);
  tempArr = JSON.parse(localStorage.getItem('prevSearches'))
  if (temp != null) {
    for (let i = 0; i < tempArr.length; i++) {
      showPrevSearches(tempArr[i], true)
    }
  }
}

init();