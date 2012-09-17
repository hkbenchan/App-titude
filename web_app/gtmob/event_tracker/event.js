function simpleIndex(){
	$.ajax({
		url: "../base_widget/simple",
		context: document.body,
		success: function(data){
			$('#IndexResult').html(data);
		}
	});
}
function simpleGet(){
	$.ajax({
		url: "../base_widget/simple/testItemValue",
		context: document.body,
		success: function(data){
			$('#GetResult').html(data);
		}
	});
}
function simplePost(){
	$.ajax({
		url: "../base_widget/simple",
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
		url: "../base_widget/simple/testItemValue",
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
		url: "../base_widget/simple/testItem",
		context: document.body,
		type: 'DELETE',
		success: function(data){
			$('#DeleteResult').html(data);
		}
	});
}