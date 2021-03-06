var current_page; // indicator for the page view
var pageViewLimit = 20;
var event_ID;
var category_ID;
var rsvped_events = {events:[]};

$(function() {
 // Handler for .ready() called.
	console.log('ready');
	
	$('#calendar').fullCalendar({
		eventClick: function(calEvent, jsEvent, view) {
			event_ID = calEvent.id;
		}
	});
	$('#calendar').fullCalendar('addEventSource',rsvped_events);
	
	$('#home_page').bind('pagebeforeshow',function(event, ui) {
		$.ajax({
			url: 'api/event/0/admin',
			dataType: "json",
			async: false,
			success: function (data, textStatus, jqXHR) {
				if (data.admin == "Yes") {
					$('#manage_events_button').show();
				} else {
					$('#manage_events_button').hide();
				}
				$('#main_pages').controlgroup('refresh');
			},
			error: ajaxError
		});
	});
	
	$('.page').bind('pagebeforeshow',function(event, ui) {
		$.ajax({
			url: '/user',
			dataType: "json",
			async: false,
			success: function (data, textStatus, jqXHR) {
				console.log("current user is "+data);
			},
			statusCode: {
				404: function() {
				  $.mobile.changePage('#not_logged_in_dialog', 'pop', true, true);
				}
			},
			error: ajaxError
		});
	});
	
	$('#browse_categories_page').bind('pagebeforeshow',function(event, ui){
		console.log('pagebeforeshow');
		
		$('.category_list_row').remove();
		
		$.ajax({
			url: "api/event/0/type/",
			dataType: "json",
			async: false,
			success: function(data, textStatus, jqXHR) {
				console.log(data);
				$('.category_list_row').remove();
				$.each(data,function(key,val) {
				$('#category_list').append('<li class="category_list_row" id="category_' + val.ID + '"><a href="#browse_events_page" data-category="0/type/' + val.ID + '/" data-transition="slide"><h3>' + val.EventTypeDesc + '</h3></a></li>');				});
			},
			error: ajaxError
		});
		
		$('#category_list').listview('refresh');
	});
				

	//Bind to the create so the page gets updated with the listing
	$('#browse_events_page').bind('pagebeforeshow',function(event, ui){
		console.log('pagebeforeshow');
		
		//JQuery Events
		$.ajax({
			url: "api/event/" + category_ID,
			dataType: "json",
	        async: false,
	        success: function(data, textStatus, jqXHR) {
				console.log(data);
				var i = 0;
				$('#hold_events').remove();
				$('#post_events').append('<div id="hold_events"/>');
				$.each(data.date,function(key,val) {
					$('#hold_events').append('<div data-role="collapsible" class="event_collapsible" id="event_collapsible' + i + '" data-theme="b" data-content-theme="c"><h3>' + val + '</h3></div>');
					$('#event_collapsible' + i).append('<ul data-role="listview" class="event_list" id="event_list' + i + '" data-inset="true" data-theme="d">');
					$.each(data[i],function(key,val) {
						$('#event_list' + i).append('<li><a href="#view_event_page" data-event="' + val.ID + '" data-transition="slide"><h3>' + val.Title + '</h3></a></li>');
						//$('#event_list' + i).append('<li><a href="#view_event_page&event_id=' + val.ID + '" data-transition="slide"><h3>' + val.Title + '</h3></a></li>');
						console.log(val.ID);
					});
					i++;
				});
	        },
	        error: ajaxError
		});
		$('.event_list').listview();
		$('.event_collapsible').collapsible();
	});
	
	
	$('#view_rsvps_page').bind('pagebeforeshow',function(event, ui){
		console.log('pagebeforeshow');
		
		//JQuery Events
		$.ajax({
			url: "api/event/0/rsvp/",
			dataType: "json",
	        async: false,
	        success: function(data, textStatus, jqXHR) {
				console.log(data);
				var i = 0;
				$('#no_rsvps').remove();
				$('.rsvp_collapsible').remove();
				$.each(data.date,function(key,val) {
					$('#rsvps').append('<div data-role="collapsible" class="rsvp_collapsible" id="rsvp_collapsible' + i + '" data-theme="b" data-content-theme="c"><h3>' + val + '</h3></div>');
					$('#rsvp_collapsible' + i).append('<ul data-role="listview" class="rsvp_list" id="rsvp_list' + i + '" data-inset="true" data-theme="d">');
					$.each(data[i],function(key,val) {
						$('#rsvp_list' + i).append('<li><a href="#view_event_page" data-event="' + val.ID + '" data-transition="slide"><h3>' + val.Title + '</h3></a></li>');
						console.log(val.ID);
					});
					i++;
				});
	        },
			statusCode: {
				404: function() {
					$('.rsvp_collapsible').remove();
					if ($('#no_rsvps').length == 0) {
						$('#rsvps').append('<h3 id="no_rsvps">You do not have any RSVPs.</h3>');
					}
				}
			},
	        error: ajaxError
		});
		$('.rsvp_list').listview();
		$('.rsvp_collapsible').collapsible();
	});

	$('#calendar_page').bind('pagebeforeshow',function(event, ui){
		console.log('pagebeforeshow');
		
		//JQuery Events
		$.ajax({
			url: "api/event/0/rsvp/",
			dataType: "json",
	        async: false,
	        success: function(data, textStatus, jqXHR) {
				console.log(data);
				var eventArray = [];
				$.each(data,function(key,val) {
					$.each(val,function(key,val) {
						if (val.StartTime != undefined) {
							var begin = val.StartTime.replace(/\s/g, "T").concat("-05:00");
							var finish = val.EndTime.replace(/\s/g, "T").concat("-05:00");
							eventArray.push({title:val.Title,start:begin,end:finish,url:'#view_event_page',id:val.ID});
						}
					});
				});
				rsvped_events.events = eventArray;
				console.log(rsvped_events);
	        },
	        error: ajaxError
		});
	});
	
	$('#calendar_page').bind('pageshow',function(event, ui){
		$('#calendar').fullCalendar('refetchEvents');
	});
	
	$('#view_event_page').bind('pagebeforeshow',function(event, ui){
		console.log("pagebeforeshow");
		event.preventDefault();
		console.log("View Event Page");
		console.log(ui);
		
		//var event_id = $.url().fparam("event_id");//$.mobile.activePage.data('url').split("=")[1];//ui.url().fparam("event_id");//$('a').attr("id"); //$.url().fparam("event_id"); //$.mobile.activePage.data('url').split("=")[1];
		//console.log("Event ID:" + event_id);
		//JQuery Events
		$.ajax({
			//url: "api/event/"+event_id,
			url: "api/event/" + event_ID,
			dataType: "json",
	        async: false,
	        success: function(data, textStatus, jqXHR) {
				console.log("Event is " + data.Title);
				
				var startHour = data.StartTime.split(" ")[1];
				var startDate = data.StartTime.split(" ")[0];
				
				var endHour = data.EndTime.split(" ")[1];
				var endDate = data.EndTime.split(" ")[0];
				
				//$('#actual_details').remove();
				//$('#actual_event').append('<div data-role="content" data-theme="b" data-content-theme="c" id="actual_details"><p>Name: ' + data.Title + '</br></br>Contact: ' + data.Email_address + '</br></br>Location: ' + data.Name + '</br></br>Time: ' + hour + '</br></br>Description: ' + data.Description + '</p></div>');
				if (startDate == endDate) {
					$('#event_text').html('Name: ' + data.Title + '</br></br>Location: ' + data.LocationName + '</br></br>Start Time: ' + startHour + '</br></br>End Time: ' + endHour + '</br></br>Contact: ' + data.Contact + '</br></br>Email: ' + data.Email_address + '</br></br>Phone Number: ' + data.Phone_number + '</br></br># of People Going: ' + data.People_Join + '</br></br>Description: ' + data.Description);
	        	}
				else {
					$('#event_text').html('Name: ' + data.Title + '</br></br>Location: ' + data.LocationName + '</br></br>Start Time: ' + startHour + ' on ' + startDate + '</br></br>End Time: ' + endHour + ' on ' + endDate + '</br></br>Contact: ' + data.Contact + '</br></br>Email: ' + data.Email_address + '</br></br>Phone Number: ' + data.Phone_number + '</br></br># of People Going: ' + data.People_Join + '</br></br>Description: ' + data.Description);
				}
			},
	        error: ajaxError
		});
		
		
		//$('#RSVPbutton').attr('data-event', event_ID);
		//$('#UNRSVPbutton').attr('data-event', event_ID);
		// checking for rsvp to see which button to display
		$.ajax({
			//url: "api/event/"+event_id,
			url: "api/event/0/rsvp/"+event_ID,
			dataType: "json",
	        async: false,
			type: 'GET',
	        success: function(data) {
				console.log("RSVP data is " + data['RSVP']);
				event_ID = data['event_ID'];
				
				if (data['RSVP'] == "No") {
					$("#UNRSVPbutton").hide();
					$("#RSVPbutton").show();
				}
				else {
					$("#RSVPbutton").hide();
					$("#UNRSVPbutton").show();
				}
					
			},
	        error: ajaxError
		});
		
		console.log($(".ui-page-active").attr("data-url"));
	});
	
	
	$('#manage_events_page').bind('pagebeforeshow',function(event, ui){
		console.log('pagebeforeshow');
		
		//JQuery Events
		$.ajax({
			url: "api/event/0/admin/all",
			dataType: "json",
	        async: false,
	        success: function(data, textStatus, jqXHR) {
				console.log(data);
				var i = 0;
				$('#hold_manage_events').remove();
				$('#manageable_events').append('<div id="hold_manage_events"/>');
				$.each(data.date,function(key,val) {
					$('#hold_manage_events').append('<div data-role="collapsible" class="event_collapsible" id="event_manage_collapsible' + i + '" data-theme="b" data-content-theme="c"><h3>' + val + '</h3></div>');
					$('#event_manage_collapsible' + i).append('<ul data-role="listview" class="event_list" id="event_list' + i + '" data-inset="true" data-theme="d">');
					$.each(data[i],function(key,val) {
						$('#event_manage_list' + i).append('<li><a href="#view_event_page" data-event="' + val.ID + '" data-transition="slide"><h3>' + val.Title + '</h3></a></li>');
						//$('#event_list' + i).append('<li><a href="#view_event_page&event_id=' + val.ID + '" data-transition="slide"><h3>' + val.Title + '</h3></a></li>');
						console.log(val.ID);
					});
					i++;
				});
	        },
	        error: ajaxError
		});
		$('.event_manage_list').listview();
		$('.event_manage_collapsible').collapsible();
	});
	
	//Bind the add page button
	/*
	$('#add_button').bind('click', function() {
		console.log("Add Button");
		$.ajax({
			url: "api/comment",
			dataType: "json",
	        async: false,
			data: {'commentText': $('#add_comment_text')[0].value},
			type: 'POST',
	        error: ajaxError
		});
	});
	*/
	
	
	$("a[href=#view_event_page]").live("click", function(e) {
	    console.log("check undefined = " + $(this).data("event"));
		if ($(this).data("event") != undefined) {
			event_ID = $(this).data("event");
			console.log("event_ID = " + event_ID);
		}
		else {
			console.log("Event ID not set bc undefined.")
		}
		//navIdentity = $(this).data("identity");
	    //$("#listbody").html( "<div>" + navIdentity + "</div>" );
	    //$("#list").page();                     
	});
	
	$("a[href=#browse_events_page]").live("click", function(e) {
	    category_ID = $(this).data("category");
		console.log("category_ID = " + category_ID);
		//navIdentity = $(this).data("identity");
	    //$("#listbody").html( "<div>" + navIdentity + "</div>" );
	    //$("#list").page();                     
	});
	
	
	$('#RSVPbutton').bind('click', function() 
	{ console.log("RSVP Button");
	      	$.ajax({
		    	url: "api/event/"+event_ID+"/rsvp",
			dataType: "json",
			async: false, 
			type: 'POST',
			success: function(data) {
				console.log("RSVPed");
				$("#RSVPbutton").hide();
				$("#UNRSVPbutton").show();
			},
			error: ajaxError
	       	});
	});
	
	$('#UNRSVPbutton').bind('click', function() 
	{ console.log("UNRSVP Button");
	      	$.ajax({
		    	url: "api/event/"+event_ID+"/rsvp",
			dataType: "json",
			async: false, 
			type: 'DELETE',
			success: function(data) {
				console.log("RSVPed");
				$("#UNRSVPbutton").hide();
				$("#RSVPbutton").show();
			},
			error: ajaxError
	       	});
	});
	/*
	$("#RSVPbutton").click(function(event) {
		$("#RSVPbutton").hide();
		$("#UNRSVPbutton").show();
		
		//event.preventDefault();
        if($(this).text() == 'RSVP'){
			$('#thersvp').html('<a href="#view_event_page" data-role="button" data-icon="check" data-theme="a" data-transition="pop" id="UnRSVPbutton"><h3>Un-RSVP</h3></a>');
		}
		else{
			$('#thersvp').html('<a href="#view_event_page" data-role="button" data-icon="check" data-theme="a" data-transition="pop" id="RSVPbutton"><h3>RSVP</h3></a>');
		}
		
		//$(this).button("refresh");
		
    });
	*/
	
	/*
	$("#UNRSVPbutton").click(function(event) {
		$("#UNRSVPbutton").hide();
		$("#RSVPbutton").show();
	});
	*/
	
	/*****************Admin*********************/
	// get the event list that they can manage
	/*
	$.ajax({
		url: 'api/event/0/admin/all',
		dataType: 'JSON',
		async: false,
		success: function(data) {
			console.log(data);
			$.each(data,function(key,val) {
			console.log(key);
			});
		},
		error: function(data) {
			console.log("Event " + data.statusText);
		}
	});
	*/
	
	// get the user list for a specific event
	/*
	$.ajax({
		url: 'api/event/0/admin/'+event_ID,
		dataType: 'JSON',
		async: false,
		success: function(data) {
			console.log(data);
			for (var i=0; i<data.length; i++)
			{
			// add the AcctName for that
			// 
			}
		},
		error: function(data) {
			console.log("Event " + data.statusText);
		}
	});
	*/
	
	/*************** posting ********************/
	$('#submitid').bind('click', function() 
	{ 
		var msg = validateAll();
		if(!msg)
		{
			console.log("form validation passed, ready to submit");
		  	$.ajax
		  	({
				url: "api/event/",
				dataType: "json",
				async: false, 
				data: 
				{ 
					"Title" : $('#enameid').val(), 
					"OrganizationName" : $('#eorganizationid').val(),
					"Email" : $('#eemailid').val(),
					"Phone" : $('#ephoneid').val(),
					"Contact" : $('#econtactid').val(),
					"Location" : $('#elocationid').val(),
					"LatCoord" : "",
					"LongCoord" : "",
					"EventTypeDesc" : $('#etypeid').val(),
					"Description" : $('#edescriptionid').val(),
					"StartTime" : $('#estartdateid').val() + " " + $('#estarttimeid').val(),
				   	"EndTime" : $('#eenddateid').val() + " " + $('#eendtimeid').val()
				 },
				type: 'POST',
				success: function(data) 
				{
					console.log("form submitted successful");
				},
				error: ajaxError
			});
		}
		else
		{
			console.log("form validation failed, can't submit");
			showError(msg);
		}
	});
	
	
	/*
	//******************** editing event post *************************
	//need a button to bind to
	$('#').bind('click',function()
	{
		console.log("editing an event post (id: " + event_ID + ")");
		$.ajax
		({
			url: "api/event/"+event_ID,
			dataType: "json",
	        async: false,
			type: 'GET',
	        success: function(data) 
	        {
	            
				$('#enameid').val(data['Title']);
				$('#eorganizationid').val(data['OrganizationName']);
				$('#eemailid').val(data['Email_address']);
				$('#ephoneid').val(data['Phone_number']);
				$('#econtactid').val(data['Contact']);
				$('#elocationid').val(data['Location']);
				$('#etypeid').val(data['EventTypeDesc']);
				$('#edescriptionid').val(data['Description']);
				
				var stemp = data['StartTime'].split(" ");
				$('#estartdateid').val(stemp[0]);
				$('#estarttimeid').val(stemp[1]);
				
			    var etemp = data['EndTime'].split(" ");
		       	$('#eenddateid').val(etemp[0]);
		       	$('#eendtimeid').val(etemp[1]);
		       	
		       	console.log("JSON object received successfully: ");
		   
		       	console.log("org: " + data['OrganizationName']);
		       	console.log("title: " + data['Title']);
		       	console.log("email: " + data['Email_address']);
		       	console.log("phone: " + data['Phone_number']);
		       	console.log("contact: " + data['Contact']);
		       	console.log("location: " + data['LocationName']);
		       	console.log("type: " + data['EventTypeDesc']);
		       	console.log("description: " + data['Description']);
		       	console.log("start date: " + stemp[0]);
		       	console.log("start time: " + stemp[1]);
		       	console.log("end date: " + etemp[0]);
		       	console.log("end time: " + etemp[1]);
		    },
	        error: ajaxError
		});
	});
	*/
	
});

