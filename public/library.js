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