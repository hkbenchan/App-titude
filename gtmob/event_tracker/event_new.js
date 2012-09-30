var current_page; // indicator for the page view
var pageViewLimit = 20;

$(function() {
 // Handler for .ready() called.
	console.log('ready');

	//Bind to the create so the page gets updated with the listing
	$('#browse_events_page').bind('pagebeforeshow',function(event, ui){
		console.log('pagebeforeshow');
		
		//JQuery Events
		$.ajax({
			url: "api/event",
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
						$('#event_list' + i).append('<li><a href="#view_event_page&event_id=' + val.ID + '" data-transition="slide"><h3>' + val.Title + '</h3></a></li>');
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
	
	
	
	$('#view_event_page').bind('pagebeforechange',function(event, ui){
		event.preventDefault();
		console.log("View Event Page");
		console.log(ui['prevPage']['context']['URL']);
		
		var event_id = $.url().fparam("event_id");//$.mobile.activePage.data('url').split("=")[1];//ui.url().fparam("event_id");//$('a').attr("id"); //$.url().fparam("event_id"); //$.mobile.activePage.data('url').split("=")[1];
		console.log("Event ID:" + event_id);
		//JQuery Events
		$.ajax({
			url: "api/event/"+event_id,
			dataType: "json",
	        async: false,
	        success: function(data, textStatus, jqXHR) {
				console.log("Event is " + data.Title);
				
				var hour = data.StartTime.split(" ")[1];
				
				//$('#actual_details').remove();
				//$('#actual_event').append('<div data-role="content" data-theme="b" data-content-theme="c" id="actual_details"><p>Name: ' + data.Title + '</br></br>Contact: ' + data.Email_address + '</br></br>Location: ' + data.Name + '</br></br>Time: ' + hour + '</br></br>Description: ' + data.Description + '</p></div>');
				$('#event_text').html('Name: ' + data.Title + '</br></br>Contact: ' + data.Email_address + '</br></br>Location: ' + data.Name + '</br></br>Time: ' + hour + '</br></br>Description: ' + data.Description);
	        },
	        error: ajaxError
		});
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
});

/******************************************************************************/

function ajaxError(jqXHR, textStatus, errorThrown){
	console.log('ajaxError '+textStatus+' '+errorThrown);
	$('#error_message').remove();
	$("#error_message_template").tmpl( {errorName: textStatus, errorDescription: errorThrown} ).appendTo( "#error_dialog_content" );
	$.mobile.changePage($('#error_dialog'), {
		transition: "pop",
		reverse: false,
		changeHash: false
	});
}