function formatList(ele_div,data) {
	var l = data['date'].length;

	for (i=0;i<l;i++){
		// day -- a button display the day
		var js_obj = { date : data['date'][i] };
		$('#dateHeaderTemplate').tmpl(js_obj).appendTo(ele_div);
		var l2 = data[i].length;
		for (j=0; j<l2; j++){
			$('#menuiconTemplate').tmpl(data[i][j]).appendTo(ele_div);
		}
	}
}

function eventIndex(){
	$.ajax({
		url: "api/event",
		context: document.body,
		success: function(data){
			formatList($('#IndexResult').empty(),eval('('+data+')'));
		}
	});
}

function eventGet(id){
	$.ajax({
		url: "api/event/"+id,
		context: document.body,
		success: function(data){
			$('#GetResult').empty().html(data);
		}
	});
}

function eventPagination(limit,offset){
	$.ajax({
		url: "api/event/"+offset+"/page/"+limit,
		context: document.body,
		success: function(data){
			formatList($('#IndexResult').empty(),eval('('+data+')'));
		}
	});
}

/*
function simplePost(){
	$.ajax({
		url: "api/simple",
		data: {'itemValue': 'testItemValue'},
		context: document.body,
		type: 'POST',
		success: function(data){
			$('#PostResult').html(data);
		}
	});
}
function simplePut(){
	$.ajax({
		url: "api/simple/testItemValue",
		context: document.body,
		data: {'itemValue': 'testItemNewValue'},
		headers: {'X-HTTP-Method-Override': 'PUT'},
		type: 'POST',
		success: function(data){
			$('#PutResult').html(data);
		}
	});
}
function simpleDelete(){
	$.ajax({
		url: "api/simple/testItem",
		context: document.body,
		type: 'DELETE',
		success: function(data){
			$('#DeleteResult').html(data);
		}
	});
}
*/

