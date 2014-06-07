/* display-events.js */


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
		
		var timeMin = new Date().toISOString(); //it's now so we don't get old events..
		console.log(timeMin); 
	
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
					event.start = '';
					event.formattedDate = '';
					event.summary = ev.summary;
					event.htmlLink = ev.htmlLink;
					event.description = ev.description;
					
					if ( typeof event.date != 'undefined')
					{
						event.formattedDate = $.format.date(ev.start.dateTime, "ddd dd MMMM yyyy");
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
	
		var eventList = $('<div class="event-list"/>') ;
		
		
		$.each(events, function(i, ev)
		{
			var eventHtml = $([
				'<div itemscope itemtype="http://schema.org/Event" class="event-item">',
				'  <a itemprop="url" href="' + ev.htmlLink + '">',
				'    <div itemprop="name" class="event-title">' + ev.summary + '</div>',
				'  </a>',
				'	 <span itemprop="startDate" content="' + ev.date + '" class="event-date">'+ ev.formattedDate + '</span>',
				'	 <div itemprop="description">' + ev.description + '</div>',
				'</div>'
				].join("")).appendTo(eventList);
				
				
			// eventHtml = eventHtml + '<li class="gc-event">' + '<a href="' + ev.url + '">' + ev.formattedDate + ev.start + ': ' + ev.summary + '</a>' + '</li>'
		});
		
		eventList.appendTo('#gc_events');
	}
