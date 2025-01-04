// Library used for the index page

// Swap values between departure and arrival inputs
function swapValues() {
	let tmp = document.getElementById('partenza').value;
	document.getElementById('partenza').value = document.getElementById('arrivo').value;
	document.getElementById('arrivo').value = tmp;
	tmp = document.getElementById('codicePartenza').value;
	document.getElementById('codicePartenza').value = document.getElementById('codiceArrivo').value;
	document.getElementById('codiceArrivo').value = tmp;
}

// Enabling autocomplete of station departure and arrival
function stationDropdownMenu() {
	{
		// Getting JSON data to autocomplete with from a stored file
		$.getJSON('/public/stazioni.json', function(stazioni) {
			const partenza = document.getElementById('partenza');
			const codicePartenza = document.getElementById('codicePartenza');
			const arrivo = document.getElementById('arrivo');
			const codiceArrivo = document.getElementById('codiceArrivo');

			// Enabling autocomplete for departure
			autocomplete({
				input: partenza,
				minLenght: 1,
				emptyMsg: 'Nessuna stazione trovata',
				fetch: function(text, update) {
					text = text.toLowerCase();
					const suggestions = stazioni.filter(n => n.label.toLowerCase().includes(text));
					update(suggestions);
				},
				onSelect: function(item) {
					partenza.value = item.label + ' (' + item.value + ')';
					codicePartenza.value = item.value;
				},
			});
			// Enabling autocomplete for arrival
			autocomplete({
				input: arrivo,
				minLenght: 1,
				emptyMsg: 'Nessuna stazione trovata',
				fetch: function(text, update) {
					text = text.toLowerCase();
					const suggestions = stazioni.filter(n => n.label.toLowerCase().includes(text));
					update(suggestions);
				},
				onSelect: function(item) {
					arrivo.value = item.label + ' (' + item.value + ')';
					codiceArrivo.value = item.value;
				},
			});
		});
	}
}

// Sets date and time when you get to the index page to your current ones
function dateTimeSetter() {
	const today = new Date();
	const date = today.toISOString().substr(0, 10);
	let time;
	// console.log(time);
	time = today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
	time += today.getMinutes() < 10 ? ':0' + today.getMinutes() : ':' + today.getMinutes();
	document.getElementById('data').value = date;
	document.getElementById('ora').value = time;
	console.log('Date and time set');
}

// If the input data is saved in the session, it updates the data in the page input elements
function loadSessionStorage() {
	if(sessionStorage.getItem('partenza')) {
		$('#partenza').val(sessionStorage.getItem('partenza'));
	}
	if(sessionStorage.getItem('codicePartenza')) {
		$('#codicePartenza').val(sessionStorage.getItem('codicePartenza'));
	}
	if(sessionStorage.getItem('arrivo')) {
		$('#arrivo').val(sessionStorage.getItem('arrivo'));
	}
	if(sessionStorage.getItem('codiceArrivo')) {
		$('#codiceArrivo').val(sessionStorage.getItem('codiceArrivo'));
	}
	if(sessionStorage.getItem('ora')) {
		$('#ora').val(sessionStorage.getItem('ora'));
	}
	if(sessionStorage.getItem('codiceArrivo')) {
		$('#data').val(sessionStorage.getItem('data'));
	}
	console.log('Loaded from session storage');
}

// Saving data before POST in the session storage with form input values
function saveSessionStorage() {
	sessionStorage.setItem('partenza', $('#partenza').val());
	sessionStorage.setItem('codicePartenza', $('#codicePartenza').val());
	sessionStorage.setItem('arrivo', $('#arrivo').val());
	sessionStorage.setItem('codiceArrivo', $('#codiceArrivo').val());
	sessionStorage.setItem('data', $('#data').val());
	sessionStorage.setItem('ora', $('#ora').val());
	console.log('Saved to session storage');
}

