try {
    var cityList = JSON.parse(localStorage.getItem("cityList"));
} catch {
    var cityList = [];
}

function weatherUpdate(city){

    // API key
    var key = '0d5eaf94c0bcbc10362599a78ea0e18c'

    //searched city
    // var city = "Richmond";

    //GeoCoding Request URL

    var gRequestURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + key;

    // Weather Request URL for ease of access
    // var wRequestURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + '44.34' + '&lon=' + '10.99' + '&appid=' + key + '&units=metric';

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
            var weather = [];
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
            // console.log(weather);

            return weather;
        }).then(function (weather) {
            var fArray = document.querySelectorAll('div.future');
            var today = document.querySelectorAll('div.currentDate');

            today[0].children[0].children[0].textContent = city;
            today[0].children[0].children[1].textContent = weather[0].date;
            today[0].children[1].src = 'https://openweathermap.org/img/wn/' + weather[0].icon + '.png'
            today[0].children[2].children[0].textContent = weather[0].temp;
            today[0].children[3].children[0].textContent = weather[0].wind;
            today[0].children[4].children[0].textContent = weather[0].humidity;

            for (i = 0; i < fArray.length; i++) {

                fArray[i].children[0].children[0].textContent = weather[i+1].date;
                fArray[i].children[1].src = 'https://openweathermap.org/img/wn/' + weather[i+1].icon + '.png'
                fArray[i].children[2].children[0].textContent = weather[i+1].temp;
                fArray[i].children[3].children[0].textContent = weather[i+1].wind;
                fArray[i].children[4].children[0].textContent = weather[i+1].humidity;
            }
        })
    
}

document.querySelector('#searchBtn').addEventListener('click', function () {
    var city = document.querySelector('#searchInput').value;
    if (city == ''){
        alert("Please enter a City");
        return;
    }
    var searchHistory = document.querySelector('#searchHistory');

    weatherUpdate(city);
    if (cityList.length < 6){
        cityList.unshift(city);
    } else {
        cityList.pop();
        cityList.unshift(city);
    }
    localStorage.setItem("cityList", JSON.stringify(cityList));
    // console.log(localStorage.getItem("cityList"));
    // console.log(cityList[0]);
    searchHistory.innerHTML = '';
    createHistory();
})

createHistory();

function createHistory () {
    var searchHistory = document.querySelector('#searchHistory');

    for (i =0; i < cityList.length; i++){
        var btn = document.createElement('button');
        btn.textContent = cityList[i];
        btn.className = "col";
        btn.addEventListener('click', searchCityHistory);
        searchHistory.appendChild(btn);
        // console.log(btn);
    }

}

function searchCityHistory () {
    var city = this.textContent;
    weatherUpdate(city);
}