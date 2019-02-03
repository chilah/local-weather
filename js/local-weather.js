$(document).ready(function () {
	var city = $('#city'),
		date = $('#date'),
		temp = $('#temp'),
		celc = $('#celcius'),
		fah = $('#fahrenheit'),
		description = $('#description'),
		humidity = $('#humidity'),
		wind = $('#wind'),
		sunrise = $('#sunrise'),
		sunset = $('#sunset'),
		getTemp;

	// require for a geolocation
	function geolocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(getPostion, getError);
		} else {
			alert('Your browser is not supported geolocation');
		}
	}

	// call api by latitude and longitude 
	function getPostion(position) {
		const { coords } = position;

		fetch(`https://fcc-weather-api.glitch.me/api/current?lon=${coords.longitude}&lat=${coords.latitude}`)
			.then(response => response.json())
			.then(data => getWeather(data))
			.catch(err => console.log(err));
	}
	
	// when error display message and hide everthing
	function getError(error) {
		$('#city').addClass('error').text(error.message);
		$('#weatherDisplay').hide();
	}

	// display weather detail and icon
	function getWeather(data) {
		// display city and location icon
		city.html('<span><i class="fas fa-map-marker-alt"></i></span> ' + data.name + ', ' + data.sys.country);
		// display temperature as celcius unit
		temp.text(data.main.temp.toFixed());
		// display description weather
		description.text(data.weather[0].main);

		// display humidity 
		var humidityVal = $('<p></p>').text(data.main.humidity +' %');
		humidity.append(humidityVal);

		// display wind
		var windVal = $('<p></p>').text(data.wind.speed + ' km/hr');
		wind.append(windVal);
		
		// get temperture for convert to fahrenheit
		getTemp = data.main.temp;
		// set sunrise and sunset
		setSunTime(data.sys.sunrise);
		setSunTime(data.sys.sunset);
		// display icon depend on description
		getIcon(data.weather[0].main);
		// display date
		setDate();
	}

	// set time for sunrise and sunrise
	function setSunTime(time) {
		var today = new Date(time * 1000);
		var h = today.getHours();
		var m = today.getMinutes();
		var adjustHour = h;
		var adjustMin = m < 10 ? '0' + m: m;
		var createParagraph = $('<p></p>');
		
		if (h >= 12) {
		  adjustHour = adjustHour - 12;
		  createParagraph.text('0' + adjustHour + ':' + adjustMin + ' PM');
		  sunset.append(createParagraph);
		}
		
		if (h < 10) {
		  createParagraph.text('0' + adjustHour + ':' + adjustMin + ' AM');
		  sunrise.append(createParagraph);
		}
	}

	// set date, month and year
	function setDate() {
		var today = new Date();
		var d = today.getDate();
		var m = today.getMonth();
		var y = today.getFullYear();
		var month = ['January', 'Febuary', "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		date.text(`${d} ${month[m]} ${y}`);	
	}

	// set icon depend on description
	function getIcon(weatherIcon) {
		var icon = weatherIcon.toLowerCase();

		switch(icon) {
			case 'clouds':
				$('#weatherDisplay i').addClass('wi wi-cloudy');
				break;
			case 'sunny':
				$('#weatherDisplay i').addClass('wi wi-day-sunny');
				break;
			case 'clear':
				$('#weatherDisplay i').addClass('wi wi-day-sunny');
				break;
			case 'thunderstorm':
				$('#weatherDisplay i').addClass('wi wi-storm-showers');
				break;
			case 'snow':
				$('#weatherDisplay i').addClass('wi wi-snow');
				break;
			case 'rain':
				$('#weatherDisplay i').addClass('wi wi-rain');
				break;
		}
	}

	// call geolocation function for request latitude and longitude
	geolocation();

	// convert celcius to fahrenheit
	fah.click(function() {
		var convertToFahrenheit = (getTemp * 9 / 5) + 32;

		temp.html(convertToFahrenheit.toFixed());
		celc.removeClass('active');
		fah.addClass('active');
	});

	// show celcius unit
	celc.click(function() {
		temp.html(getTemp.toFixed());
		fah.removeClass('active');
		celc.addClass('active');
	});
});