/* display-events.js */

	var GC_APIKEY = 'YOUR_API_KEY_HERE';
    
	/*
	   loads event listings from a google calendar. 
	   
	   The Google calendar has to be shared, and you need the calendar id
	   (you can get this from calendar details page)	   
	  
	   calling loadGoogleEvents below:
	  
		loadGoogleEvents( { 
			id: '', 
			search: 'liverpool',
			count: 10, 
			callback: youDisplayFunction } ); 
			
		if you don't define a callback function then the default list is
		ran from the bottom of the script			
			
		you need to set GC_APIKEY = '' to your google key.
	*/
	function loadGoogleEvents( props )
	{
		props = props || {};
		props.id = props.id || '' ;
		props.search = props.search || '' ;
		props.count = props.count || 5 ;
		props.callback = props.callback || defaultEventDisplay ; 
		
		var timeMin = '2014-06-07T10:30:42.4564062Z'; //it's now so we don't get old events..
	
		var url = 'https://www.googleapis.com/calendar/v3/calendars/' + props.id + '/events?key=' + GC_APIKEY + '&timeMin=' + timeMin + '&singleEvents=true&orderBy=startTime';
		
		if ( props.search != '' ) {
			url = url + '&q=' + props.search;
		}
		
		if ( props.count > 0 ) {
			url = url + '&maxResults=' + props.count ;
		}			
		
		console.log(url); 
		loadEventsCalendar(url, props.callback); 
			
	}
	
	
	

	function loadEventsCalendar(url, displayCallback)
	{
		var events = new Array();
		
		$.ajax({
			url: url,
			dataType: 'jsonp',
			cache: false, 
			success: function(data) {
				$.each(data.items, function(i, ev) {
				
					var event = new Object();
					event.date = new Date(ev.start.dateTime);
					event.day = '';
					event.start = '';
					event.formattedDate = '';
					event.summary = ev.summary;
					event.url = ev.htmlLink;
					event.discription = ev.discription;
					
					if ( typeof event.date != 'undefined')
					{
						event.day = $.format.date(ev.start.dateTime, "ddd");
						event.formattedDate = $.format.date(ev.start.dateTime, "dd/MM/yyyy");
					}
					events.push(event);
				});
				displayCallback(events); 
			}
		});
	}
	
	/* default display - if you don't define a callback - you get this */
	function defaultEventDisplay(events)
	{
		var eventHtml = "" ; 
		
		$.each(events, function(i, ev)
		{
			eventHtml = eventHtml + '<li class="gc-event">' + '<a href="' + ev.htmlLink + '">' + ev.formattedDate + ' ' + ev.summary + '</a>' + '</li>'
		});
		
		$('<ul/>', {
			   'class': 'event-listing',
				 html: eventHtml
			   }).appendTo('#gc_events');
	}