// Button animation function
function buttonLoadingAnimation(button) {
	const spin_button = $('#' + button.id);
	spin_button.button('loading');
	setTimeout(function() {
		spin_button.button('reset');
	}, 1000);
}

function setYearToElementTextContent(id) {
	const elem = document.getElementById(id);
	elem.textContent = (new Date()).getFullYear()
}

function stationDropdownMenuTabellone() {
	// Getting JSON data to autocomplete with from a stored file
	$.getJSON('/public/stazioni_tabellone.json', (stazioni) => {
		const stazione = document.getElementById('stazione');
		const codiceStazione = document.getElementById('codiceStazione');

		// Set a default station if none is set
		if(!codiceStazione.value) {
			codiceStazione.value = "1728"
			stazione.value = "Milano Centrale"
		}

		stazioni = stazioni.map((stazione) => {
			return {label: capitalize(stazione.label.toLowerCase()), value: stazione.value}
		})
		

		// set config for autocomplete.js
		const config = {
			selector: '#stazione',
			placeHolder: 'Cerca stazione',
			data: {
				src: stazioni,
				// Data source 'Object' key to be searched
				keys: ["label"]
			},
			resultsList :{
				class: "input-secondary",
			} 
		}
		// create the autocomplete
		const autocomplete = new autoComplete(config);
		// setup the selection event
		document.querySelector("#stazione").addEventListener("selection", function (event) {
			// "event.detail" carries the autoComplete.js "feedback" object
			const item = event.detail.selection.value;
			stazione.value = item.label;
			codiceStazione.value = item.value;
		});
		document.querySelector("#stazione").addEventListener("focus", function (event) {
			const inputValue = autocomplete.input.value;
			if (inputValue.length > 0) {
				autocomplete.start();
			}
		});
	});
}

function capitalize(str) {
	const sentences = str.split(' ');
  sentences.forEach((sentence, index) => {
    sentences[index] = sentence.charAt(0).toUpperCase() + sentence.slice(1);
  });
  return sentences.join(' ');
}

function saveSessionStorage(name,object) {
	sessionStorage.setItem(name,JSON.stringify(object))
}
function loadSessionStorage(name) {
	if(sessionStorage.getItem(name)) {
		return JSON.parse(sessionStorage.getItem(name))
	} else {
		return null
	}
}

function followTrain(trainCode, trainsData) {
	// check if trainCode is in trainsData 
	let trainExists = false;
	for (let i = 0; i < trainsData.length; i++) {
		if(trainsData[i]['code'] === trainCode) {
			trainExists = true;
			break;
		}
	}
	let followedTrains = loadSessionStorage('followedTrains');
	if(followedTrains === null) {
		followedTrains = [trainCode];
		saveSessionStorage('followedTrains',followedTrains);
	} else {
		followedTrains = cleanFollowedTrains(followedTrains, trainsData)
		if (!followedTrains.includes(trainCode)) {
			followedTrains.push(trainCode)
			saveSessionStorage('followedTrains',followedTrains);
		} else {
			let index = followedTrains.indexOf(trainCode)
			if (index > -1) {
				followedTrains.splice(index, 1);
			}
			saveSessionStorage('followedTrains',followedTrains);
		}
	}
	return followedTrains;
}

function cleanFollowedTrains(followedTrains, trainsData) {
	let cleanedFollowedTrains = []
	// console.log('Dirty:'+followedTrains)
	for (let i = 0; i < followedTrains.length; i++) {
		for (let j = 0; j < trainsData.length; j++) {
			if(followedTrains[i] === trainsData[j]['code']) {
				cleanedFollowedTrains.push(followedTrains[i])
			}
		}
	}
	// console.log('Clean:'+cleanedFollowedTrains)
	return cleanedFollowedTrains
}

function urlBase64ToUint8Array(base64String) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding)
		.replace(/\-/g, "+")
		.replace(/_/g, "/");
	const rawData = atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}