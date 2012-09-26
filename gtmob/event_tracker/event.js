var current_page; // indicator for the page view
var pageViewLimit = 20;

function formatList(ele_div,data) {
	var l = data['date'].length;
	var button_ui = "<div data-corners=\"true\" data-shadow=\"true\" data-iconshadow=\"true\" data-wrapperels=\"span\" data-icon=\"null\" data-iconpos=\"null\" data-theme=\"c\" data-inline=\"false\" data-mini=\"false\" class=\"ui-btn ui-shadow ui-btn-corner-all ui-fullsize ui-btn-block ui-btn-up-c\" aria-disabled=\"false\"><span class=\"ui-btn-inner ui-btn-corner-all\"><span class=\"ui-btn-text\">";
	
	for (i=0;i<l;i++){
		// day -- a button display the day
		var button = button_ui + data['date'][i]+"</span></span><input type=\"button\" name=\"event\" value=\""+data['date'][i]+"\" onclick=\"return false;\"></div>";
		ele_div.append(button);
		var l2 = data[i].length;
		for (j=0; j<l2; j++){
			var link = button_ui + data[i][j]['Title']+"</span></span><input type=\"button\" name=\"event\" value=\""+data[i][j]['Title']+"    "+data[i][j]['StartTime']+"\" onclick=\"eventGet("+data[i][j]['ID']+");\"></div>";
			ele_div.append(link);
		}
	}
}

function eventIndex(){
	$.ajax({
		url: "api/event",
		context: document.body,
		success: function(data){
			formatList($('#IndexResult').empty(),eval('('+data+')'));
			$('#IndexResult input:button').button();
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
			$('#IndexResult input:button').button();
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