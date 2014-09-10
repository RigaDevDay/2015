function initialize() {
	var myLatlng = new google.maps.LatLng(56.92562599999999,24.105833800000028);
	var mapOptions = {
		zoom: 12,
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

	var multikinoMarker = new MarkerWithLabel({
		position: myLatlng,
		map: map,
		title: 'Riga Dev Day 2015',
		icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
		labelContent: 'Multikino',
	      labelAnchor: new google.maps.Point(35, -5),
	      labelClass: 'map-label'
	});
	
	var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<div id="bodyContent">'+
      '<a href="http://www.islandehotel.lv/"><img src="/assets/img/islande.jpg"></a>'+
      '</div>'+
      '</div>';
      
	var infowindow = new google.maps.InfoWindow({
		content: contentString
	});
	
	var hotelCoordinates = new google.maps.LatLng(56.951178,24.08415,17);

	var hotelMarker = new MarkerWithLabel({
	      position: hotelCoordinates,
	      map: map,
	      title: 'Islande Hotel',
	      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
	      labelContent: 'Islande Hotel',
	      labelAnchor: new google.maps.Point(48, -5),
	      labelClass: 'map-label'
  	});
  	
  	google.maps.event.addListener(hotelMarker, 'click', function() {
		infowindow.open(map, hotelMarker);
	});

}

google.maps.event.addDomListener(window, 'load', initialize);


