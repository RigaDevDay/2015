function initialize() {
	var myLatlng = new google.maps.LatLng(56.92562599999999,24.105833800000028);
	var mapOptions = {
		zoom: 13,
		center: myLatlng,
		zoomControlOptions: {
			position: google.maps.ControlPosition.RIGHT_CENTER
		},
		mapTypeControl: false,
		streetViewControl: false,
		panControl: false,
		scrollwheel: false,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var map = new google.maps.Map(document.getElementById('map-container'), mapOptions);

	var marker = new google.maps.Marker({
		position: myLatlng,
		map: map,
		title: 'Java Day Riga 2014'
	});
}

google.maps.event.addDomListener(window, 'load', initialize);

