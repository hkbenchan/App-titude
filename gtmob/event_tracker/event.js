var current_page; // indicator for the page view
var pageViewLimit = 20;

function formatList(ele_div,data) {
	var l = data['date'].length;

	for (i=0;i<l;i++){
		// day -- a button display the day
		var button = "<input type=\"button\" name=\"event\" value=\""+data['date'][i]+"\" onclick=\"return false;\">";
		ele_div.append(button);
		var l2 = data[i].length;
		for (j=0; j<l2; j++){
			//var link = "<input type=\"button\" name=\"event\" value=\""+data[i][j]['Title']+"    "+data[i][j]['StartTime']+"\" onclick=\"eventGet("+data[i][j]['ID']+");\">";
			$('#menuiconTemplate').tmpl(data[i]).appendTo(ele_div);
			//ele_div.append(link);
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