gCalSummaries
=============

Basic script to build and event listings from a google calendar. 

**You will need a google API key**

display-events.js
-----------------

The best way to call it is via loadGoogleEvents.


```JavaScript
loadGoogleEvents( { 
	id: '', 
	search: 'liverpool',
	count: 10, 
	callback: youDisplayFunction } ); 
```

Where the callback will reviece an array of event objects


```Javascript
function callback(events)
```

The events will have all the standard google things set. 

https://developers.google.com/google-apps/calendar/v3/reference/events

so you can do things like event.summary to get the name.