function prevPageView(){
	if (current_page > 1) {
		// go back to previous pageViewLimit result
	}
}

function nextPageView(){
	
}

/* Do it once the page finish loading */

$(document).ready(function(){
	// start with first pageViewLimit most recent events
	eventPagination(pageViewLimit,0);
	current_page = 1;
	
	// $("a").on("click", function (event) {
	// 
	//    console.log("click" + $(this).attr("href"));//var parm = $(this).attr("data-event-id");
	//    //do something here with parameter on page 2 (or any page in the dom)
	//    //$("#event_text").html(parm);
	// 
	// });
	

});

/******************************************************************************/

function ajaxError(jqXHR, textStatus, errorThrown){
	console.log('ajaxError '+textStatus+' '+errorThrown);
	/*
	$('#error_message').remove();
	$("#error_message_template").tmpl( {errorName: textStatus, errorDescription: errorThrown} ).appendTo( "#error_dialog_content" );
	$.mobile.changePage($('#error_dialog'), {
		transition: "pop",
		reverse: false,
		changeHash: false
	});*/
}


//********************* form validation functions *********************************
function validateInputText(id, msg)
{	
	console.log("validating element: " + id);
	var element = $(id);
	
	if(!element.val())
	{
		console.log(id + "  ---> empty");
		return msg;
	}
	return "";
}

function validateAll(err)
{
	var msg = "Missing ";
	msg += validateInputText('#eorganizationid', "organization name\n");
	msg += validateInputText('#eemailid', ", email address\n");
	msg += validateInputText('#ephoneid', ", phone number\n");
	msg += validateInputText('#econtactid', ", contact name\n");
	msg += validateInputText('#etypeid', ", event type\n");
	msg += validateInputText('#estartdateid', ", event start date\n");
	msg += validateInputText('#estarttimeid', ", event start time\n");
	msg += validateInputText('#eenddateid', ", event end date\n");
	msg += validateInputText('#eendtimeid', ", event end time\n");
	msg += validateInputText('#elocationid', " , event location address\n");
	msg += validateInputText('#edescriptionid', ", event description name\n");
	
	if(msg)
	{
		msg += "."
	}
	return msg;
}

function showError(msg)
{
	if(msg)
	{
		$("<div />", {text: msg}).dialog({title: "ERROR"});
	}
}
