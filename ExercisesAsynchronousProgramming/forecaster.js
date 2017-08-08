function attachEvents() {

    let icon = {
        "Sunny": '&#x2600',
        "Partly sunny":	'&#x26C5',
        "Overcast": '&#x2601',
        "Rain":'&#x2614',
        "Degrees": '&#176'

    };

    let html = `        <div id="current">
            <div class="label">Current conditions</div>
        </div>
        <div id="upcoming">
            <div class="label">Three-day forecast</div>
        </div>`;

    getWeatherUrl = 'https://judgetests.firebaseio.com/locations.json';

    $('#submit').on('click', function () {
        getWeather();
    })

    function getWeather() {
        let request = {
            url: getWeatherUrl,
            method: 'GET',
            success: execute,
            error: handleError
        }
        
        $.ajax(request);
    }

    function handleError() {
        $('#forecast').empty().text('Error');
        $('#forecast').show();
    }

    function execute(cities) {
        let location = $('#location').val();
        let cityCode;
        for (let city of cities) {
            if(city.name === location){
                cityCode = city.code;
                break;
            }
        }
        if(cityCode === null || cityCode === undefined){
            handleError();
        } else {
            $.when(getCurrentDayForecast(cityCode), getThreeDaysForecast(cityCode)).done(function (today, threeDays) {
                showForecast(today, threeDays);
            })
        }
    }

    function getCurrentDayForecast(cityCode) {
        let url = `https://judgetests.firebaseio.com/forecast/today/${cityCode}.json`;
        let request = {
            url,
            method: "GET"
        }

        return $.ajax(request);
    }
    
    function getThreeDaysForecast(cityCode) {
        let url = `https://judgetests.firebaseio.com/forecast/upcoming/${cityCode}.json`;
        let request = {
            url,
            method: "GET"
        }

        return $.ajax(request);
    }

    function showForecast(today, threeDays) {
        $('#forecast').empty().append(html);
        let current = $('#current');
        let symbol = $('<span>').addClass('condition symbol').html(icon[today[0].forecast.condition]);
        let condition = $('<span>').addClass('condition');
        let cityName = $('<span>').addClass('forecast-data').text(today[0].name);
        let degrees = $('<span>').addClass('forecast-data').html(`${today[0].forecast.low}${icon.Degrees}/${today[0].forecast.high}${icon.Degrees}`);
        let weather = $('<span>').addClass('forecast-data').text(today[0].forecast.condition);

        condition.append(cityName).append(degrees).append(weather);
        current.append(symbol).append(condition);

        let upcomingContainer = $('#upcoming').empty().append($('<div class="label">Three-day forecast</div>'));

        console.log(threeDays);
        console.log(threeDays['forecast']);
        for (let day of threeDays[0].forecast) {
            let upcoming = $('<span>').addClass('upcoming');

            let symbol = $('<span>').addClass('condition symbol').html(icon[day.condition]);
            let degrees = $('<span>').addClass('forecast-data').html(`${day.low}${icon.Degrees}/${day.high}${icon.Degrees}`);
            let weather = $('<span>').addClass('forecast-data').text(day.condition);

            upcoming.append(symbol).append(degrees).append(weather);
            upcomingContainer.append(upcoming);
        }

        $('#forecast').show();
    }
}