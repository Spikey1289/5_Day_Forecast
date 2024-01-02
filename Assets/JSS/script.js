

function weatherUpdate(){

    // API key
    var key = '0d5eaf94c0bcbc10362599a78ea0e18c'

    //searched city
    var city = "Richmond";

    //GeoCoding Request URL

    var gRequestURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + key;

    // Weather Request URL for ease of access
    // var wRequestURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + '44.34' + '&lon=' + '10.99' + '&appid=' + key + '&units=metric';

    //array to store weather objects

    var weather = [];

    //fetch the coordinates of the city
    fetch(gRequestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            //object with coordinates
            var location = {lat: data[0].lat, lon: data[0].lon};

            return location;
        })
        .then(function (location) {

            //passes the coordinates to the weather api
            wRequestURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + location.lat + '&lon=' + location.lon + '&appid=' + key + '&units=metric';

            //return fetch with the vvariable above
            return fetch(wRequestURL);
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            //adds every 8 entries (every 24h) to the weather list
            for (i = 0; i < data.list.length; i+=8){
                weather[i/8] = {
                    date: data.list[i].dt_txt,
                    icon: data.list[i].weather[0].icon,
                    temp: data.list[i].main.temp_max,
                    wind: data.list[i].wind.speed,
                    humidity: data.list[i].main.humidity
                }
            }
            //adds last entry cause above loop misses the last one
            weather[5] = {
                date: data.list[data.list.length-1].dt_txt,
                icon: data.list[data.list.length - 1].weather[0].icon,
                temp: data.list[data.list.length - 1].main.temp_max,
                wind: data.list[data.list.length - 1].wind.speed,
                humidity: data.list[data.list.length - 1].main.humidity
            }
            console.log(weather);
        });
}

weatherUpdate();
// function to get the coordinates from the city searched using GEOCODING API

// use passed log and lat to search for 6 counts of weather (every 8 in the weather list returned should be 24h appart)

// pass relevent information into 6 objects

//store the city name and fetch request into an object list in local stoage (10 objects long, no more)

// display search history buttons and the current search/most recent search