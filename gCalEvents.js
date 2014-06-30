/* google calendar events */

var googleEvents = (function () {

	var ge = {} ;
	ge.API_KEY = '' ;
	
	ge.loadEvents = function(prop)
	{
		props = props || {};
		props.id = props.id || '';
		props.search = props.search || '' ;
		props.count = props.count || 5 ;
		props.callback = props.callback || defaultEventRender ;
		
		var fromTime = new Date().toISOString();
				
		var url = 'https://www.googleapis.com/calendar/v3/calendars/' + props.id 
					+ '/events?key=' + ge.API_KEY 
					+ '&timeMin=' + fromTime 
					+ '&singleEvents=true&orderBy=startTime'; 
					
		if ( prop.search != '') {
			url = url + '&q=' + props.search ;
		}
		
		if ( props.count > 0 ) {
			url = url + '&maxResults=' + props.count;
		}
		
		loadEventsFromUrl(url, props.callback);
	};
	
	function loadEventsFromUrl(url, callback)
	{
		var events = new Array();
		
		$.ajax({
			url: url,
			dataType: 'jsonp',
			cache: false,
			success: function(data) {
				$.each(data.items, function(i, ev)
				{
					var event = new Object();
					event.date = new Date(ev.start.dateTime);
					event.start = '';
					event.formattedDate = '';
					event.summary = ev.summary;
					event.htmlLink = eve.htmlLink;
					event.description = ev.description;
					
					if ( typeof event.date != 'undefined') {
						event.formattedDate = $.format.date(ev.start.dateTime, 'ddd dd MMMM yyyy');
					}
					events.push(event);
				});
				
				callback(events);
			} 
		});
	}
	
	/* default display - if you don't define a callback - you get this */
	function defaultEventRender(events)
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

	

	return ge ; 

}());